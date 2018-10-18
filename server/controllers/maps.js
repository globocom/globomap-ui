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
const crypto = require('crypto');
const Redis = require('ioredis');
const express = require('express');
const { isAuthenticated, getUserInfo } = require('../helpers');
const config = require('../config');

const router = express.Router();

let redis = null;
if (config.redisSentinelsHosts) {
  redis = new Redis({
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

// List user maps
router.get('/user', isAuthenticated, (req, res) => {
  if (!redis) {
    res.json({ error: true, message: 'Redis Error' });
    return;
  }

  getUserInfo(req.session).then(uInfo => {
    redis.hgetall(`${uInfo.email}:maps`)
      .then((result) => {
        result = _.mapValues(result, v => JSON.parse(v));
        res.json(result);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: true,
          message: 'List User Maps Error'
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

// Save user map
router.post('/user', isAuthenticated, (req, res) => {
  if (!redis) {
    res.json({ error: true, message: 'Redis Error' });
    return;
  }

  const sNodes = req.body.params.value;
  const mapStr = JSON.stringify(sNodes);
  const mapKey = crypto.createHash('md5').update(mapStr).digest('hex');

  getUserInfo(req.session).then(uInfo => {
    // Redis HASH email:maps, key, value
    redis.hset(`${uInfo.email}:maps`, mapKey, mapStr)
    .then((result) => {
      res.json({ key: mapKey, name: sNodes[0].name, content: sNodes });
    })
    .catch((error) => {
      console.log(error);
      res.json({
        error: true,
        message: 'Save User Map Error'
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

// Get user map
router.get('/user/:key', isAuthenticated, (req, res) => {
  if (!redis) {
    res.json({ error: true, message: 'Redis Error' });
    return;
  }

  getUserInfo(req.session).then(uInfo => {
    redis.hget(`${uInfo.email}:maps`, req.params.key)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        console.log(error);
        res.json({
          error: true,
          message: 'Get User Map Error'
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

// Delete user map
router.delete('/user/:key', isAuthenticated, (req, res) => {
  if (!redis) {
    res.json({ error: true, message: 'Redis Error' });
    return;
  }

  getUserInfo(req.session).then(uInfo => {
    redis.hdel(`${uInfo.email}:maps`, req.params.key)
      .then((result) => {
        res.json({ deletedKey: req.params.key });
      })
      .catch((error) => {
        console.log(error);
        res.json({
          error: true,
          message: 'Delete User Map Error'
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

router.get('/shared/:key', isAuthenticated, (req, res) => {
  if (!redis) {
    res.json({ error: true, message: 'Redis Error' });
    return;
  }

  redis.get(`sharedmap:${req.params.key}`)
    .then((result) => {
      // if (result === null) {
      //   res.json([]);
      //   return;
      // }
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: true,
        message: 'Get Shared Map Error'
      });
    });
});

router.post('/shared', isAuthenticated, (req, res) => {
  if (!redis) {
    res.json({ error: true, message: 'Redis Error' });
    return;
  }

  const mapStr = JSON.stringify(req.body.params.value);
  const mapKey = crypto.createHash('md5').update(mapStr).digest('hex');

  redis.set(`sharedmap:${mapKey}`, mapStr)
    .then((result) => {
      res.json({ mapKey: mapKey });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: true,
        message: 'Save Shared Map Error'
      });
    });
});

module.exports = router
