var http = require('http');

var getBasicNodeMethods = require('./browser');

module.exports = getCurrentNodeMethods() || getBasicNodeMethods();

function getCurrentNodeMethods() {
  return http.METHODS && http.METHODS.map(function (method) {
    return method.toLowerCase();
  });
}