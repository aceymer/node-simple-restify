/*jshint esversion: 6 */
module.exports = function() {
  var endpointName = this.data.endpointname;
  var propertiesToAdd = this.data.propertiesToAdd;
  var listOfPropertiesAsString = '';
  if(propertiesToAdd){
    for(var i = 0; i < propertiesToAdd.length; i++){
      var property = propertiesToAdd[i];
      listOfPropertiesAsString += '  ' + property.name + ': { type: ' + property.type;
      if(property.access){
        listOfPropertiesAsString += ', access: ' + property.access;
      }
      listOfPropertiesAsString += '}';
      if(propertiesToAdd.length - 1 > i){
        listOfPropertiesAsString += ',\n';
      }
    }
  }

  this.fs.copy(
    this.templatePath('endpoint.model.js'),
    this.destinationPath('server/api/' + endpointName + '/' + endpointName + '.model.js'),
    {process: function(content) {
        var newContent = content.toString().replace('/*Props*/', listOfPropertiesAsString);
        return newContent;
    }}
  );

  this.fs.copyTpl(
    this.templatePath('endpoint.restify.js'),
    this.destinationPath('server/api/' + endpointName + '/' + endpointName + '.restify.js'),
    {data: endpointName}
  );
};
