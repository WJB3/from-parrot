/*
 * @Author: your name
 * @Date: 2021-01-27 16:32:02
 * @LastEditTime: 2021-01-27 16:41:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Transition/refow.ts
 */
/**
 * 触发回流
 * 不调用这个函数的话，插入节点和修改节点的样式，会在同一次回流和重绘中渲染，你就看不到过渡效果
 * 插入节点先进行一次重绘，元素在页面上了，之后下一次重绘修改样式，才会有过渡效果
 * 你也可以不用reflow，而是在setTimeout()里面去修改样式，也是可以的
 * @param node
 */
export default function reflow (node) {
    return node.scrollTop
}
