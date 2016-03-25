'use strict';

var _ = require('lodash');
module.exports = function() {
  var self = this;
  console.log("Hi, welcome to your endpoint generator");
  var done = this.async(),
    endpointQuestion = [{
        name: 'endpointname',
        message: 'What would you like to name your endpoint? ("customer" will end in a enpoint that can be reached like this "/api/v1/customer")',
        validate: function(value) {
          if (value) {
            return true;
          } else {
            return "Please enter a name for your endpoint (Or click ctrl-c twice to exit)";
          }
        }
      }
      /*, {
            type: "list",
            name: "size",
            message: "What size do you need",
            choices: ["Large", "Medium", "Small"],
            filter: function(val) {
              return val.toLowerCase();
            }
          }, {
            type: "input",
            name: "quantity",
            message: "How many do you need",
            validate: function(value) {
              var valid = !isNaN(parseFloat(value));
              return valid || "Please enter a number";
            },
            filter: Number
          }, {
            type: "expand",
            name: "toppings",
            message: "What about the toping",
            choices: [{
              key: "p",
              name: "Peperonni and chesse",
              value: "PeperonniChesse"
            }, {
              key: "a",
              name: "All dressed",
              value: "alldressed"
            }, {
              key: "w",
              name: "Hawaïan",
              value: "hawaian"
            }]
          }, {
            type: "rawlist",
            name: "beverage",
            message: "You also get a free 2L beverage",
            choices: ["Pepsi", "7up", "Coke"]
          }, {
            type: "input",
            name: "comments",
            message: "Any comments on your purchase experience",
            default: "Nope, all good!"
          }, {
            type: "list",
            name: "prize",
            message: "For leaving a comments, you get a freebie",
            choices: ["cake", "fries"],
            when: function(answers) {
              return answers.comments !== "Nope, all good!";
            }
          }*/
    ];
    var addPropertiesQuestion = [{
      type: "confirm",
      name: "addProperties",
      message: "Do you wish to add properties to your model (just hit enter for NO)?",
      default: false
    }];
  var questionsProperties = [{
    type: "input",
    name: "propertyName",
    message: 'Whats the name of your new property? (in a customer it could be "name")',
    validate: function(value) {
      if (value || value === 'exitProps') {
        return true;
      } else {
        return "Please enter a name for your endpoint (Or write 'exitProps' to exit)";
      }
    }
  }];

  self.prompt(endpointQuestion, function(answers) {
    self.data = answers;
    askProperties();
  }.bind(this));


  var askProperties = function() {
    self.prompt(addPropertiesQuestion, function(answers) {
      if (answers.addProperties) {
        self.prompt(questionsProperties, function(answers) {
          if ('exitProps' != answers.propertyName) {
            if(!self.data.propertiesToAdd){
              self.data.propertiesToAdd = [];
            }
            self.data.propertiesToAdd.push(answers.propertyName);
          }
          askProperties();
        });
      } else {
        done();
      }
    });
  };

};
