'use strict';

var express = require('express');
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Globals
var router = express.Router();

// Routes
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/pricing', function(req, res) {
  res.render('pricing');
});

// Exports
module.exports = router;
