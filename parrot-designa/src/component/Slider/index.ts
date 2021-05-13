/*
 * @Author: your name
 * @Date: 2021-02-01 09:43:15
 * @LastEditTime: 2021-02-01 10:32:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Slider/index.ts
 */

import {
    IBaseProps,
    IFormBaseProps
} from '../internal/config/types';

export interface ISliderProps extends IBaseProps,IFormBaseProps{
    orientation?:'vertical｜horizontal',/** slider方向 */
    marks?:any[]|boolean,/**slider标记 */
    step?:number,/** sliderstep */
    min?:number,/** slider最小值 */
    max?:number,/** slider最大值 */
    track?:'normal'|boolean,/** 决定是否禁用轨道 */
    valueLabelDisplay?:'off'|'auto'|'on',/** value是否展示 */
    onMouseDown?:Function,/** mousedown事件 */
    onChange?:Function,/** change事件变化的回调 */
    onChangeCommitted?:Function,/** mouseup 或者touchend的回调 */
    disabled?:boolean,/** 是否禁用slider */
    color?:string,/** 颜色 */
}
export interface IRailProps extends IBaseProps{

}
export interface ITrackProps extends IBaseProps{

}
export interface IThumbProps extends IBaseProps{
    tabIndex?:number,/** 是否有焦点索引 */
    role?:string,/** 是否有角色 */
    dataIndex?:number,/** 下标 */
    onMouseOver?:Function,/** mouseover鼠标进入元素上时 */
    onMouseLeave?:Function,/** 鼠标离开元素时 */
    onFocus?:Function,/** 元素聚焦时 */
    onBlur?:Function,/** 元素离焦时 */
}
export interface IMarkProps extends IBaseProps{
    markActive?:boolean,/** 是否激活 */
}
export interface IMarkLabelProps extends IBaseProps{

}
export interface IValueLabelProps extends IBaseProps{
    value?:number,
    children?:any,
    open?:boolean,
}   

export {
    default
} from './Slider';