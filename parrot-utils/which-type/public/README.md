<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
一个包可以判断变量类型 
    
</blockquote>

# 一、支持环境

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
支持node环境和浏览器环境
    
</blockquote>

# 二、node环境使用 <div style="color:green">（已通过测试√）</div>

```js
npm install --save @parrotjs/which-type  //安装npm包
```

```js
//index.js
const { isTypeUndefined,isTypeArray,isTypeNumber,isTypeObject } =require('@parrotjs/which-type');

console.log(isTypeUndefined()) // true

console.log(isTypeArray([])) // true

console.log(isTypeNumber(0)) // true

console.log(isTypeObject({})) // true

```

# 三、浏览器环境使用

## 1.HTML中使用 <div style="color:green">（已通过测试√）</div>

```js
//使用upk在线cdn
https://unpkg.com/@parrotjs/which-type@1.3.0/index.js
```


```js
//使用jsdelivr在线cdn
https://cdn.jsdelivr.net/npm/@parrotjs/which-type@1.3.0/index.js
```


```html
//index.html
<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <script src="https://cdn.jsdelivr.net/npm/@parrotjs/which-type@1.3.0/index.js" ></script>
        <script>
            console.log(whichType.isTypeUndefined()) // true

            console.log(whichType.isTypeArray([])) // true

            console.log(whichType.isTypeNumber(0)) // true

            console.log(whichType.isTypeObject({})) // true
        </script>
    </body>
</html>
``` 

## 2.ESM中使用 <div style="color:green">（已通过测试√）</div>

```js
import { isTypeUndefined, isTypeArray, isTypeNumber, isTypeObject } from '@parrotjs/which-type';

console.log(isTypeUndefined()) // true

console.log(isTypeArray([])) // true

console.log(isTypeNumber(0)) // true

console.log(isTypeObject({})) // true
```

# 四、github源码地址

```js
https://github.com/parrot-design/parrot-utils/tree/main/which-type
```
# 五、版本变更记录

+ 1.0.0 初始化目录 
+ 1.1.0 README.md修改添加ESM使用方式 
+ 1.2.0 README.md修改 
+ 1.3.0 README.md修改 
+ 1.4.0 增加String支持 

# 六、使用场景

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>

某些场景下需要判断变量的类型
    
</blockquote>