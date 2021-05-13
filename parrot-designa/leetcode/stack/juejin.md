
# 一、栈的概念 

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
栈是一种遵从后进先出（Last-In-First-Out）原则的有序集合。<br />

如上图，我们可以将元素PUSH(推)进栈中，这时这个元素就在栈的顶端，我们也可以将元素POP(弹)出栈。<br />

例子：超市货架上摞着10公斤的米。<br />

进栈：超市进米时，将米一袋一袋的叠上去，这就是压栈，也就是我们说的PUSH(推)进栈。压在最底下的那一袋米，一定是最先进栈的。<br />

出栈：顾客取米时，将米一袋一袋的拿走，这就是弹栈，也就是我们说的POP出栈。在最上面的那包米，处于栈的最顶层，一定是最先出栈的。
    
</blockquote>

# 二、JS模拟栈结构

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
前文我们提到了栈的概念，但是在Javascript中，是没有栈这种数据结构的，但是我们可以很轻松的通过JS来模拟栈这种数据结构。<br />

我们可以先模拟栈的一些方法，属性，并尝试完善它。<br />

<ul>
    <li>push(element)：添加一个或者多个元素到栈顶</li>
    <li>pop()：移除栈顶的元素，同时返回该元素</li>
    <li>peek()：查看栈顶的元素</li>
    <li>isEmpty()：判断栈是否空了，是则返回 true，否则返回 false</li>
    <li>clear()：清除栈中的所有元素</li>
    <li>size：返回栈里的元素个数，方法和 length 类似</li>
</ul>
    
</blockquote>

```js
function Stack(){
    let items=[];
    this.push=function(element){
        items.push(element);
    };
    this.pop=function(){
        return items.pop();
    }
    this.peek=function(){
        return items[items.length-1]
    }
    this.isEmpty=function(){ 
        return items.length===0; 
    }
    this.clear=function(){
        items.length=0;
    }
    this.size=function(){
        return items.length;
    }
}
```

# 三、前端相关的栈事例

## 1.十进制转二进制


<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
 
小伙伴们还记得十进制转二进制的方法吗？大概逻辑是将一个数每次模上2，先将余数记录下来，再将每次除于2的值（向下取整，舍弃小数部位）当作下一次取余的除数，循环往复直到这个值为0，然后将记录下来的余数从下往上依次排列出来即为二进制的数值。明明是最先得出的余数反而是放在最后，而后得的余数放在了前面，这是不是很符合栈的<i>“后进先出”</i>的理念呢？
    
</blockquote>

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(247, 31, 85,1); background: rgb(239, 235, 233);line-height:1.5;'>
    1.c/b，读作c除以b，或者b除c,其中c叫做被除数，b叫做除数，运算的结果叫做商。<br >
    2.c%b，读作c模上b，其中值为余数。
</blockquote>

<ul>
    <li>十进制35转为二进制</li> 
</ul>

```js
35 % 2 = 1   |   35 / 2 = 17
17 % 2 = 1   |   17 / 2 = 8
8 % 2 = 0    |   8 / 2 = 4
4 % 2 = 0    |   4 / 2 = 2
2 % 2 = 0    |   2 / 2 = 1
1 % 2 = 1    |   1 / 2 = 0
```
 
由上可以得出35的二进制为100011。

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
我们可以用栈结构的思想重构一下转化思路：<br />
1.已知十进制的值为n。<br />
2.将n模上2，将得出的余数放入栈最底部。<br />
3.将n除以2，将得出的商作为下一次循环的除数。（向下取整，舍弃小数部位）<br />
4.循环步骤 2 和步骤 3，直至 n 等于 0 为止。<br />
5.将栈的值从栈顶到栈底部依次取出来，得出最终运算结果。
</blockquote>

然后我们并不难得出Js版十进制转二进制的代码：

```js
function decimalToBinary(n){
    let stack=[];
    while(n!==0){
        stack.push(n%2);
        n=Math.floor(n/2);
    }
    return stack.reverse().join("");
}
```

## 2.十进制转十六进制内任意进制

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
从上文中十进制转二进制中我们可以看出二进制就是除数为2，那么十进制转十六进制内任意进制就是将除数变为对应进制，如二进制除数就是2，8进制除数就是8，那么十六进制初始就是16。
</blockquote>

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(247, 31, 85,1); background: rgb(239, 235, 233);line-height:1.5;'>
这里有一点需要注意的是：电脑中的十六进制数，由十个数字(0、1、2、3、4、5、6、7、8、9)和六个英文字母(A、B、C、D、E、F)表示，其分别代表10、11、12、13、14、15，最大不会大于等于16。
</blockquote>

