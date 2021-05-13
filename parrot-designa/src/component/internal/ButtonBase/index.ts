/*
 * @Author: your name
 * @Date: 2021-01-25 09:54:23
 * @LastEditTime: 2021-01-26 15:03:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/internal/ButtonBase/index.ts
 */
import React from 'react';
export interface ButtonBaseComponentProps{
    tabIndex?:number,
    className?:string,
    ref?:React.ReactNode,
    onClick?:Function,
    onMouseDown?:Function,
    onMouseUp?:Function,
    onMouseLeave?:Function,
    onTouchStart?:Function,
    onTouchEnd?:Function,
    onTouchMove?:Function,
    onFocus?:Function,
    onBlur?:Function,
    onKeyDown?:Function,
    onKeyUp?:Function,
    style?:React.CSSProperties, /** 按钮样式 */
}

export interface ButtonBaseProps {
    component?:string|React.FC<ButtonBaseComponentProps>, /** 组件的component */
    className?:string, /** className表示类名 */
    disabled?:boolean, /** 表示是否禁用此组件 */
    tabIndex?:number, /** 表示是否可以设置键盘中的TAB键在控件中的移动顺序,即焦点的顺序,添加此属性可处罚焦点事件 */
    prefixCls?:string, /** 类名前缀 */
    disableRipple?:boolean, /** 禁用触摸涟漪效果 */
    onClick?:Function, /** 按钮点击事件 */
    onMouseDown?:Function, /** 鼠标按下事件 */
    onMouseUp?:Function, /** 鼠标按下放开事件 */
    onMouseLeave?:Function, /** 鼠标离开事件 不包含子元素的区域 */
    onTouchStart?:Function, /** 手指触摸刚开始事件 */
    onTouchEnd?:Function, /** 手指触摸离开事件 */
    onTouchMove?:Function, /** 手指移动事件 */
    onFocus?:Function, /** 触发焦点事件 */
    onBlur?:Function, /** 离开焦点事件 */
    onKeyDown?:Function, /** 键盘按键按下事件 */
    onKeyUp?:Function, /** 键盘案件离开事件 */
    style?:React.CSSProperties, /** 按钮样式 */
    center?:boolean|string, /** 波纹是否从中间展开 */
    ref?:React.ReactNode,
    deep?:number,
    shape?:string
}

export interface TouchRippleComponentProps{
    className?:string,
    ref?:React.ReactNode,
}

export interface TouchRippleProps {
    prefixCls?:string, /** 类名前缀 */
    component?:string|React.FC<TouchRippleComponentProps>, /** 包裹组件 */
    center?:boolean, /** 涟漪是否从中心走过 */
    ref?:React.ReactNode,
}
export interface RippleProps {
    prefixCls?: string, // 类名前缀
    rippleSize: number, // 涟漪大小
    rippleX: number, // 点击x坐标
    rippleY: number, // 点击y坐标
    in?: boolean, // 组件是否进入
    onExited?: () => void, // 通知TransitionGroup进行回调
    timeout?: number
}

export interface IRippleStyle {
    width: number,
    height: number,
    top: number,
    left: number
}

export { default } from './ButtonBase';
