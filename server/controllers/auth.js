const express = require('express');
const oauthClient = require('../oauthClient');
const config = require('../config');

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
  req.session = null;
  res.redirect(config.oauthLogoutUrl + '?redirect_uri=' + redirectUri);
});

module.exports = router;
