const hasFlag = require('../lib/index');
 
console.log(hasFlag('unicorn'));
//=> true
 
console.log(hasFlag('--unicorn'));
//=> true
 
console.log(hasFlag('f'));
//=> true
 
console.log(hasFlag('-f'));
//=> true
 
console.log(hasFlag('foo=bar'));
//=> true
 
console.log(hasFlag('foo'));
//=> false
 
console.log(hasFlag('rainbow'));
//=> false