import { CSSProperties } from "react";

export interface IIconProps{
    className?:string,
    viewBox?:any,
    component?:string,
    prefixCls?:string,
    rotate?:string
}
export interface IParrotIconProps extends IIconProps{
    onClick?:any,
    icon?:any,
    spin?:any,
    style?:CSSProperties
}