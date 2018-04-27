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

const _ = require('lodash');
const axios = require('axios');
const Redis = require('ioredis');
const ioSession = require('express-socket.io-session');
const GmapClient = require('globomap-api-jsclient');

const config = require('./config');
const app = require('./app').app;
const sessionMiddleware = require('./app').sessionMiddleware;
const oauthClient = require('./oauthClient');

const zabbixEquipmentTypes = process.env.ZABBIX_EQUIP_TYPES || 'Servidor,Servidor Virtual';
const pageSize = process.env.PAGE_SIZE || 20;

function getUserInfo(session) {
  const url = config.oauthUserInfoUrl;

  return new Promise((resolve, reject) => {
    const token = null;

    if (session.tokenData !== undefined) {
      token = session.tokenData.access_token;
    } else {
      reject(null);
    }

    if (!url) {
      reject(null);
    }

    axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

class IOServer {
  constructor(io) {
    if(io === undefined) {
      return;
    }

    // SSL
    https.globalAgent.options.ca = fs.readFileSync(config.certificates);

    // Authentication
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

    // Globomap client
    this.gmapclient = new GmapClient({
      username: config.globomapApiUsername,
      password: config.globomapApiPassword,
      apiUrl: config.globomapApiUrl
    });

    const eventList = [
      { event: 'getcollections', fn: this.getCollections },
      { event: 'getgraphs', fn: this.getGraphs },
      { event: 'getnode', fn: this.getNode },
      { event: 'findnodes', fn: this.findNodes },
      { event: 'traversalsearch', fn: this.traversalSearch },
      { event: 'getserverdata', fn: this.getServerData },

      // Zabbix
      { event: 'getmonitoring', fn: this.getMonitoring },
      { event: 'getZabbixGraph', fn: this.getZabbixGraph },

      // Redis
      { event: 'savesharedmap', fn: this.saveSharedMap },
      { event: 'getsharedmap', fn: this.getSharedMap },
      { event: 'user:savemap', fn: this.saveUserMap },
      { event: 'user:getmap', fn: this.getUserMap },
      { event: 'user:deletemap', fn: this.deleteUserMap },
      { event: 'user:listmaps', fn: this.listUserMaps }
    ];

    io.on('connection', (socket) => {
      const session = socket.request.session;
      const userInfo = getUserInfo(session);

      for(let i=0, l=eventList.length; i<l; ++i) {
        socket.on(eventList[i].event, (data, fn) => {
          eventList[i].fn.apply(this, [{ ...data, userInfo }, (result) => {
            fn(result);
          }]);
        });
      }
    });
  }

  handleAxiosError(error) {
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

  getCollections(data, fn) {
    this.gmapclient.listCollections()
      .then((data) => {
        fn(data);
      })
      .catch((error) => {
        fn({ error: true, message: 'Get Collections Error' });
      });
  }

  getGraphs(data, fn) {
    this.gmapclient.listGraphs()
      .then((data) => {
        fn(data);
      })
      .catch((error) => {
        fn({ error: true, message: 'Get Graphs Error' });
      });
  }

  getNode(data, fn) {
    this.gmapclient.getNone({
        collection: data.collection,
        nodeId: data.id
      })
      .then((result) => {
        this.updateItemInfo(result.data);
        fn(result.data);
      })
      .catch((error) => {
        fn({ error: true, message: 'Get Node Error' });
      });
  }

  findNodes(data, fn) {
    const { query, queryProps, collections, per_page, page } = data;
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

    this.gmapclient.search({
        collections: co,
        query: q,
        perPage: per_page || pageSize,
        page: page
      })
      .then((data) => {
        data.documents.filter((doc) => {
          this.updateItemInfo(doc);
        });
        fn(data);
      })
      .catch((error) => {
        console.log(error);
        fn({ error: true, message: 'Find Nodes Error' });
      });
  }

  traversalSearch(data, fn) {
    const { node, graphs, depth } = data;

    this.gmapclient.traversal({
        graphs: graphs,
        startVertex: node._id,
        maxDepth: depth,
        direction: 'any'
      })
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
      })
      .catch((error) => {
        fn({ error: true, message: 'Traversal Search Error' });
      });
  }

  updateItemInfo(item) {
    item.type = item._id.split('/')[0];
    delete item._key;
    delete item._rev;
    return item;
  }

  getServerData(data, fn) {
    data.userInfo
      .then(uInfo => {
        fn({ environ: config.environment, userInfo: uInfo });
      })
      .catch(error => {
        fn({ environ: config.environment, userInfo: {} })
      });
  }

  getMonitoring(data, fn) {
    const eTypes = zabbixEquipmentTypes.split(',');
    const nodeType = data.properties['equipment_type'] || '';

    if(!eTypes.includes(nodeType)) {
      return fn([]);
    }

    this.gmapclient.pluginData('zabbix', {
        ips: Array.from(data.properties['ips'] || '')
      })
      .then((data) => {
        fn(data);
      })
      .catch((error) => {
        fn({ error: true, message: 'Get Monitoring Error' });
      });
  }

  getZabbixGraph(data, fn) {
    this.gmapclient.pluginData('zabbix', {
      encoded: 1,
      graphid: data.graphId
    })
    .then((data) => {
      fn(data);
    })
    .catch((error) => {
      // retry
      this.gmapclient.pluginData('zabbix', {
        encoded: 1,
        graphid: data.graphId
      })
      .then((data) => {
        fn(data);
      })
      .catch((error) => {
        fn({ error: true, message: 'Get Zabbix Graph Error' });
      });
    });
  }

  saveSharedMap(data, fn) {
    if (!this.redis) {
      fn({ error: true, message: 'Redis Error' });
      return;
    }

    const mapStr = JSON.stringify(data.value);
    const mapKey = crypto.createHash('md5').update(mapStr).digest('hex');

    this.redis.set(`sharedmap:${mapKey}`, mapStr)
      .then((result) => {
        fn(mapKey);
      })
      .catch((error) => {
        fn({ error: true, message: 'Save Shared Map Error' });
      });
  }

  getSharedMap(data, fn) {
    if (!this.redis) {
      fn({ error: true, message: 'Redis Error' });
      return;
    }

    this.redis.get(`sharedmap:${data.key}`)
      .then((result) => {
        if (result === null) {
          return fn([]);
        }
        fn(JSON.parse(result));
      })
      .catch((error) => {
        fn({ error: true, message: 'Get Shared Map Error' });
      });
  }

  saveUserMap(data, fn) {
    if (!this.redis) {
      fn({ error: true, message: 'Redis Error' });
      return;
    }

    const sNodes = data.value;
    const mapStr = JSON.stringify(sNodes);
    const mapKey = crypto.createHash('md5').update(mapStr).digest('hex');

    data.userInfo.then(uInfo => {
      // Redis HASH email:maps, key, value
      this.redis.hset(`${uInfo.email}:maps`, mapKey, mapStr)
        .then((result) => {
          fn({ key: mapKey, name: sNodes[0].name, content: sNodes });
        })
        .catch((error) => {
          fn({ error: true, message: 'Save User Map Error' });
        });
    });
  }

  getUserMap(data, fn) {
    if (!this.redis) {
      fn({ error: true, message: 'Redis Error' });
      return;
    }

    data.userInfo.then(uInfo => {
      this.redis.hget(`${uInfo.email}:maps`, data.key)
        .then((result) => {
          fn(JSON.parse(result));
        })
        .catch((error) => {
          fn({ error: true, message: 'Get User Map Error' });
        });
    });
  }

  deleteUserMap(data, fn) {
    if (!this.redis) {
      fn({ error: true, message: 'Redis Error' });
      return;
    }

    data.userInfo.then(uInfo => {
      this.redis.hdel(`${uInfo.email}:maps`, data.key)
        .then((result) => {
          fn({ deletedKey: data.key });
        })
        .catch((error) => {
          fn({ error: true, message: 'Delete User Map Error' });
        });
    });
  }

  listUserMaps(data, fn) {
    if (!this.redis) {
      fn({ error: true, message: 'Redis Error' });
      return;
    }

    data.userInfo.then(uInfo => {
      this.redis.hgetall(`${uInfo.email}:maps`)
        .then((result) => {
          result = _.mapValues(result, v => JSON.parse(v));
          fn(result);
        })
        .catch((error) => {
          fn({ error: true, message: 'List User Maps Error' });
        });
    });
  }

}

module.exports = IOServer;
