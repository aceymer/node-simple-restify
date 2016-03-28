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
  config: function config() {
    var appName = this.appname;
    this.fs.copyTpl(
      this.templatePath('../config/development.js'),
      this.destinationPath('server/config/development.js'),
      {data: appName}
    );
    this.fs.copyTpl(
      this.templatePath('../config/production.js'),
      this.destinationPath('server/config/production.js'),
      {data: appName}
    );
    this.fs.copyTpl(
      this.templatePath('../config/index.js'),
      this.destinationPath('server/config/index.js'),
      {data: appName}
    );
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
