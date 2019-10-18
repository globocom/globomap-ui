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
const config = require('../config');
const gmapclient = require('../gmapclient');
const { isAuthenticated, updateItemInfo } = require('../helpers');

const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
  gmapclient.listPlugins()
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: `List Plugins Error: ${error}`
      });
    });
});

router.post('/:pluginName', isAuthenticated, (req, res) => {
  const pluginName = req.params.pluginName;

  gmapclient.pluginData(pluginName, req.body.data)
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: `Get plugin data error. Plugin: ${pluginName}. Error: ${error}`
      });
    });
});

module.exports = router;
