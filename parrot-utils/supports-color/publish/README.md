<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
可以得出终端/浏览器支持多少颜色
    
</blockquote>

# 一、支持环境

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
支持node环境和浏览器环境
    
</blockquote>

# 二、node环境使用 <div style="color:green">（已通过测试√）</div>

```js 
const support=require('@parrotjs/supports-color');

console.log(support)
//{
// stdout: { level: 3, hasBasic: true, has256: true, has16m: true },
//stderr: { level: 3, hasBasic: true, has256: true, has16m: true }
//}
```

# 三、浏览器环境使用

## 1.HTML中使用 <div style="color:green">（已通过测试√）</div>
 
 ```js
//使用upk在线cdn
https://unpkg.com/@parrotjs/supports-color@2.1.0/browser.js
```


```js
//使用jsdelivr在线cdn
https://cdn.jsdelivr.net/npm/@parrotjs/supports-color@2.1.0/browser.js
```

```html
//index.html
<!DOCTYPE html>
<html>

<head>Test</head>

<body>
    <script src="https://cdn.jsdelivr.net/npm/@parrotjs/supports-color@2.1.0/browser.js"></script>
    <script>
         console.log(supportsColor)
         //{level: 1, hasBasic: true, has256: false, has16m: false}
    </script>
</body>

</html>
```  

 ## 2.ESM中使用<div style="color:green">（已通过测试√）</div>

```js
import supportsColor from '@parrotjs/supports-color';

console.log(supportsColor)
//{level: 1, hasBasic: true, has256: false, has16m: false}
```
 
# 四、github源码地址

```js
https://github.com/parrot-design/parrot-utils/tree/main/supports-color
```
# 五、版本变更记录

+ 1.6.0 初始化目录 
+ 1.7.0 修改MD说明文件 
+ 1.8.0 修改package.json
+ 1.9.0 修改package.json
+ 2.2.0 修改MD说明文件

# 六、使用场景

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>

有时候需要得出终端/浏览器支持多少颜色
    
</blockquote>