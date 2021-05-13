'use strict';

var http = require('http');

module.exports = getCurrentNodeMethods() || getBasicNodeMethods();

function getCurrentNodeMethods() {
  return http.METHODS && http.METHODS.map(function (method) {
    return method.toLowerCase();
  });
}
/**
 * 最基本的node方法
 */


function getBasicNodeMethods() {
  return ['get', 'post', 'put', 'head', 'delete', 'options', 'trace', 'copy', 'lock', 'mkcol', 'move', 'purge', 'propfind', 'proppatch', 'unlock', 'report', 'mkactivity', 'checkout', 'merge', 'm-search', 'notify', 'subscribe', 'unsubscribe', 'patch', 'search', 'connect'];
}
