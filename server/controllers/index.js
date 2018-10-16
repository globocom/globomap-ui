const express = require('express');

const router = express.Router();

router.use('/', require('./auth'));
router.use('/api', require('./base'));
router.use('/api/maps', require('./maps'));
router.use('/tools', require('./tools'));

module.exports = router;
