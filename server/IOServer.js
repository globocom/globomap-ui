const axios = require('axios');

const globomapApiUrl = process.env.GLOBOMAP_API_URL || 'http://localhost:5000/v1'

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
    let url = globomapApiUrl + '/collections';

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
    let url = globomapApiUrl + '/graphs';

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
    let urlList = []

    collections.map((co) => {
      let url = globomapApiUrl + '/collections/'+ co +'/search?'+ 'field=name&value='+ query;
      urlList.push(axios.get(url));
    });

    axios.all(urlList)
      .then((results) => {
        let data = results.map(resp => resp.data);
        fn(data);
      });
  }

  traversalSearch(data, fn) {
    let { start, graph, depth } = data;
    let url = globomapApiUrl + '/traversal';

    axios.get(url, {
      params: { start_vertex: start, graph: graph, max_depth: depth },
      responseType: 'json'
    })
    .then((response) => {
      fn(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }

}

module.exports = IOServer;
