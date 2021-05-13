<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
检查命令行是否有特殊的标记。
    
</blockquote>

# 一、支持环境

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
由于依赖node的process模块，所以只支持node环境。
    
</blockquote>

# 二、node环境使用 <div style="color:green">（已通过测试√）</div>

```js
npm install --save-dev @parrotjs/has-flag    //安装npm包
```

```js
const hasFlag = require('@parrotjs/has-flag');
 
hasFlag('unicorn');
//=> true
 
hasFlag('--unicorn');
//=> true
 
hasFlag('f');
//=> true
 
hasFlag('-f');
//=> true

hasFlag('--f');
//=> false 
 
hasFlag('foo=bar');
//=> true
 
hasFlag('foo');
//=> false
 
hasFlag('rainbow');
//=> false 
```

```js
$ node foo.js -f --unicorn --foo=bar -- --rainbow
```  
# 三、github源码地址

```js
https://github.com/parrot-design/parrot-utils/tree/main/has-flag
```
# 四、版本变更记录

+ 1.0.0 初始化目录 
+ 1.1.0 修改md说明文件 
+ 1.2.0 修改md说明文件 

# 五、使用场景

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>

判断命令行是否设置了一些变量
    
</blockquote>