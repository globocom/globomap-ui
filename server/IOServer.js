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

const axios = require('axios');
const https = require('https');
const fs = require('fs');

const globomapApiUrl = process.env.GLOBOMAP_API_URL || 'http://localhost:8000/v1';
const zabbixEquipmentTypes = process.env.ZABBIX_EQUIP_TYPES || 'Servidor,Servidor Virtual';
const certificates = process.env.CERTIFICATES || 'ca-certificates.crt';

class IOServer {
  constructor(io) {
    https.globalAgent.options.ca = fs.readFileSync(certificates);

    if(io === undefined) {
      return;
    }

    io.on('connection', (socket) => {
      socket.on('getcollections', (data, fn) => {
        this.getCollections(data, (result) => { fn(result); });
      });

      socket.on('getgraphs', (data, fn) => {
        this.getGraphs(data, (result) => { fn(result); });
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
    let startTime = new Date().getTime();
    console.log('[IOServer.getCollections] request start');

    axios.get(url, {
      responseType: 'json'
    })
    .then((response) => {
      let endTime = new Date().getTime();
      console.log('[IOServer.getCollections] call ok ' + (endTime - startTime) + ' milliseconds.');
      fn(response.data);
    })
    .catch((error) => {
      let endTime = new Date().getTime();
      console.log('[IOServer.getCollections] call error ' + (endTime - startTime) + ' milliseconds.');
      let errorMsg = this.handleError(error);
      fn({ error: true, message: errorMsg || 'Get Collections Error' });
    });
  }

  getGraphs(data, fn) {
    let url = `${globomapApiUrl}/graphs`;
    let startTime = new Date().getTime();
    console.log('[IOServer.getGraphs] request start');

    axios.get(url, {
      responseType: 'json'
    })
    .then((response) => {
      let endTime = new Date().getTime();
      console.log('[IOServer.getGraphs] call ok ' + (endTime - startTime) + ' milliseconds.');
      fn(response.data);
    })
    .catch((error) => {
      let endTime = new Date().getTime();
      console.log('[IOServer.getGraphs] call error ' + (endTime - startTime) + ' milliseconds.');
      let errorMsg = this.handleError(error);
      fn({ error: true, message: errorMsg || 'Get Graphs Error' });
    });
  }

  findNodes(data, fn) {
    let { query, collections } = data;
    let urlList = [];
    let count = Math.ceil(50 / collections.length);
    let startTime = new Date().getTime();
    console.log('[IOServer.findNodes] request start');

    for(let i=0, l=collections.length; i<l; ++i) {
      let url = `${globomapApiUrl}/collections/${collections[i]}?query=[[{"field":"name","value":"${query}","operator":"LIKE"}],[{"field":"properties","value":"${query}","operator":"LIKE"}]]&page=1`;
      urlList.push(axios.get(url));
    }

    axios.all(urlList)
      .then((results) => {
        let endTime = new Date().getTime();
        console.log('[IOServer.findNodes] call ok ' + (endTime - startTime) + ' milliseconds.');
        results = results.map(resp => resp.data.documents);

        let data = [].concat.apply([], results).map((node) => {
          return this.updateItemInfo(node);
        });

        fn(data);
      }).catch((error) => {
        let endTime = new Date().getTime();
        console.log('[IOServer.findNodes] call error ' + (endTime - startTime) + ' milliseconds.');
        let errorMsg = this.handleError(error);
        fn({ error: true, message: errorMsg || 'Find Nodes Error' });
      });
  }

  traversalSearch(data, fn) {
    let { start, graphs, depth } = data;
    let urlPromisseList = [];
    let startTime = new Date().getTime();
    console.log('[IOServer.traversalSearch] request start');

    for(let i=0, l=graphs.length; i<l; ++i) {
      let url = `${globomapApiUrl}/${graphs[i]}/traversal?start_vertex=${start}&max_depth=1&direction=any`;
      urlPromisseList.push(axios.get(url));
    }

    axios.all(urlPromisseList)
      .then((results) => {
        let endTime = new Date().getTime();
        console.log('[IOServer.traversalSearch] call ok ' + (endTime - startTime) + ' milliseconds.');
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
        let endTime = new Date().getTime();
        console.log('[IOServer.traversalSearch] call error ' + (endTime - startTime) + ' milliseconds.');
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
    let startTime = new Date().getTime();
    console.log('[IOServer.getMonitoring] request start');

    axios.get(url, {
      responseType: 'json',
      timeout: 20000
    })
    .then((response) => {
      let endTime = new Date().getTime();
      console.log('[IOServer.getMonitoring] call ok ' + (endTime - startTime) + ' milliseconds.');
      fn(response.data);
    })
    .catch((error) => {
      let endTime = new Date().getTime();
      console.log('[IOServer.getMonitoring] call error ' + (endTime - startTime) + ' milliseconds.');
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
