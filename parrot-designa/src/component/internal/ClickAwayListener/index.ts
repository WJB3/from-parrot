/*
 * @Author: your name
 * @Date: 2021-01-29 09:43:14
 * @LastEditTime: 2021-01-29 10:21:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/internal/ClickAwayListener/index.ts
 */
export interface IClickAwayListenerProps{
    children?:any,
    onClickAway?:Function,/** 点击其他地方的回调 */
    mouseEvent?:string|boolean,/** 鼠标事件 */
    externalNode?:any,/** 点击这里面的节点也会触发onClick事件 */
}

export {  default } from './ClickAwayListener';