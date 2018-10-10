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

const _ = require('lodash');
const express = require('express');
const path = require('path');
const session = require('express-session');
const Redis = require('ioredis');
const oauthClient = require('./oauthClient');
const project = require('../package.json');
const config = require('./config');
const GmapClient = require('globomap-api-jsclient');

const app = express();

// views setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// add CORS just for DEVELOPMENT
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(require('./controllers'));

// Globomap API client
const gmapclient = new GmapClient({
  username: config.globomapApiUsername,
  password: config.globomapApiPassword,
  apiUrl: config.globomapApiUrl
});

function updateItemInfo(item) {
  item.type = item._id.split('/')[0];
  delete item._key;
  delete item._rev;
  return item;
}

let sessionConfig = {
  cookie: {
    path: '/',
    httpOnly: false,
    maxAge: 24*60*60*1000
  },
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  unset: 'destroy'
};

if (app.get('env') === 'production') {
  const RedisStore = require('connect-redis')(session);
  let redisClient;

  if (config.redisAuthSentinelsHosts) {
    redisClient = new Redis({
      name: config.redisAuthSentinelsService,
      password: config.redisAuthPassword,
      sentinels: config.redisAuthSentinelsHosts.map((sentHost) => {
        return {
          host: sentHost,
          port: config.redisAuthSentinelsPort
        };
      })
    });
  } else {
    redisClient = new Redis({
      host: config.redisAuthHost,
      port: config.redisAuthPort,
      password: config.redisAuthPassword
    });
  }

  sessionConfig.store = new RedisStore({
    client: redisClient,
    host: config.redisAuthHost,
    port: config.redisAuthPort,
    pass: config.redisAuthPassword
  });
} else {
  app.set('disable-auth', !config.oauthForceAuth);
}

const sessionMiddleware = session(sessionConfig);
app.use(sessionMiddleware);

const isAuthenticated = (req, res, next) => {
  if (app.get('disable-auth')) {
    return next();
  }

  if (req.session && req.session.tokenData) {
    oauthClient.isAuthenticated(req.session, isAuthenticated => {
      if (isAuthenticated) {
        next();
      } else {
        return res.redirect('/logout');
      }
    });
  } else {
    return res.redirect('/auth');
  }
}

app.get('/report', (req, res) => {
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

app.get('/healthcheck', (req, res) => {
  return res.status(200).send('WORKING');
});

app.get('/info', isAuthenticated, (req, res) => {
  return res.status(200).json({
    project: project.name,
    version: project.version,
    environment: config.environment,
    'node-version': project.engines.node,
    dependencies: project.dependencies
  });
});

app.get('/auth', (req, res) => {
  res.redirect(oauthClient.code.getUri());
});

app.get('/login', (req, res) => {
  oauthClient.code.getToken(req.originalUrl).then(function (token) {
    req.session['tokenData'] = token.data;
    return res.redirect('/');
  }).catch(function(e) {
    console.log("[Auth] Unexpected error on user token retrieval")
    console.log(e);
    return res.redirect('/logout');
  });
});

app.get('/logout', (req, res) => {
  const redirectUri = req.protocol + "://" + req.get('Host');
  req.session = null;
  res.redirect(config.oauthLogoutUrl + '?redirect_uri=' + redirectUri);
});

app.get('/api/graphs', isAuthenticated, (req, res) => {
  gmapclient.listGraphs({ perPage: 100, page: 1})
    .then((data) => {
      return res.status(200).json(data.graphs);
    })
    .catch((error) => {
      return res.status(500).json({
        error: true,
        message: 'Get Graphs Error'
      });
    });
});

app.get('/api/collections', isAuthenticated, (req, res) => {
  gmapclient.listCollections({ perPage: 100, page: 1 })
    .then((data) => {
      return res.status(200).json(data.collections);
    })
    .catch((error) => {
      return res.status(500).json({
        error: true,
        message: 'Get Collections Error'
      });
    });
});

app.get('/api/edges', isAuthenticated, (req, res) => {
  gmapclient.listEdges({ perPage: 100, page: 1 })
    .then((data) => {
      return res.status(200).json(data.collections);
    })
    .catch((error) => {
      return res.status(500).json({
        error: true,
        message: 'Get Edges Error'
      });
    });
});

app.get('/api/queries', isAuthenticated, (req, res) => {
  gmapclient.listQueries({ perPage: 100, page: 1 })
    .then((data) => {
      return res.status(200).json(data.collections);
    })
    .catch((error) => {
      return res.status(500).json({
        error: true,
        message: 'Get Queries Error'
      });
    });
});

app.get('/api/find-nodes', isAuthenticated, (req, res) => {
  const { query, queryProps, collections, per_page, page } = req.query;
  const co = collections.toString();

  let q = `[[{"field": "name", "value": "${query}", "operator": "LIKE"}],` +
          `[{"field": "properties", "value": "${query}", "operator": "LIKE"}]]`;

  if (queryProps.length > 0) {
    let byProps = queryProps.map((prop) => {
      const f = prop.name === 'name' ? prop.name : `properties.${prop.name}`;
      return `{"field": "${f}", "value": "${prop.value}", "operator": "${prop.op}"}`;
    });
    q = `[[${byProps.join(',')}]]`;
  }

  gmapclient.search({
      collections: co,
      query: q,
      perPage: per_page || pageSize,
      page: page
    })
    .then((data) => {
      data.documents.filter((doc) => {
        updateItemInfo(doc);
      });
      return res.status(200).json(data);
    })
    .catch((error) => {
      return res.status(500).json({
        error: true,
        message: 'Find Nodes Error'
      });
    });
});

app.get('/api/traversal-search', isAuthenticated, (req, res) => {
  const { node, graphs, depth } = req.query;

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
      return res.status(500).json({
        error: true,
        message: 'Traversal Search Error'
      });
    });
});

app.get('/api/server-data', isAuthenticated, (req, res) => {
  // data.userInfo
  //   .then(uInfo => {
  //     return res.status(200).json({
  //       environ: config.environment,
  //       userInfo: uInfo
  //     });
  //   })
  //   .catch(error => {
  //     return res.status(500).json({
  //       environ: config.environment,
  //       userInfo: {}
  //     });
  //   });
});

app.get(['/', '/map/:mapId'], isAuthenticated, (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.use(express.static(path.resolve(__dirname, '..', 'build')));

module.exports = app;
