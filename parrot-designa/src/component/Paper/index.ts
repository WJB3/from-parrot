/*
 * @Author: your name
 * @Date: 2021-01-21 18:12:50
 * @LastEditTime: 2021-01-29 09:48:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Paper/index.ts
 */
import Paper from './Paper';
import React from 'react';

import { componentShape } from '../internal/config/types';

export type PaperShape = typeof componentShape[number];

export interface IPaperComponentProp {
    ref?: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
    onMouseEnter?:Function,
    onMouseLeave?:Function
}


export interface IPaperProps {
    prefixCls?: string, /** 类名前缀 */
    className?: string, /** 组件传入的类名 */
    component?: string | React.FC<IPaperComponentProp>, /** 组件的指定组件 */
    square?: boolean, /** 指定组件是否是正方形 */
    deep?: number, /** 阴影深度 */
    style?: React.CSSProperties, /** 组件style */
    shape?: any,/** paper的形状 */
    tabIndex?: number | undefined,/** 是否可以聚焦 */
    ref?: React.ReactNode,/** react节点 */
    onClick?: Function,/** 点击事件 */
    onMouseDown?: Function,
    onMouseUp?: Function
    onMouseLeave?: Function
    onMouseEnter?:Function
    onTouchStart?: Function
    onTouchEnd?: Function
    onTouchMove?: Function
    onFocus?: Function
    onBlur?: Function
    onKeyDown?: Function
    onKeyUp?: Function,
    center?:boolean,
    id?:string,
    role?:string,
    transparent?:boolean,/** 背景色是否透明 */
    inline?:boolean,/** 是否行内布局 */
}

export default Paper;


