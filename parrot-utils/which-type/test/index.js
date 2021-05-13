const { isTypeUndefined,isTypeArray,isTypeNumber,isTypeObject } =require('../lib/index');

console.log(isTypeUndefined())

console.log(isTypeArray([]))

console.log(isTypeNumber(0))

console.log(isTypeObject({}))