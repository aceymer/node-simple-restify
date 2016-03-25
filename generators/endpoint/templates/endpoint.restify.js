/*jshint esversion: 6 */
'use strict';
var mongoose = require('mongoose');
var express = require('express');
var theModel = require('./<%= data %>.model');
var restify = require('express-restify-mongoose');

export default function(router) {

  restify.serve(router, theModel);
}
