<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
一个包可以获得一个空函数
    
</blockquote>

# 一、支持环境

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
支持node环境和浏览器环境
    
</blockquote>

# 二、node环境使用 <div style="color:green">（已通过测试√）</div>

```js
npm install --save @parrotjs/noop  //安装npm包
```

```js
//index.js
const noop =require('@parrotjs/noop');

console.log(noop()) // undefined 

```

# 三、浏览器环境使用

## 1.HTML中使用 <div style="color:green">（已通过测试√）</div>

```js
//使用upk在线cdn
https://unpkg.com/@parrotjs/noop@1.0.0/index.js
```


```js
//使用jsdelivr在线cdn
https://cdn.jsdelivr.net/npm/@parrotjs/noop@1.0.0/index.js
```


```html
//index.html
<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <script src="https://cdn.jsdelivr.net/npm/@parrotjs/noop@1.0.0/index.js" ></script>
        <script> 
            console.log(NOOP()) 
        </script>
    </body>
</html>
``` 

## 2.ESM中使用 <div style="color:green">（已通过测试√）</div>

```js
import noop from '@parrotjs/noop';

console.log(noop()) // undefined
 
```

# 四、github源码地址

```js
https://github.com/parrot-design/parrot-utils/tree/main/noop
```
# 五、版本变更记录

+ 1.0.0 初始化目录  

# 六、使用场景

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
因为一些兼容性问题不得不在默认值处增加noop函数。
    
</blockquote>