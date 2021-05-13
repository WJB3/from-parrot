<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
可以获得一些http的methods
    
</blockquote>

# 一、支持环境

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
支持node环境和浏览器环境 
    
</blockquote>

# 二、node环境使用 <div style="color:green">（已通过测试√）</div>

```js
npm install --save @parrotjs/http-methods  //安装npm包
```

```js

const methods=require('@parrotjs/http-methods'); 

console.log(methods);/** [
  'acl',         'bind',       'checkout',
  'connect',     'copy',       'delete',
  'get',         'head',       'link',
  'lock',        'm-search',   'merge',
  'mkactivity',  'mkcalendar', 'mkcol',
  'move',        'notify',     'options',
  'patch',       'post',       'propfind',
  'proppatch',   'purge',      'put',
  'rebind',      'report',     'search',
  'source',      'subscribe',  'trace',
  'unbind',      'unlink',     'unlock',
  'unsubscribe'
]**/

```

# 三、浏览器环境使用

## 1.HTML中使用 <div style="color:green">（已通过测试√）</div>


```js
//使用upk在线cdn
https://unpkg.com/@parrotjs/http-methods@1.4.0/browser.js
```


```js
//使用jsdelivr在线cdn
https://cdn.jsdelivr.net/npm/@parrotjs/http-methods@1.4.0/browser.js
```

```html
//index.html
<!DOCTYPE html>
<html>

<head>Test</head>

<body>
    <script src="https://cdn.jsdelivr.net/npm/@parrotjs/http-methods@1.4.0/browser.js"></script>
    <script>
        console.log(HTTPMETHODS())
        //["get", "post", "put", "head", "delete", "options", "trace", "copy", "lock", "mkcol", "move", "purge", "propfind", "proppatch", "unlock", "report", "mkactivity", "checkout", "merge", "m-search", "notify", "subscribe", "unsubscribe", "patch", "search", "connect"]
    </script>
</body>

</html>
``` 
  
## 2.ESM中使用 <div style="color:green">（已通过测试√）</div>

```js
        import httpmethods from '@parrotjs/http-methods'
        
        console.log(httpmethods())
```
# 四、github源码地址

```js
https://github.com/parrot-design/parrot-utils/tree/main/httpmethods
```
# 五、版本变更记录

+ 1.0.0 初始化目录 
+ 1.1.0 修改md文件  
+ 1.2.0 添加浏览器支持 
+ 1.3.0 添加浏览器支持 

# 6、使用场景

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
需要获得一些http的methods node原生模块的方法是大写
    
</blockquote>