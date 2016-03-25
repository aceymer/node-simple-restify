'use strict';

var generators = require('yeoman-generator');
var _ = require('lodash');

module.exports = generators.Base.extend({
  // note: arguments and options should be defined in the constructor.
  constructor: function() {
    generators.Base.apply(this, arguments);
  },
  prompting: require('./prompting'),
  writing: require('./writing')
});
