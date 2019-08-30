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

const Redis = require('ioredis');
const express = require('express');
const { isAuthenticated, getUserInfo } = require('../helpers');
const config = require('../config');

const router = express.Router();

let redis = null;
if (config.redisSentinelsHosts) {
  redis = new Redis({
    db: 0,
    name: config.redisSentinelsService,
    password: config.redisPassword,
    sentinels: config.redisSentinelsHosts.map((sentinelHost) => {
      return {
        host: sentinelHost,
        port: config.redisSentinelsPort
      };
    })
  });
} else {
  redis = new Redis({
    db: 0,
    host: config.redisHost,
    port: config.redisPort,
    password: config.redisPassword
  });
}

if (redis) {
  redis.on('error', function(err) {
    console.log(err.toString());
  });
}

// Get user tour
router.get('/tour', isAuthenticated, (req, res) => {
  if (!redis) {
    res.json({ error: true, message: 'Redis Error' });
    return;
  }

  getUserInfo(req.session).then(uInfo => {
    redis.hget(uInfo.email, 'tour')
      .then((result) => {
        result = (!result ? false : result)
        res.json({tour: JSON.parse(result)});
      })
      .catch((error) => {
        console.log(error);
        res.json({
          error: true,
          message: 'Get User Tour Error'
        });
      });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      error: true,
      message: 'User Info Error'
    });
  });
});

// Save user tour
router.post('/tour', isAuthenticated, (req, res) => {
  if (!redis) {
    res.json({ error: true, message: 'Redis Error' });
    return;
  }

  const tour = req.body.params.tour;

  getUserInfo(req.session).then(uInfo => {
    redis.hset(uInfo.email, 'tour', tour)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        console.log(error);
        res.json({
          error: true,
          message: 'Save User Tour Error'
        });
      });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      error: true,
      message: 'User Info Error'
    });
  });
});

module.exports = router
