/*jshint esversion: 6 */

module.exports = function() {
  var endpointName = this.data.endpointname;
  this.fs.copyTpl(
    this.templatePath('endpoint.model.js'),
    this.destinationPath('server/api/' + endpointName + '/' + endpointName + '.model.js'),
    {data: endpointName}
  );

  this.fs.copyTpl(
    this.templatePath('endpoint.restify.js'),
    this.destinationPath('server/api/' + endpointName + '/' + endpointName + '.restify.js'),
    {data: endpointName}
  );
};
