(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.whichType = {}));
}(this, (function (exports) { 'use strict';

  function whichType(type) {
    var typeStr;

    switch (type) {
      case 'undefined':
        typeStr = 'Undefined';
        break;

      case 'object':
        typeStr = 'Object';
        break;

      case 'number':
        typeStr = 'Number';
        break;

      case 'array':
        typeStr = 'Array';
        break;

      case 'string':
        typeStr = 'String';
        break;

      default:
        typeStr = 'Undefined';
        break;
    }

    return function (arg) {
      return Object.prototype.toString.call(arg) === "[object ".concat(typeStr, "]");
    };
  }
  /**
   * 判断是否为undefined
   * @returns 返回一个函数
   */


  var isTypeUndefined = whichType('undefined');
  /**
   * 判断是否为object
   * @returns 返回一个函数
   */

  var isTypeObject = whichType('object');
  /**
   * 判断是否为object
   * @returns 返回一个函数
   */

  var isTypeNumber = whichType('number');
  /**
   * 判断是否为array
   * @returns 返回一个函数
   */

  var isTypeArray = whichType('array');
  /**
   * 判断是否为字符串
   * @returns 返回一个函数
   */

  var isTypeString = whichType('string');

  exports.default = whichType;
  exports.isTypeArray = isTypeArray;
  exports.isTypeNumber = isTypeNumber;
  exports.isTypeObject = isTypeObject;
  exports.isTypeString = isTypeString;
  exports.isTypeUndefined = isTypeUndefined;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
