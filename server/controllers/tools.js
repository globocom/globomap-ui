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
