var generators = require('yeoman-generator');
var _ = require('lodash');

module.exports = generators.Base.extend({
  // note: arguments and options should be defined in the constructor.
  constructor: function() {
    generators.Base.apply(this, arguments);

    // This makes `appname` a required argument.
    this.argument('appname', {
      type: String,
      required: true
    });
    // And you can then access it later on this way; e.g. CamelCased
    this.appname = _.camelCase(this.appname);
  },
  packageJson: function packageJson() {
    var obj = this.fs.readJSON(this.templatePath('../config/package.json'));
    obj.name = this.appname;
    obj.description = "The app called " + this.appname;
    this.fs.writeJSON(this.destinationPath('package.json'), obj);
  },
  devConfig: function devConfig() {
    var obj = this.fs.readJSON(this.templatePath('../config/dev.json'));
    console.log(obj);
    obj.mongo.uri = 'mongodb://localhost/' + this.appname + '-dev';
    this.fs.writeJSON(this.destinationPath('server/config/dev.json'), obj);
  },
  writing: function() {
    // Copy all non-dotfiles
    this.fs.copy(
      this.templatePath('./**/*'),
      this.destinationPath()
    );

    // Copy all dotfiles
    this.fs.copy(
      this.templatePath('./.*'),
      this.destinationPath()
    );
  },
  installingDependencies: function() {
    this.installDependencies();
  }
});
