const merge = require('../lib/index');

let obj1= { a: 'a' };
let obj2 = { b: 'b',c:'c' };
let obj3 = { d: 'd',e:'e',f:'f' };
 
merge(obj1,obj2,obj3);

console.log("---obj1---",obj1);

Object.defineProperty(obj2,'c',{enumerable:false})

Object.defineProperty(obj3,'f',{enumerable:false})

merge(obj1,obj2,obj3);

console.log("---obj2---",obj1);