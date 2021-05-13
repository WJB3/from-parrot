/*
 * @Author: your name
 * @Date: 2021-01-26 16:12:53
 * @LastEditTime: 2021-01-29 13:26:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Tooltip/index.ts
 */

import { placements , componentColor} from '../internal/config/types';

export type TooltipColor=typeof componentColor[number];


type placementTypes=typeof placements[number];
export interface ITooltipProps{
    orientation?:placementTypes,/** 提示框出现位置 */
    color?:TooltipColor,/** 提示框颜色 */
    defaultVisible?:boolean,/** 默认是否隐藏 */
    visible?:boolean,/** 是否隐藏，可控 */
    children:React.ReactElement, /** 传入的children */
    title?:React.ReactNode,/** tooltip提示文字 */
    transition?:boolean|string,/** 过渡属性 */
    TransitionProps?:Object,/** 指定过渡的属性 */
    prefixCls?:string,/** 类名前缀 */
    trigger?:'hover'|'focus'|'click'|'contextMenu'|any[],/** 触发事件 */
    enterDelay?:number,/** 触发事件延时多少秒tooltip才显示 */
    leaveDelay?:number,/** 离开事件延迟多少秒tooltip才显示 */
    onChange?:Function,/** 内部visible变化的回调 */
    onVisibleChange?:Function,/** visible真实变化的回调 */
    enterTouchDelay?:number,/** 延迟触摸间隔事件 */
    leaveTouchDelay?:number,/** 延迟触摸间隔事件 */
    autoAdjustOverflow?:boolean,/** 气泡被遮挡时自动调整位置 */	
    destroyTooltipOnHide?:boolean,/** 关闭后是否销毁 Tooltip，当 keepParent 为 false 时销毁父容器 */
    arrow?:boolean,/** 是否存在箭头 */
    mode?:'popover'|'popconfirm',/** 模式 */
    externalNode?:any
}


export { default } from './Tooltip';