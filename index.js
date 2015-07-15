'use strict';

var async = require('async');
var express = require('express');
var stormpath = require('express-stormpath');

var apiRoutes = require('./routes/api');
var privateRoutes = require('./routes/private');
var publicRoutes = require('./routes/public');

// Globals
var app = express();

// Application settings
app.set('view engine', 'jade');
app.set('views', './views');

app.locals.siteTitle = 'Billable API';
app.locals.stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

// Middlewares
app.use('/static', express.static('./static', {
  index: false,
  redirect: false
}));
app.use('/static', express.static('./bower_components', {
  index: false,
  redirect: false
}));
app.use(stormpath.init(app, {
  enableAccountVerification: true,
  expandApiKeys: true,
  expandCustomData: true,
  redirectUrl: '/dashboard',
  secretKey: 'very-long-and-very-secret-key',
  postRegistrationHandler: function(account, req, res, next) {
    async.parallel([
      // Create an API key for this user.
      function(cb) {
        account.createApiKey(function(err, key) {
          if (err) return cb(err);
          cb();
        });
      }
    ], function(err) {
      if (err) return next(err);
      next();
    });
  }
}));

// Routes
app.use('/', publicRoutes);
app.use('/api', stormpath.apiAuthenticationRequired, apiRoutes);
app.use('/dashboard', stormpath.loginRequired, privateRoutes);

// Server
app.listen(process.env.PORT || 3000);
