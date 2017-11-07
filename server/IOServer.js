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

const app = require('./app');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const ioSession = require("express-socket.io-session");
const oauthClient = require('./oauthClient');

const globomapApiUrl = process.env.GLOBOMAP_API_URL || 'http://localhost:8000/v1';
const zabbixEquipmentTypes = process.env.ZABBIX_EQUIP_TYPES || 'Servidor,Servidor Virtual';
const certificates = process.env.CERTIFICATES || `${process.cwd()}/server/ca-certificates.crt`;
const pageSize = process.env.PAGE_SIZE || 20;

class IOServer {
  constructor(io) {
    https.globalAgent.options.ca = fs.readFileSync(certificates);

    if(io === undefined) {
      return;
    }

    io.use(function(socket, next) {
      sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.use(function(socket, next) {
      if(app.get('disable-auth')){
        return next()
      }

      var session = socket.request.session
      if(session && session.tokenData){
        oauthClient.isAuthenticated(session, isAuthenticated => {
          if (isAuthenticated){
            next()
          } else {
            next(new Error('Authentication error'));
          }
        })
      } else {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', (socket) => {
      socket.on('getcollections', (data, fn) => {
        this.getCollections(data, (result) => { fn(result); });
      });

      socket.on('getgraphs', (data, fn) => {
        this.getGraphs(data, (result) => { fn(result); });
      });

      socket.on('getnode', (data, fn) => {
        this.getnode(data, (result) => { fn(result); });
      });

      socket.on('findnodes', (data, fn) => {
        this.findNodes(data, (result) => { fn(result); });
      });

      socket.on('traversalsearch', (data, fn) => {
        this.traversalSearch(data, (result) => { fn(result); });
      });

      socket.on('getmonitoring', (data, fn) => {
        this.getMonitoring(data, (result) => { fn(result); });
      });
    });
  }

  getCollections(data, fn) {
    let url = `${globomapApiUrl}/collections`;

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
    let url = `${globomapApiUrl}/graphs`;

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

  getnode(data, fn) {
    let { collection, id } = data;
    let url = `${globomapApiUrl}/collections/${collection}/${id}`;

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

  findNodes(data, fn) {
    let { query, collections, per_page, page } = data;

    // query
    // [[{"field":"name","value":"a","operator":"LIKE"}],[{"field":"properties","value":"a","operator":"LIKE"}]]

    let c = collections.toString(),
        q = `[[{"field": "name", "value": "${query}", "operator": "LIKE"}]]`;

    let url = `${globomapApiUrl}/collections/search/?collections=${c}&query=${q}&per_page=${per_page || pageSize}&page=${page}`;

    axios.get(url)
      .then((result) => {
        result.data.documents.filter((doc) => {
          this.updateItemInfo(doc);
        });

        fn(result.data);
      })
      .catch((error) => {
        let errorMsg = this.handleError(error);
        fn({ error: true, message: errorMsg || 'Find Nodes Error' });
      });
  }

  traversalSearch(data, fn) {
    let { start, graphs, depth } = data;
    let urlPromisseList = [];

    for(let i=0, l=graphs.length; i<l; ++i) {
      let url = `${globomapApiUrl}/graphs/${graphs[i]}/traversal?start_vertex=${start}&max_depth=1&direction=any`;
      urlPromisseList.push(axios.get(url));
    }

    axios.all(urlPromisseList)
      .then((results) => {
        results = results.map((resp) => {
          let data = {graph: resp.data.graph};

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

  getMonitoring(data, fn) {
    let eTypes = zabbixEquipmentTypes.split(','),
        nodeType = data.properties['equipment_type'] || '';

    if(!eTypes.includes(nodeType)) {
      return fn([]);
    }

    let ips = Array.from(data.properties['ips'] || '');
    let url = `${globomapApiUrl}/plugin_data/zabbix?ips=` + ips.join();

    axios.get(url, {
      responseType: 'json',
      timeout: 20000
    })
    .then((response) => {
      fn(response.data);
    })
    .catch((error) => {
      let errorMsg = this.handleError(error);
      fn({ error: true, message: errorMsg || 'Get Monitoring Error' });
    });
  }

  handleError(error) {
    let msg = false;

    if(error.response) {
      msg = `Response Error: ${error.response.data.errors}`;
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

  logMemory() {
      let memory = process.memoryUsage();
      console.log('[IOServer] ', 'RSS (Resident Set Size) ', memory.rss, ', Heap Used (Heap actually Used) ', memory.heapUsed, ' Heap Total (Total Size of the Heap) ', memory.heapTotal);
  }
}

module.exports = IOServer;
