'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var stormpath = require('express-stormpath');
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Globals
var router = express.Router();

// Middlewares
router.use(bodyParser.urlencoded({ extended: true }));

// Routes
router.get('/', function(req, res) {
  res.render('dashboard');
});

router.post('/charge', function(req, res, next) {
    stripe.customers.create({
        source: req.body.stripeToken,
        plan: 'pro',
        email: req.user.email
    }, function(err, customer) {
        if (err) return next(err);
        req.user.customData.billingTier = customer.subscriptions.data[0].plan;
        req.user.customData.billingProviderId = customer.id;
        req.user.customData.save(function(err) {
            if (err) return next(err);
            res.redirect('/dashboard');
        });
    });
});

// Exports
module.exports = router;