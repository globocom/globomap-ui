/*
Copyright 2017 Globo.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const fs = require('fs');
const crypto = require('crypto');
const https = require('https');

const axios = require('axios');
const Redis = require('ioredis');
const ioSession = require("express-socket.io-session");

const config = require('./config');
const app = require('./app').app;
const sessionMiddleware = require('./app').sessionMiddleware;
const oauthClient = require('./oauthClient');

const zabbixEquipmentTypes = process.env.ZABBIX_EQUIP_TYPES || 'Servidor,Servidor Virtual';
const pageSize = process.env.PAGE_SIZE || 20;

class IOServer {
  constructor(io) {
    https.globalAgent.options.ca = fs.readFileSync(config.certificates);

    if(io === undefined) {
      return;
    }

    this.redis = null;
    if (config.redisSentinelsHosts) {
      this.redis = new Redis({
        name: config.redisSentinelsService,
        password: config.redisPassword,
        sentinels: config.redisSentinelsHosts.map((sentinelHost) => {
          return {
            host: sentinelHost,
            port: config.redisSentinelsPort
          }
        })
      });
    } else {
      this.redis = new Redis({
        host: config.redisHost,
        port: config.redisPort,
        password: config.redisPassword
      });
    }

    io.use(function(socket, next) {
      sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.use(function(socket, next) {
      if (app.get('disable-auth')) {
        return next();
      }

      const session = socket.request.session;
      if (session && session.tokenData) {
        oauthClient.isAuthenticated(session, isAuthenticated => {
          if (isAuthenticated) {
            next();
          } else {
            next(new Error('Authentication error'));
          }
        });
      } else {
        next(new Error('Authentication error'));
      }
    });

    const eventList = [
      { event: 'getcollections', fn: this.getCollections },
      { event: 'getgraphs', fn: this.getGraphs },
      { event: 'getnode', fn: this.getNode },
      { event: 'findnodes', fn: this.findNodes },
      { event: 'traversalsearch', fn: this.traversalSearch },
      { event: 'getenviron', fn: this.getEnviron },

      // Zabbix
      { event: 'getmonitoring', fn: this.getMonitoring },
      { event: 'getZabbixGraph', fn: this.getZabbixGraph },

      // { event: 'user:savemap', fn: this.saveUserMap },
      // { event: 'user:getmap', fn: this.saveUserMap },

      // Redis
      { event: 'savesharedmap', fn: this.saveSharedMap },
      { event: 'getsharedmap', fn: this.getSharedMap }
    ];

    io.on('connection', (socket) => {
      for(let i=0, l=eventList.length; i<l; ++i) {
        socket.on(eventList[i].event, (data, fn) => {
          eventList[i].fn.apply(this, [data, (result) => { fn(result); }]);
        });
      }
    });
  }

  getCollections(data, fn) {
    const url = `${config.globomapApiUrl}/collections`;

    axios.get(url, {
      responseType: 'json'
    })
    .then((response) => {
      fn(response.data);
    })
    .catch((error) => {
      let errorMsg = this.handleError(error);
      fn({ error: true, message: errorMsg || 'Get Collections Error' });
    });
  }

  getGraphs(data, fn) {
    const url = `${config.globomapApiUrl}/graphs`;

    axios.get(url, {
      responseType: 'json'
    })
    .then((response) => {
      fn(response.data);
    })
    .catch((error) => {
      let errorMsg = this.handleError(error);
      fn({ error: true, message: errorMsg || 'Get Graphs Error' });
    });
  }

  getNode(data, fn) {
    const { collection, id } = data;
    const url = `${config.globomapApiUrl}/collections/${collection}/${id}`;

    axios.get(url)
      .then((result) => {
        this.updateItemInfo(result.data);
        fn(result.data);
      })
      .catch((error) => {
        let errorMsg = this.handleError(error);
        fn({ error: true, message: errorMsg || 'Get Node Error' });
      });
  }

  findNodes(options, fn) {
    const { query, queryProps, collections, per_page, page } = options;
    const co = collections.toString();

    let q = `[[{"field": "name", "value": "${query}", "operator": "LIKE"}],` +
            `[{"field": "properties", "value": "${query}", "operator": "LIKE"}]]`;

    if (queryProps.length > 0) {
      let byProps = queryProps.map((prop) => {
        const f = prop.name === 'name' ? prop.name : `properties.${prop.name}`;
        return `{"field": "${f}", "value": "${prop.value}", "operator": "${prop.op}"}`;
      });
      q = `[[${byProps.join(',')}]]`;
    }

    const url = `${config.globomapApiUrl}/collections/search/?collections=${co}&` +
                `query=${q}&per_page=${per_page || pageSize}&page=${page}`;

    axios.get(url)
      .then((result) => {
        result.data.documents.filter((doc) => {
          this.updateItemInfo(doc);
        });
        fn(result.data);
      })
      .catch((error) => {
        const errorMsg = this.handleError(error);
        fn({ error: true, message: errorMsg || 'Find Nodes Error' });
      });
  }

  traversalSearch(data, fn) {
    const { node, graphs, depth } = data;
    let urlPromisseList = [];

    for(let i=0, l=graphs.length; i<l; ++i) {
      const url = `${config.globomapApiUrl}/graphs/${graphs[i]}/traversal?start_vertex=${node._id}&max_depth=${depth}&direction=any`;
      urlPromisseList.push(axios.get(url));
    }

    axios.all(urlPromisseList)
      .then((results) => {
        results = results.map((resp) => {
          let data = { graph: resp.data.graph };

          data.edges = resp.data.edges.map((edge) => {
            return this.updateItemInfo(edge);
          });

          data.nodes = resp.data.nodes.map((node) => {
            return this.updateItemInfo(node);
          });

          return data;
        });
        fn(results);
      }).catch((error) => {
        let errorMsg = this.handleError(error);
        fn({ error: true, message: errorMsg || 'Traversal Search Error' });
      });
  }

  updateItemInfo(item) {
    item.type = item._id.split('/')[0];
    delete item._key;
    delete item._rev;
    return item;
  }

  getEnviron(data, fn) {
    return fn(config.environment);
  }

  getMonitoring(data, fn) {
    const eTypes = zabbixEquipmentTypes.split(',');
    const nodeType = data.properties['equipment_type'] || '';

    if(!eTypes.includes(nodeType)) {
      return fn([]);
    }

    const ips = Array.from(data.properties['ips'] || '');
    const url = `${config.globomapApiUrl}/plugin_data/zabbix?ips=` + ips.join();

    axios.get(url, {
      responseType: 'json',
      timeout: 20000
    })
    .then((response) => {
      fn(response.data);
    })
    .catch((error) => {
      const errorMsg = this.handleError(error);
      fn({ error: true, message: errorMsg || 'Get Monitoring Error' });
    });
  }

  getZabbixGraph(data, fn) {
    const { graphId } = data;
    const url = `${config.globomapApiUrl}/plugin_data/zabbix/?encoded=1&graphid=` + graphId;

    axios.get(url, {
      responseType: 'json',
      timeout: 1000
    })
    .then((response) => {
      fn(response.data);
    })
    .catch((error) => {
      // retry
      axios.get(url, {
        responseType: 'json',
        timeout: 1000
      })
      .then((response) => {
        fn(response.data);
      })
      .catch((error) => {
        const errorMsg = this.handleError(error);
        fn({ error: true, message: errorMsg || 'Get Monitoring Error' });
      });
    });
  }

  saveSharedMap(data, fn) {
    const mapStr = JSON.stringify(data.value);
    if (this.redis) {
      const mapKey = crypto.createHash('md5').update(mapStr).digest('hex');
      this.redis.set(`sharedmap:${mapKey}`, mapStr)
        .then((result) => {
          fn(mapKey);
        })
        .catch((error) => {
          // console.log(error);
          fn({ error: true, message: 'Save Shared Map Error' });
        });
    } else {
      fn({ error: true, message: 'Redis Error' });
    }
  }

  getSharedMap(data, fn) {
    if (this.redis) {
      this.redis.get(`sharedmap:${data.key}`)
        .then((result) => {
          if (result === null) {
            return fn([]);
          }
          fn(JSON.parse(result));
        })
        .catch((error) => {
          // console.log(error);
          fn({ error: true, message: 'Get Shared Map Error' });
        });
    } else {
      fn({ error: true, message: 'Redis Error' });
    }
  }

  handleError(error) {
    let msg = null;

    if(error.response) {
      msg = `Response Error: ${error.response.status} ${error.response.statusText}`;
      console.log(msg);
    } else if (error.request) {
      console.log(error.request);
    } else {
      msg = `Error: ${error.message}`;
      console.log(msg);
    }

    console.log(error.config);
    return msg;
  }

}

module.exports = IOServer;
