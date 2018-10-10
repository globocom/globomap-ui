var express = require('express');
var router = express.Router();

router.use('/api/maps', require('./maps'))

module.exports = router
