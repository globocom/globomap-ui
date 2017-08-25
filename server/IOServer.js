const axios = require('axios');
const utils = require('../src/utils');

const globomapApiUrl = process.env.GLOBOMAP_API_URL || 'http://localhost:8000/v1'
const zabbixApiUrl = process.env.ZABBIX_API_URL
const zabbixUser = process.env.ZABBIX_API_USER
const zabbixPassword = process.env.ZABBIX_API_PASSWORD

class IOServer {
  constructor(io) {
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
      console.log(error);
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
      console.log(error);
    });
  }

  findNodes(data, fn) {
    let { query, collections } = data;
    let urlList = [];

    for(let i=0, l=collections.length; i<l; ++i) {
      let url = `${globomapApiUrl}/collections/${collections[i]}/search?field=name&value=${query}&count=50`;
      urlList.push(axios.get(url));
    }

    axios.all(urlList)
      .then((results) => {
        results = results.map(resp => resp.data);

        let data = [].concat.apply([], results).map((node) => {
          return this.updateItemInfo(node);
        });

        fn(data);
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
        console.log(error.response.data);
        fn(error.response.data);
      });
  }

  updateItemInfo(item) {
    item.type = item._id.split('/')[0];
    delete item._key;
    delete item._rev;
    return item;
  }

  getMonitoring(data, fn){
    let loginRequest =  { "user": zabbixUser, "password": zabbixPassword }

    this.jsonRPCRequest("user.login", loginRequest, null, (auth) => {
      let ips = this.getIps(data);
      if (!ips){
        return fn([]);
      }
      
      let hostRequest = {
        "output": ["hostid"],
        "search": { "ip": ips },
        "searchByAny": 1
      }

      this.jsonRPCRequest("host.get", hostRequest, auth, (hosts) => {
        let hostIds = hosts.map((host, i) => {
            return host.hostid
        })
        if (!hostIds){
          return fn([]);
        }

        let triggersRequest = { 
          "output": ["description","status","state", "value"],
          "filter": { "hostid": hostIds },
          "expandDescription": 1,
          "searchByAny": 1
        }

        this.jsonRPCRequest("trigger.get", triggersRequest, auth, (triggers) => {
          fn(triggers);
        })
      })
    })
  }

  jsonRPCRequest(action, params, auth, fn){
    axios.post(`${zabbixApiUrl}/api/v2`, {
      "jsonrpc": "2.0", "method": action, "params": params,
      "id": 1,"auth": auth
    }) 
    .then(function(response) {
        fn(response.data.result)
    });
  }

  getIps(element){
    let property = element.properties.find((element, index, array) => {
      return element['key'] == 'ips';
    })
    if(property){
      return property.value;
    }
  }
}

module.exports = IOServer;
