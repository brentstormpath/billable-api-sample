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



/**
 * Controller for a Stripe webhook
 *
 * @param {Object} app An Express.js app
 * @param {Object} kit Our business logic
 */
module.exports.setRoutes = function(app, kit) {

    // we listen for POST requests to our webhook endpoint
    app.post('/webhook/stripe'

        // we assume express.bodyParser() was used,
        //  and express.csrf() is off for this endpoint
        , function(req, res, next) {

            // first, make sure the posted data looks like we expect
            if(req.body.object!=='event') {
                return res.send(400); // respond with HTTP bad request
            }

            // we only care about the event id - we use it to query the Stripe API
            stripe.events.retrieve(req.body.id, function(err, event){

                // the request to Stripe was signed - so if the event id is invalid
                //  (eg it doesnt belong to our account), the API will respond with an error,
                //  & if there was a problem on Stripe's side, we might get no data.
                if(err || !event) {
                    return res.send(401); // respond with HTTP forbidden
                }

                // store the validated, confirmed from Stripe event for use by our next middleware
                req.modeled.stripeEvent = event;
                next();
            });
        }

        // now we can trust the event really came from Stripe!
        , function(req, res) {
            var o, event = req.modeled.stripeEvent;

            // in this example we only care about one type of event
            if(event.type==='charge.succeeded') {
                o = event.data.object;

                // let's find which one of our users was charged
                kit.model.User.findByStripeCustomerId( o.customer, function(err, user) {
                        if(user) { // here user is a mongoose model

                            // we store the charge id on our user's _plan subdoc
                            user._plan.stripe.charges.push(o.id);
                            user._plan.save();

                            // and send our customer an email confirmation,
                            //  more custom than https://stripe.com/blog/email-receipts
                            kit.mailer.sendPaymentConfirmation(user, o);
                        }
                    }
                );
            }
            else {
                console.log("unhandled stripe event", event.type);
            }

            // it's important to let the Stripe platform know that the event
            //  was received and properly processed. if the webhook endpoint does not
            //  respond with a 2xx status, Stripe will try making it's request again later.
            res.send(200); // respond with HTTP ok
        }
    );

    return app;
};

// Exports
module.exports = router;
