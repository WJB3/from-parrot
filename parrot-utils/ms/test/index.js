
const ms=require('../lib/index.js'); 

console.log(ms('2 days')) // 172800000
console.log(ms('1d'))      // 86400000
console.log(ms('10h'))     // 36000000
console.log(ms('2.5 hrs')) // 9000000
console.log(ms('2h'))      // 7200000
console.log(ms('1m'))      // 60000
console.log(ms('5s'))      // 5000
console.log(ms('1y'))      // 31557600000
console.log(ms('100'))     // 100
console.log(ms('-3 days')) // -259200000
console.log(ms('-1h'))     // -3600000
console.log(ms('-200'))    // -200

console.log(ms(60000))             // "1m"
console.log(ms(2 * 60000))        // "2m"
console.log(ms(-3 * 60000))       // "-3m"
console.log(ms(ms('10 hours')))    // "10h"

console.log(ms(60000, { long: true }))             // "1 minute"
console.log(ms(2 * 60000, { long: true }))         // "2 minutes"
console.log(ms(-3 * 60000, { long: true }))       // "-3 minutes"
console.log(ms(ms('10 hours'), { long: true }))   // "10 hours"