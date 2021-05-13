<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>

一个包可以将多个或者一个对象的属性描述符合并到一个对象里面
    
</blockquote>

# 一、支持环境

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
支持node环境和浏览器环境
    
</blockquote>

# 二、node环境使用 <div style="color:green">（已通过测试√）</div>

```js
npm install --save @parrotjs/merge-descriptor  //安装npm包
```

```js
//index.js
const merge = require('@parrotjs/merge-descriptor');

let obj1= { a: 'a' };
let obj2 = { b: 'b',c:'c' };
let obj3 = { d: 'd',e:'e',f:'f' };
 
merge(obj1,obj2,obj3);

console.log("---obj1---",obj1);
//---obj1--- { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f' }

Object.defineProperty(obj2,'c',{enumerable:false})

Object.defineProperty(obj3,'f',{enumerable:false})

merge(obj1,obj2,obj3);

console.log("---obj2---",obj1);
//---obj1--- { a: 'a', b: 'b', d: 'd', e: 'e' }

```

# 三、浏览器环境使用

## 1.HTML中使用 <div style="color:green">（已通过测试√）</div>

```js
//使用upk在线cdn
https://unpkg.com/@parrotjs/merge-descriptor@2.4.0/index.js
```


```js
//使用jsdelivr在线cdn
https://cdn.jsdelivr.net/npm/@parrotjs/merge-descriptor@2.4.0/index.js
```


```html
//index.html
<!DOCTYPE html>
<html>

<head>Test</head>

<body>
    <script src="https://unpkg.com/@parrotjs/merge-descriptor@2.4.0/index.js"></script>
    <script>
        let obj1 = { a: 'a' };
        let obj2 = { b: 'b', c: 'c' };
        let obj3 = { d: 'd', e: 'e', f: 'f' };

        mergeDescriptor(obj1, obj2, obj3);

        console.log("---obj1---");
        for(let o in obj1){
            console.log(o)
        }
        //---obj1---  a, b, c, d, e, f

        Object.defineProperty(obj2, 'c', { enumerable: false })

        Object.defineProperty(obj3, 'f', { enumerable: false })

        mergeDescriptor(obj1, obj2, obj3);

        console.log("---obj2---");
        for(let o in obj1){
            console.log(o)
        }
        //---obj1---  a, b, d, e
    </script>
</body>

</html>
``` 

## 2.ESM中使用<div style="color:green">（已通过测试√）</div>

```js
        import merge from '@parrotjs/merge-descriptor'
        //index.js
        let obj1 = { a: 'a' };
        let obj2 = { b: 'b', c: 'c' };
        let obj3 = { d: 'd', e: 'e', f: 'f' };

        mergeDescriptor(obj1, obj2, obj3);

        console.log("---obj1---");
        for(let o in obj1){
            console.log(o)
        }
        //---obj1---  a, b, c, d, e, f

        Object.defineProperty(obj2, 'c', { enumerable: false })

        Object.defineProperty(obj3, 'f', { enumerable: false })

        mergeDescriptor(obj1, obj2, obj3);

        console.log("---obj2---");
        for(let o in obj1){
            console.log(o)
        }
        //---obj1---  a, b, d, e
```

# 四、github源码地址

```js
https://github.com/parrot-design/parrot-utils/tree/main/merge-descriptor
```
# 五、版本变更记录

+ 1.0.0 初始化目录 
+ 2.1.0 修改包
+ 2.2.0 修改包
+ 2.4.0 修改md文件

# 六、使用场景

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>

某些时候需要快速将多个或者一个对象的属性描述符合并到一个对象里面
    
</blockquote>
