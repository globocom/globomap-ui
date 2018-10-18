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

const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const Redis = require('ioredis');
const { isAuthenticated } = require('./helpers');
const config = require('./config');

const app = express();

// SSL
https.globalAgent.options.ca = fs.readFileSync(config.certificates);

// views setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add CORS for DEVELOPMENT
if (config.environment === 'development') {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
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

  if (config.redisSentinelsHosts) {
    redisClient = new Redis({
      name: config.redisSentinelsService,
      password: config.redisPassword,
      sentinels: config.redisSentinelsHosts.map((sentHost) => {
        return {
          host: sentHost,
          port: config.redisSentinelsPort
        };
      })
    });
  } else {
    redisClient = new Redis({
      host: config.redisHost,
      port: config.redisPort,
      password: config.redisPassword
    });
  }

  sessionConfig.store = new RedisStore({
    client: redisClient,
    host: config.redisHost,
    port: config.redisPort,
    pass: config.redisPassword
  });
} else {
  app.set('disable-auth', !config.oauthForceAuth);
}

// Apply middlewares
app.use(session(sessionConfig));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Controllers
app.use(require('./controllers'));

// Default routes
app.get('/healthcheck', (req, res) => {
  return res.status(200).send('WORKING');
});

app.get(['/', '/map/:mapId'], isAuthenticated, (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.use(express.static(path.resolve(__dirname, '..', 'build')));

module.exports = app;
