/*jshint esversion: 6 */
'use strict';
var mongoose = require('mongoose');
var express = require('express');
var theModel = require('./user.model');
var restify = require('express-restify-mongoose');

module.exports = function(router) {

  restify.serve(router, theModel);
};
