import React from 'react';
import { ITrackProps } from './index';
import classNames from '../../utils/classNames';


const Track=React.forwardRef<any,ITrackProps>((props,ref)=>{

    const {
        prefixCls:superPrefixCls,
        style
    }=props;

    const prefixCls=`${superPrefixCls}-Track`;

    return (
        <span
            ref={ref}
            className={
                classNames(prefixCls)
            } 
            style={style}
        /> 
    )
}) as React.FC<ITrackProps>;

export default Track;