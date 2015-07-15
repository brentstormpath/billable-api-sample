'use strict';

var express = require('express');

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
