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
const oauthClient = require('../oauthClient');
const config = require('../config');
const axios = require('axios');

const router = express.Router();

router.get('/auth', (req, res) => {
  res.redirect(oauthClient.code.getUri());
});

router.get('/login', (req, res) => {
  oauthClient.code.getToken(req.originalUrl).then(function (token) {
    req.session['tokenData'] = token.data;
    return res.redirect('/');
  }).catch(function(e) {
    console.log("[Auth] Unexpected error on user token retrieval")
    console.log(e);
    return res.redirect('/logout');
  });
});

router.get('/logout', (req, res) => {
  const redirectUri = req.protocol + "://" + req.get('Host');
  const url = `${config.oauthLogoutUrl}?id_token_hint=${req.session.tokenData.access_token}&state=some_random_string`;
  req.session = null;

  axios.get(url)
    .then(response => {
      return res.redirect(redirectUri)
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
