import { CSSProperties } from 'react';
import { tuple } from '../../../utils/type';

export const componentSize=tuple('default','small','large'); 

export const componentType=tuple('landscape','outline');

export const componentColor=tuple('primary','danger','warning','info','success','minor','default');

export const componentShape=tuple('circle','round');

export const  placements=tuple(
    'top-start','top','top-bottom',
    'bottom-start','bottom','bottom-end',
    'left','left-start','left-end',
    'right','right-start','right-end'
) 

export interface IBaseProps{
    prefixCls?:string,/** 组件类名前缀 */
    className?:string,/** 组件类名 */
    style?:CSSProperties,/** 组件style样式 */
}

export interface IFormBaseProps{
    value?:any,/** 传入的value值，可控  */
    defaultValue?:any,/** 传入的默认值 */
}