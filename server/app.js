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

const express = require('express');
const path = require('path');
const session = require('express-session');
const Redis = require('ioredis');
const oauthClient = require('./oauthClient');
const project = require('../package.json');
const config = require('./config');

const app = express();

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
  const { redisSentinelsService, redisSentinelsHosts, redisHost,
          redisPort, redisPassword, redisSentinelsPort } = config;
  const RedisStore = require('connect-redis')(session);

  let redisClient;

  if (redisSentinelsHosts) {
    redisClient = new Redis({
      name: redisSentinelsService,
      password: redisPassword,
      sentinels: redisSentinelsHosts.map((sentinelHost) => {
        return {
          host: sentinelHost,
          port: redisSentinelsPort
        }
      })
    });
  } else {
    redisClient = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword
    });
  }

  sessionConfig.store = new RedisStore({
    client: redisClient,
    host: redisHost,
    port: redisPort,
    pass: redisPassword
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

app.get(['/', '/map/:mapId'], isAuthenticated, (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.get('/healthcheck', (req, res) => {
  return res.status(200).send('WORKING');
});

app.get('/info', (req, res) => {
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
  redirectUri = req.protocol + "://" + req.get('Host');
  req.session = null;
  res.redirect(config.oauthLogoutUrl + '?redirect_uri=' + redirectUri);
});

app.use(express.static(path.resolve(__dirname, '..', 'build')));

module.exports = { app, sessionMiddleware };