然后我们就很容易得出Js版十进制转十六进制内任意进制的代码：

```js
function decimalToAnybase(n,binary){
    const stack=[];
    const digits = '0123456789ABCDEF';
    while(n!==0){
        stack.push(digits[n%binary]);
        n=Math.floor(n/binary);
    } 
    return stack.reverse().join("");
}
```

## 3.函数调用堆栈

```js
function greeting(){
    console.log("greetring starting...");
    sayHi()
    console.log("greetring ending...")
}

function sayHi(){
    console.log("sayHi...")
}

greeting();

console.log("ending....")
```
<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
上面这段代码执行出来console的打印顺序是：greeting starting->sayHi->greeting ending->ending...。我们不难发现，最后调用的函数，一定是最先执行完，比如我们这里的sayHi是最后执行的，但是他确实最先执行完的，是不是很符合栈中的<i>“后进先出”</i>的理念呢？JS解释器使用栈来控制函数的调用顺序。
</blockquote>

# 四、Leetcode刷题时间

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
其实前文铺垫了那么多，我还是想刷题，小伙伴们，让我们一起刷起来吧！Go!Go!Go!
</blockquote>

## 一、简单难度

###  1.Leetcode20-有效的括号

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(0,189,170,1); background: rgb(239, 235, 233);line-height:1.5;'>
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。<br />
有效字符串需满足：<br />
1.左括号必须用相同类型的右括号闭合。<br />
2.左括号必须以正确的顺序闭合。 
</blockquote>


<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(247, 31, 85,1); background: rgb(239, 235, 233);line-height:1.5;'>
由例子可知（例子省略）：<br />
1.输入res的长度必须能被2整除。<br />
2.右括号必须有一个对应的左括号。<br />
</blockquote>
                
<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(247, 31, 85,1); background: rgb(239, 235, 233);line-height:1.5;'>
解题思路1:<br />
1.首先设置存储结果的变量res，类型为字符串。<br />
2.判断是否可以被2整除，如果不可以直接返回false。<br />
3.遍历传入的字符串，如果遍历到左括号直接将其加入栈中（res即为定义的栈结构变量，字符串的入栈操作即为拼接字符串），如果遍历到右括号，判断是否和栈顶元素（res即为定义的栈结构变量，字符串的栈顶即为字符串的最后一位自字符）相匹配（即同种类型的左右括号），如果不相等，肯定是非法字符串，直接返回false。如果相等的话不添加元素切将栈顶元素移除（res即为定义的栈结构变量，字符串的栈顶元素移除操作即为将字符串的最后一位移除）。然后继续遍历重复操作3直至遍历结束。<br />
4.按照上面的思路，极有可能出现全是左括号没有右括号的情况。所以需要在最后判断栈结构字符串变量res的长度是否为空，空即为有效字符串。
</blockquote>

```js
var isValid = function(s) { 
    if(s.length%2!==0) return false; 
    let left='([{';
    let right=')]}';
    let map={
        ')':'(',
        '}':'{',
        ']':'['
    }
    let res='';
    for(let c of s){ 
        if(left.indexOf(c)>-1){
            res+=c;
        }else if(right.indexOf(c)>-1 && map[c]!==res[res.length-1]){
            return false;
        }else{
            res=res.substring(0,res.length-1);
        }
    } 
    return res.length===0
};
```

<blockquote style='padding: 10px; font-size: 1em; margin: 1em 0px; color: rgb(0, 0, 0); border-left: 5px solid rgba(247, 31, 85,1); background: rgb(239, 235, 233);line-height:1.5;'>
解题思路2:<br />
1.首先判断是否可以被2整除，如果不可以直接返回false。<br /> 
2.设置匹配同类型括号的正则表达式reg。<br />
3.while循环设置条件为匹配reg正则，如果匹配则始终将同类型括号匹配为空字符串并将其赋值给输入s。<br />
4.在最后判断栈结构字符串变量res的长度是否为空，空即为有效字符串。
</blockquote>

```js
var isValid = function(s) { 
    const reg=/\[\]|\{\}|\(\)/;
    while(reg.test(s)){
        s=s.replace(reg,"");
    }
    return s.length===0;
};
```