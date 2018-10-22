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

const router = express.Router();
const zabbixEquipmentTypes = process.env.ZABBIX_EQUIP_TYPES || 'Servidor,Servidor Virtual';

// Zabbix
router.get('/zabbix/monitoring', (req, res) => {

  const eTypes = zabbixEquipmentTypes.split(',');
  const nodeType = data.properties.equipment_type || '';

  if(!eTypes.includes(nodeType)) {
    return fn([]);
  }

  this.gmapclient.pluginData('zabbix', {
      ips: Array.from(data.properties.ips || '')
    })
    .then((data) => {
      fn(data);
    })
    .catch((error) => {
      fn({ error: true, message: 'Get Monitoring Error' });
    });

});

router.get('/zabbix/graph', (req, res) => {

  this.gmapclient.pluginData('zabbix', {
    encoded: 1,
    graphid: data.graphId
  })
  .then((data) => {
    fn(data);
  })
  .catch((error) => {
    // retry
    this.gmapclient.pluginData('zabbix', {
      encoded: 1,
      graphid: data.graphId
    })
    .then((data) => {
      fn(data);
    })
    .catch((error) => {
      fn({ error: true, message: 'Get Zabbix Graph Error' });
    });
  });

});

module.exports = router;
