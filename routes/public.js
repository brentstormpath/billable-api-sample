'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Globals
var router = express.Router();

// Middlewares
router.use(bodyParser.json());

// Routes
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/pricing', function(req, res) {
  res.render('pricing');
});

router.post('/subscription-cancel', function(req, res, next) {
  stripe.events.retrieve(req.body.id, function(err, event) {
    if (err) return next(err);

    var type = event.type;

    // Check that the event type is a subscription cancellation.
    if (type !== 'customer.subscription.deleted') {
      return res.json();
    }

    var customerId = event.data.object.customer;

    stripe.customers.retrieve(customerId, function(err, customer) {
      if (err) return next(err);

      var customerEmail = customer.email;
      req.app.get('stormpathApplication').getAccounts({ email: customerEmail }, function(err, accounts) {
        if (err) return next(err);

        var account = accounts.items[0];
        account.getCustomData(function(err, data) {
          if (err) return next(err);

          data.billingTier.id = 'cancelled';
          data.save(function(err) {
            if (err) return next(err);

            return res.json();
          });
        });
      });
    });
  });
});

// Exports
module.exports = router;
