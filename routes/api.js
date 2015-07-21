'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');

// Globals
var router = express.Router();


// Middlewares
router.use(bodyParser.json());

router.post('/hi', function(req, res) {
  if (!req.user.customData.billingTier || req.user.customData.billingTier.id !== 'pro') {
    res.status(402).json({ error: 'Please Upgrade to the pro plan' });
  } else {
    res.status(200).json({ hi: 'there' });
  }
});

// Exports
module.exports = router;
