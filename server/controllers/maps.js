var express = require('express');
var router = express.Router();

router.get('/user', function(req, res) {
  res.json({'data': 'user-maps'});
});

router.get('/shared', function(req, res) {
  res.json({'data': 'shared-maps'});
});

module.exports = router
