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
const zabbixApiUrl = process.env.ZABBIX_API_URL;
const zabbixUser = process.env.ZABBIX_API_USER;
const zabbixPassword = process.env.ZABBIX_API_PASSWORD;
const zabbixEquipmentTypes = process.env.ZABBIX_EQUIP_TYPES || 'Servidor,Servidor Virtual';
const certificates = process.env.CERTIFICATES;

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

  findNodes(data, fn) {
    let { query, collections } = data;
    let urlList = [];
    let count = Math.ceil(50 / collections.length);

    for(let i=0, l=collections.length; i<l; ++i) {
      let url = `${globomapApiUrl}/collections/${collections[i]}/search?field=name&value=${query}&count=${count}&offset=0`;
      urlList.push(axios.get(url));
    }

    axios.all(urlList)
      .then((results) => {
        results = results.map(resp => resp.data);

        let data = [].concat.apply([], results).map((node) => {
          return this.updateItemInfo(node);
        });

        fn(data);
      }).catch((error) => {
        let errorMsg = this.handleError(error);
        fn({ error: true, message: errorMsg || 'Find Nodes Error' });
      });
  }

  traversalSearch(data, fn) {
    let { start, graphs, depth } = data;
    let urlPromisseList = [];

    for(let i=0, l=graphs.length; i<l; ++i) {
      let url = `${globomapApiUrl}/traversal?graph=${graphs[i]}&start_vertex=${start}&max_depth=1&direction=any`;
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
    let loginRequest =  {
      "user": zabbixUser,
      "password": zabbixPassword
    };
    let eTypes = zabbixEquipmentTypes.split(','),
        nodeType = this.getProperty(data, 'equipment_type');

    if(!eTypes.includes(nodeType)) {
      return fn([]);
    }

    this.jsonRPCRequest("user.login", loginRequest, null, (auth) => {
      let ips = Array.from(this.getProperty(data, 'ips'));

      if (ips.length === 0) {
        return fn([]);
      }

      let hostRequest = {
        "output": ["hostid"],
        "search": { "ip": ips },
        "searchByAny": 1
      };

      this.jsonRPCRequest("host.get", hostRequest, auth, (hosts) => {
        let hostIds = hosts.map((host) => {
            return host.hostid
        });

        if (!hostIds) {
          return fn([]);
        }

        let triggersRequest = {
          "output": ["description","status","state", "value"],
          "filter": { "hostid": hostIds },
          "expandDescription": 1
        };

        this.jsonRPCRequest("trigger.get", triggersRequest, auth, (triggers) => {
          fn(triggers);
        });
      });
    });
  }

  jsonRPCRequest(action, params, auth, fn) {
    axios.post(`${zabbixApiUrl}/api/v2`, {
      "jsonrpc": "2.0", "method": action, "params": params,
      "id": 1,"auth": auth
    }, {
      timeout: 20000
    })
    .then(function(response) {
      fn(response.data.result);
    })
    .catch((error) => {
      let errorMsg = this.handleError(error);
      fn({ error: true, message: errorMsg || 'Zabbix API Error' });
    });
  }

  getProperty(element, prop) {
    let property = element.properties.find((item) => {
      return item['key'] === prop;
    });

    if(property) {
      return property.value;
    }

    return [];
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
}

module.exports = IOServer;
