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
const gmapclient = require('../gmapclient');
const { isAuthenticated, getUserInfo } = require('../helpers');
const config = require('../config');
const project = require('../../package.json');

const router = express.Router();

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
          console.log(`GmapClient getNode error: ${error}`);
          res.status(200).render('report', {
            node: {},
            nodeName: '',
            result: `[{ error: "Report node error" }]`
          });
        });
    })
    .catch((error) => {
      console.log(`GmapClient runQuery error: ${error}`);
      res.status(200).render('report', {
        node: {},
        nodeName: '',
        result: `[{ error: "Report query error" }]`
      });
    });
});

router.get('/runquery', isAuthenticated, (req, res) => {
  const query = req.query;

  if (_.isEmpty(query) || query.q === undefined || query.v === undefined) {
    return res.status(500).json({
      error: 'Empty query / missing parameters'
    });
  }

  gmapclient.runQuery({ kind: query.q, value: query.v })
    .then((data) => {
      let items = query.v.split('/');
      let nodes = data[0];

      gmapclient.getNode({collection: items[0], nodeId: items[1]})
        .then((data) => {
          data['type'] = query.type;
          res.status(200).json([{
            nodes: [data].concat(nodes),
            type: query.type,
            rootNode: query.v
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
