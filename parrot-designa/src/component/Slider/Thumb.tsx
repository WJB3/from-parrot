/*
 * @Author: your name
 * @Date: 2021-02-01 09:43:15
 * @LastEditTime: 2021-02-01 11:41:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Slider/Thumb.tsx
 */
import React from 'react';
import { IThumbProps } from './index';
import classNames from '../../utils/classNames';


const Thumb=React.forwardRef<any,IThumbProps>((props,ref)=>{

    const {
        prefixCls:superPrefixCls,
        style,
        children,
        dataIndex,
        className,
        ...restProps
    }=props;

    const prefixCls=`${superPrefixCls}-Thumb`;

    return (
        <span
            ref={ref}
            style={style}
            className={
                classNames(prefixCls,className)
            } 
            data-index={dataIndex}
            {...restProps}
        >{children}</span> 
    )
}) as React.FC<IThumbProps>;

export default Thumb;