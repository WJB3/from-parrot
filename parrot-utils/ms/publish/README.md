<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
一个包可以转化时间为毫秒 或者毫秒转化为指定时间
    
</blockquote>

# 一、支持环境

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
支持浏览器/node环境
    
</blockquote>

# 二、node环境使用 <div style="color:green">（已通过测试√）</div>

```js
npm install --save-dev @parrotjs/ms    //安装npm包
```

```js
const ms=require('@parrotjs/ms'); 

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
 
```  


# 三、浏览器环境使用

## 1.HTML中使用 <div style="color:green">（已通过测试√）</div>

```js
//使用upk在线cdn
https://unpkg.com/@parrotjs/ms@1.0.0/index.js
```


```js
//使用jsdelivr在线cdn
https://cdn.jsdelivr.net/npm/@parrotjs/ms@1.0.0/index.js
```


```html
//index.html
<!DOCTYPE html>
<html>

<head>Test</head>

<body>
    <script src="https://cdn.jsdelivr.net/npm/@parrotjs/ms@1.0.0/index.js"></script>
    <script>  
        console.log(MS('2 days')) // 172800000
        console.log(MS('1d'))      // 86400000
        console.log(MS('10h'))     // 36000000
        console.log(MS('2.5 hrs')) // 9000000
        console.log(MS('2h'))      // 7200000
        console.log(MS('1m'))      // 60000
        console.log(MS('5s'))      // 5000
        console.log(MS('1y'))      // 31557600000
        console.log(MS('100'))     // 100
        console.log(MS('-3 days')) // -259200000
        console.log(MS('-1h'))     // -3600000
        console.log(MS('-200'))    // -200

        console.log(MS(60000))             // "1m"
        console.log(MS(2 * 60000))        // "2m"
        console.log(MS(-3 * 60000))       // "-3m"
        console.log(MS(ms('10 hours')))    // "10h"

        console.log(MS(60000, { long: true }))             // "1 minute"
        console.log(MS(2 * 60000, { long: true }))         // "2 minutes"
        console.log(MS(-3 * 60000, { long: true }))       // "-3 minutes"
        console.log(MS(ms('10 hours'), { long: true }))  
    </script>
</body>

</html>
``` 

## 2.ESM中使用<div style="color:green">（已通过测试√）</div>

```js
        import ms from '@parrotjs/ms' 

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
```

# 四、github源码地址

```js
https://github.com/parrot-design/parrot-utils/tree/main/ms
```
# 五、版本变更记录

+ 1.0.0 初始化目录  

# 六、使用场景

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>

有些地方需要获得毫秒数
    
</blockquote>