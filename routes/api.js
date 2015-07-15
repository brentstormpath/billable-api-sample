'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');

// Globals
var router = express.Router();


// Middlewares
router.use(bodyParser.json());

// Routes
 router.post('/hi', function(req, res) {
     if (req.user.customData.balance < COST_PER_QUERY) {
         return res.status(402).json({ error: 'Please Upgrade to the pro plan' });
     } else {
         return res.status(200).json({ hi: 'there' });
         }
 });


/* Routes
router.post('/message', function(req, res) {
  if (!req.body || !req.body.phoneNumber) {
    return res.status(400).json({ error: 'phoneNumber is required.' });
  } else if (!BTC_EXCHANGE_RATE) {
    return res.status(500).json({ error: "We're having trouble getting the exchange rates right now. Try again soon!" });
  } else if (req.user.customData.balance < COST_PER_QUERY) {
    return res.status(402).json({ error: 'Payment required. You need to deposit funds into your account.' });
  }

  var message = '1 Bitcoin is currently worth $' + BTC_EXCHANGE_RATE  + ' USD.';

  twilio.sendMessage({
    to: req.body.phoneNumber,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: message
  }, function(err, resp) {
    if (err) return res.status(500).json({ error: "We couldn't send the SMS message. Try again soon!" });

    req.user.customData.balance -= COST_PER_QUERY;
    req.user.customData.totalQueries += 1;
    req.user.customData.save();

    res.json({ phoneNumber: req.body.phoneNumber, message: message, cost: COST_PER_QUERY });
  });
});

// Functions
function getExchangeRates() {
  request('http://api.bitcoincharts.com/v1/weighted_prices.json', function(err, resp, body) {
    if (err || resp.statusCode !== 200) {
      console.log('Failed to retrieve BTC exchange rates.');
      return;
    }

    try {
      var data = JSON.parse(body);
      BTC_EXCHANGE_RATE = data.USD['24h'];
      console.log('Updated BTC exchange rate: ' + BTC_EXCHANGE_RATE + '.');
    } catch (err) {
      console.log('Failed to parse BTC exchange rates.');
      return;
    }
  });
}
*/


// Exports
module.exports = router;
