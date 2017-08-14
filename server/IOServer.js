const axios = require('axios');
const utils = require('../src/utils');

const globomapApiUrl = process.env.GLOBOMAP_API_URL || 'http://localhost:8000/v1'

class IOServer {
  constructor(io) {
    if(io === undefined) {
      return;
    }

    this.io = io;

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

    for(let i=0, l=collections.length; i<l; i++) {
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
    let urlList = [];

    for(let i=0, l=graphs.length; i<l; i++) {
      let url = `${globomapApiUrl}/traversal?graph=${graphs[i]}&start_vertex=${start}&max_depth=${depth}`;
      urlList.push(axios.get(url));
    }

    axios.all(urlList)
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
      });
  }

  updateItemInfo(item) {
    item.type = item._id.split('/')[0];
    item.uuid = utils.uuid();
    delete item._key;
    delete item._rev;
    return item;
  }
}

module.exports = IOServer;
