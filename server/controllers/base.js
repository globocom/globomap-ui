/*
Copyright 2018 Globo.com

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

const express = require('express');
const GmapClient = require('globomap-api-jsclient');
const { isAuthenticated, updateItemInfo } = require('../helpers');
const config = require('../config');

const router = express.Router();

const gmapclient = new GmapClient({
  username: config.globomapApiUsername,
  password: config.globomapApiPassword,
  apiUrl: config.globomapApiUrl
});

router.get('/graphs', isAuthenticated, (req, res) => {
  gmapclient.listGraphs({ perPage: 100, page: 1})
    .then((data) => {
      return res.status(200).json(data.graphs);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: 'Get Graphs Error'
      });
    });
});

router.get('/collections', isAuthenticated, (req, res) => {
  gmapclient.listCollections({ perPage: 100, page: 1 })
    .then((data) => {
      return res.status(200).json(data.collections);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: 'Get Collections Error'
      });
    });
});

router.get('/edges', isAuthenticated, (req, res) => {
  gmapclient.listEdges({ perPage: 100, page: 1 })
    .then((data) => {
      return res.status(200).json(data.collections);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: 'Get Edges Error'
      });
    });
});

router.get('/queries', isAuthenticated, (req, res) => {
  gmapclient.listQueries({ perPage: 100, page: 1 })
    .then((data) => {
      return res.status(200).json(data.documents);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: 'Get Queries Error'
      });
    });
});

router.get('/find-nodes', isAuthenticated, (req, res) => {
  const { query, queryProps, collections, per_page, page } = req.query;
  const co = collections.toString();

  let q = `[[{"field": "name", "value": "${query}", "operator": "LIKE"}],` +
          `[{"field": "properties", "value": "${query}", "operator": "LIKE"}]]`;

  if (queryProps && queryProps.length > 0) {
    let byProps = queryProps.map((prop) => {
      const f = prop.name === 'name' ? prop.name : `properties.${prop.name}`;
      return `{"field": "${f}", "value": "${prop.value}", "operator": "${prop.op}"}`;
    });
    q = `[[${byProps.join(',')}]]`;
  }

  gmapclient.search({
      collections: co,
      query: q,
      perPage: per_page || process.env.PAGE_SIZE || 20,
      page: page
    })
    .then((data) => {
      data.documents.filter((doc) => {
        updateItemInfo(doc);
      });
      return res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: 'Find Nodes Error'
      });
    });
});

router.post('/traversal-search', isAuthenticated, (req, res) => {
  let { graphs, depth, node } = req.body.params;

  gmapclient.traversalMultiple({
      graphs: graphs,
      startVertex: node._id,
      maxDepth: depth,
      direction: 'any'
    })
    .then((results) => {
      results = results.map((resp) => {
        let data = { graph: resp.data.graph };
        data.edges = resp.data.edges.map((edge) => {
          return updateItemInfo(edge);
        });
        data.nodes = resp.data.nodes.map((node) => {
          return updateItemInfo(node);
        });
        return data;
      });
      return res.status(200).json(results);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: 'Traversal Search Error'
      });
    });
});

module.exports = router;