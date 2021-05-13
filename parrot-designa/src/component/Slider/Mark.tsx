import React from 'react';
import { IMarkProps } from './index';
import classNames from '../../utils/classNames';


const Mark=React.forwardRef<any,IMarkProps>((props,ref)=>{

    const {
        prefixCls:superPrefixCls,
        style,
        markActive
    }=props;

    const prefixCls=`${superPrefixCls}-Mark`;

    return (
        <span
            ref={ref}
            className={
                classNames(
                    prefixCls,
                    {
                        [`${prefixCls}-MarkActive`]:markActive
                    }
                )
            } 
            style={style}
        /> 
    )
}) as React.FC<IMarkProps>;

export default Mark;