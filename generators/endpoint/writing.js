/*jshint esversion: 6 */

module.exports = function() {
  console.log('ata',this.data);
  var endpointName = this.data.endpointname;
  this.fs.copyTpl(
    this.templatePath('endpoint.model.js'),
    this.destinationPath('server/api/' + endpointName + '/' + endpointName + '.model.js'),
    {data: endpointName.substr(0, 1).toUpperCase() + endpointName.substr(1)}
  );

  this.fs.copyTpl(
    this.templatePath('endpoint.restify.js'),
    this.destinationPath('server/api/' + endpointName + '/' + endpointName + '.restify.js'),
    {data: endpointName}
  );
};
