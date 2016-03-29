/*jshint esversion: 6 */

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const restify = require('express-restify-mongoose');
const app = express();
const router = express.Router();
const glob = require("glob");

const config = require('./config');
const User = require('./api/user/user.model');

app.use(bodyParser.json());
app.use(methodOverride());

mongoose.connect(config.mongo.uri);

//Passport
const passport = require('passport');
const Strategy = require('passport-local');
const expressJwt = require('express-jwt');
const http = require('http');
const jwt = require('jsonwebtoken');
const logger = require('morgan');
const TOKENTIME = 120 * 60; // in seconds

const authenticate = expressJwt({
  secret: config.secrets.session
});

// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }

glob("./server/api/**/*.restify.js", function(er, endpoints) {
  endpoints.forEach(function(endpoint) {
    require('../' + endpoint).default(router);
  });

  app.use(router);

  //////////////
  // passport //
  //////////////
  passport.use(new Strategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      localAuthenticate(User, email, password, done);
    }
  ));

  app.post('/auth', passport.initialize(), passport.authenticate(
    'local', {
      session: false,
      scope: []
    }), generateToken, respond);

  var User = require('./api/user/user.model').default;
  app.get('/me', authenticate, function(req, res) {
    User.findOneAsync({ _id: req.user.id }, '-salt -password')
    .then(function(user) { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.status(200).json(user);
    })
    .catch(function(err){
      console.log(err);
      return res.status(500).end();
    });
  });

  app.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });

});
////////////
// helper //
////////////

function generateToken(req, res, next) {
  req.token = jwt.sign({
    id: req.user._id,
  }, config.secrets.session, {
    expiresIn: TOKENTIME
  });
  next();
}

function respond(req, res) {

  res.status(200).json({
    user: req.user,
    token: req.token
  });
}

function localAuthenticate(User, email, password, done) {
  User.findOneAsync({
    email: email.toLowerCase()
  })
    .then(function(user) {
      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      }
      user.authenticate(password, function(authError, authenticated) {
        if (authError) {
          return done(authError);
        }
        if (!authenticated) {
          return done(null, false, { message: 'This password is not correct.' });
        } else {
          return done(null, user);
        }
      });
    })
    .catch(function(err){
      done(err);
    } );
}
