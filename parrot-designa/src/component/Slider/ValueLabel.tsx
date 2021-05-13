/*
 * @Author: your name
 * @Date: 2021-02-01 09:43:15
 * @LastEditTime: 2021-02-01 12:16:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Slider/ValueLabel.tsx
 */
import React from 'react';
import { IValueLabelProps } from './index';
import classNames from '../../utils/classNames';


const ValueLabel=React.forwardRef<any,IValueLabelProps>((props,ref)=>{

    const {
        prefixCls:superPrefixCls,
        children,
        value,
        open
    }=props;  

    const prefixCls=`${superPrefixCls}-ValueLabel`;

    return React.cloneElement(
        children,
        {
       
        },
        <React.Fragment> 
            <span className={
                classNames(
                    prefixCls,
                    {
                        [`${prefixCls}-Open`]:open,
                    }
                )
            }>
                <span className={`${prefixCls}-Circle`}>
                    <span className={`${prefixCls}-Label`}>
                        {value}
                    </span>
                </span>
            </span>
        </React.Fragment>
    )
}) as React.FC<IValueLabelProps>;

export default ValueLabel;