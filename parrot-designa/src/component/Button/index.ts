/*
 * @Author: your name
 * @Date: 2021-01-22 17:25:28
 * @LastEditTime: 2021-01-22 17:42:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Button/index.ts
 */
import Button from './Button';

import Group from './Group';

import './index.scss';

import { componentSize,componentType,componentColor,componentShape } from '../internal/config/types'; 
 
export type ButtonSize=typeof componentSize[number];

export type ButtonType=typeof componentType[number] | 'text';

export type ButtonColor=typeof componentColor[number];

export type ButtonShape=typeof componentShape[number];
export interface IButtonProps{
    prefixCls?:string, /** 组件类名前缀 */
    className?:string, /** 组件额外类名 */
    size?: ButtonSize, /** 组件大小 */
    type?: ButtonType, /** 组件类型 */
    color?: ButtonColor,/** 组件color */
    dashed?: boolean,/** 是否是虚线 此属性只有在outline时才会生效 */ 
    deep?:number|undefined,/** button的阴影深度 */
    style?:React.CSSProperties,/** 按钮的css属性 */
    block?:boolean ,/** 将按钮宽度调整为其父宽度的选项 */
    disabled?:boolean,/** 按钮是否禁用 */
    shape?:ButtonShape,/** 按钮形状 */
    center?:boolean,/** 波纹是否从中间扩散 */
    loading?:boolean,/** 按钮是否加载中 */
    isFirst?:boolean,/** 是否是第一个 */
    isLast?:boolean,/** 是否是最后一个 */
    inGroup?:boolean,/** 是否在group组内 */
}

export interface IButtonGroupProps extends IButtonProps{
    orientation?:'vertical'|'horizontal'
}

export type IButton = React.FC<IButtonProps> & { 
    Group: React.FC<IButtonGroupProps>
}

const ParrotButton=Button as IButton;

ParrotButton.Group=Group; 

export default ParrotButton;
