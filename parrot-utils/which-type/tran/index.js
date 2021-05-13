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
export { isTypeUndefined, isTypeObject, isTypeNumber, isTypeArray, isTypeString };
export default whichType;