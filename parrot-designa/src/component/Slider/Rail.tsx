import React from 'react';
import { IRailProps } from './index';
import classNames from '../../utils/classNames';


const Rail=React.forwardRef<any,IRailProps>((props,ref)=>{

    const {
        prefixCls:superPrefixCls
    }=props;

    const prefixCls=`${superPrefixCls}-Rail`;

    return (
        <span
            ref={ref}
            className={
                classNames(prefixCls)
            } 
        /> 
    )
}) as React.FC<IRailProps>;

export default Rail;