/*jshint esversion: 6 */

const babel = require('babel-core/register');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const restify = require('express-restify-mongoose');
const app = express();
const router = express.Router();
const config = require('./config');
const glob = require("glob");

app.use(bodyParser.json());
app.use(methodOverride());

mongoose.connect(config.mongo.uri);

glob("**/api/**/*.restify.js", function (er, endpoints) {
  endpoints.forEach(function(endpoint){
    require('../' + endpoint).default(router);
  });
  app.use(router);

  app.listen(9000, function () {
    console.log('Express server listening on port 9000');
  });

});
