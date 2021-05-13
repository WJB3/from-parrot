/*
 * @Author: your name
 * @Date: 2021-02-01 09:43:15
 * @LastEditTime: 2021-02-01 16:17:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Slider/MarkLabel.tsx
 */
import React from 'react';
import { IMarkLabelProps } from './index';
import classNames from '../../utils/classNames';


const MarkLabel=React.forwardRef<any,IMarkLabelProps>((props,ref)=>{

    const {
        prefixCls:superPrefixCls,
        children,
        style
    }=props;

    const prefixCls=`${superPrefixCls}-MarkLabel`;

    return (
        <span
            ref={ref}
            className={
                classNames(prefixCls)
            } 
            style={style}
        > 
            {children}
        </span>
    )
}) as React.FC<IMarkLabelProps>;

export default MarkLabel;