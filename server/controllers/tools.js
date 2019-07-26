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

const _ = require('lodash');
const express = require('express');
const GmapClient = require('globomap-api-jsclient');
const { isAuthenticated, getUserInfo } = require('../helpers');
const config = require('../config');
const project = require('../../package.json');

const router = express.Router();

const gmapclient = new GmapClient({
  username: config.globomapApiUsername,
  password: config.globomapApiPassword,
  apiUrl: config.globomapApiUrl
});

router.get('/report', isAuthenticated, (req, res) => {
  const query = req.query;

  if (_.isEmpty(query) || query.q === undefined || query.v === undefined) {
    return res.status(200).render('report', {
      result: '[{ error: "Empty query / missing parameters" }]'
    });
  }

  gmapclient.runQuery({ kind: query.q, value: query.v })
    .then((data) => {
      let items = query.v.split('/'),
          result = JSON.stringify(data)

      gmapclient.getNode({collection: items[0], nodeId: items[1]})
        .then((data) => {
          res.status(200).render('report', {
            node: JSON.stringify(data),
            nodeName: data.name,
            result: result
          });
        })
        .catch((error) => {
          const errMsg = 'GmapClient getNode error';
          console.log(`${errMsg}: ${error}`);
          res.status(200).render('report', {
            node: {},
            result: `[{ error: "${errMsg}" }]`
          });
        });
    })
    .catch((error) => {
      const errMsg = 'GmapClient runQuery error';
      console.log(`${errMsg}: ${error}`);
      res.status(200).render('report', {
        node: {},
        result: `[{ error: "${errMsg}" }]`
      });
    });
});

router.get('/runquery', isAuthenticated, (req, res) => {
  const query = req.query;
  let target = {
    _key: "",
    _id: "",
    _from: "",
    _to: "",
    _rev: "",
    id: "",
    name: "80:Default VIP",
    provider: "napi",
    timestamp: 1564035134,
    type: "port",
    properties: {
      l4_protocol: "TCP",
      l7_protocol: "Outros",
      l7_rule: "Default VIP",
      port: 80
    },
    properties_metadata: {
      l4_protocol: {
        description: "L4 Protocol"
      },
      l7_protocol: {
        description: "L7 Protocol"
      },
      l7_rule: {
        description: "L7 Rule"
      },
      port: {
        description: "Port"
      }
    }
  }

  if (_.isEmpty(query) || query.q === undefined || query.v === undefined) {
    return res.status(500).json({
      error: 'Empty query / missing parameters'
    });
  }

  gmapclient.runQuery({ kind: query.q, value: query.v })
    .then((data) => {
      let items = query.v.split('/');
      let nodes = data[0].vips;
      let edges = [];

      nodes.forEach((node, index) => {
        node['type'] = query.type;
        let source = {
          _key: `napi_${index}`,
          _id: `port/napi_${index}`,
          _from: query.v,
          _to: node._id,
          id: index
        }
        edges.push(Object.assign(target, source));
      });

      gmapclient.getNode({collection: items[0], nodeId: items[1]})
        .then((data) => {
          data['type'] = query.type
          res.status(200).json([{
            nodes: [data].concat(nodes),
            edges: edges,
            graph: 'load_balancing'
          }]);
        })
        .catch((error) => {
          const errMsg = 'GmapClient getNode error';
          console.log(`${errMsg}: ${error}`);
          res.status(500).json({
            node: {},
            result: `[{ error: "${errMsg}" }]`
          });
        });
    })
    .catch((error) => {
      const errMsg = 'GmapClient runQuery error';
      console.log(`${errMsg}: ${error}`);
      res.status(500).json({
        node: {},
        result: `[{ error: "${errMsg}" }]`
      });
    });
});

router.get('/server-data', isAuthenticated, (req, res) => {
  getUserInfo(req.session)
    .then(uInfo => {
      return res.status(200).json({
        environ: config.environment,
        userInfo: uInfo
      });
    })
    .catch(error => {
      return res.status(500).json({
        environ: config.environment,
        userInfo: {}
      });
    });
});

router.get('/info', isAuthenticated, (req, res) => {
  return res.status(200).json({
    project: project.name,
    version: project.version,
    environment: config.environment,
    'node-version': project.engines.node,
    dependencies: project.dependencies
  });
});

module.exports = router;
