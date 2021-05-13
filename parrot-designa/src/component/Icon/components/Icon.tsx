/*
 * @Author: your name
 * @Date: 2021-02-01 09:43:15
 * @LastEditTime: 2021-02-01 15:15:46
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Icon/components/Icon.tsx
 */
import React,{useContext} from 'react';
import classNames from '../../../utils/classNames';
import {
    ConfigContext
} from '../../ConfigProvider/index';
import {
    IIconProps
} from './index';
import {
    svgBaseProps
} from '../utils'; 

const Icon=React.forwardRef<any, IIconProps>((props,ref)=>{
    const {
        className,
        viewBox,
        component:Component,
        children,
        rotate,
        prefixCls:customizePrefixCls, 
    }=props; 

    const prefixCls=useContext(ConfigContext)?.getPrefixCls("Icon",customizePrefixCls); 

    const svgStyle=rotate?{msTransform:`rotate(${rotate}deg)`,transform:`rotate(${rotate}deg)`}:undefined; 

    const innerSvgProps={
        ...svgBaseProps,
        style:svgStyle,
        viewBox
    }

    const renderInnerNode=()=>{
        if(Component){
            return <Component {...innerSvgProps}>{children}</Component>
        }

        if(children){
            return (
                <svg {...innerSvgProps} viewBox={viewBox}>
                    {children}
                </svg>
            )
        }

        return null;
    }

    return (
        <span
            ref={ref}
            className={
                classNames(
                    className,
                    prefixCls, 
                )
            }
        >
            {renderInnerNode()}
        </span>
    )

}) as React.FC<IIconProps>;

export default Icon;