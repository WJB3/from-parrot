function whichType(type) {
    let typeStr;
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
    return (arg) => Object.prototype.toString.call(arg) === `[object ${typeStr}]`;
}
/**
 * 判断是否为undefined
 * @returns 返回一个函数
 */
const isTypeUndefined = whichType('undefined');
/**
 * 判断是否为object
 * @returns 返回一个函数
 */
const isTypeObject = whichType('object');
/**
 * 判断是否为object
 * @returns 返回一个函数
 */
const isTypeNumber = whichType('number');
/**
 * 判断是否为array
 * @returns 返回一个函数
 */
const isTypeArray = whichType('array');
/**
 * 判断是否为字符串
 * @returns 返回一个函数
 */
const isTypeString = whichType('string');
export { isTypeUndefined, isTypeObject, isTypeNumber, isTypeArray, isTypeString };
export default whichType;
