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

const dns = require('dns');
const _ = require('lodash');
const express = require('express');
const gmapclient = require('../gmapclient');
const { isAuthenticated, updateItemInfo } = require('../helpers');
const config = require('../config');

const router = express.Router();

router.get('/graphs', isAuthenticated, (req, res) => {
  gmapclient.listGraphs({ per_page: 100, page: 1})
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
  gmapclient.listCollections({ per_page: 100, page: 1 })
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
  gmapclient.listEdges({ per_page: 100, page: 1 })
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
  gmapclient.listQueries({ per_page: 100, page: 1 })
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

router.get('/run-query', isAuthenticated, (req, res) => {
  const query = req.query;

  if (_.isEmpty(query) || query.q === undefined || query.v === undefined) {
    return res.status(400).json({
      error: true,
      message: 'Empty query / missing parameters'
    });
  }

  gmapclient.runQuery({ kind: query.q, value: query.v })
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      const errMsg = 'GmapClient runQuery error';
      console.log(`${errMsg}: ${error}`);
      res.status(500).json({
        error: true,
        message: `${errMsg}`
      });
    });
});

const findNodes = (options, res) => {
  const { query, queryType, queryProps, collections, per_page, page } = options;

  let co = '';
  if (collections !== undefined) {
    co = collections.toString();
  }

  let q = `[[{"field": "name", "value": "${query}", "operator": "LIKE"}],` +
          `[{"field": "properties", "value": "${query}", "operator": "LIKE"}]]`;

  if (queryType && queryType === 'name') {
    q = `[[{"field": "name", "comparison": "^", "value": "${query}", "operator": "REGEXP"},` +
        `{"field": "name", "comparison": "(?!^)", "value": "${query}", "operator": "REGEXP"}],` +
        `[]]`;
  }

  if (queryProps && queryProps.length > 0) {
    let byProps = queryProps.map(prop => {
      prop = JSON.parse(prop);
      const field = prop.name === 'name' ? prop.name : `properties.${prop.name}`;
      return `{"field": "${field}", "value": "${prop.value}", "operator": "${prop.op}"}`;
    });
    q = `[[${byProps.join(',')}]]`;
  }

  gmapclient.search({
      collections: co,
      query: q,
      per_page: per_page || process.env.PAGE_SIZE || 50,
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
}

router.get('/find-nodes', isAuthenticated, (req, res) => {
  return findNodes(req.query, res);
});

router.get('/dnslookup-find-nodes', isAuthenticated, (req, res) => {
  let opts = Object.assign({}, req.query);
  let queryProps = JSON.parse(opts.queryProps[0]);
  dns.lookup(queryProps.value, (err, result) => {
    queryProps.value = result;
    opts.queryProps[0] = JSON.stringify(queryProps);
    return findNodes(opts, res);
  });
});

router.post('/traversal-search', isAuthenticated, (req, res) => {
  let { graphs, max_depth, node, direction } = req.body.params;

  gmapclient.traversalMultiple({
      graphs: graphs,
      start_vertex: node._id,
      max_depth: max_depth,
      direction: direction || 'any'
    })
    .then(results => {
      results = results.map(resp => {
        let data = { graph: resp.data.graph };
        data.edges = resp.data.edges.map(edge => {
          return updateItemInfo(edge);
        });
        data.nodes = resp.data.nodes.map(node => {
          return updateItemInfo(node);
        });
        return data;
      });
      return res.status(200).json(results);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: 'Traversal Search Error'
      });
    });
});

module.exports = router;
