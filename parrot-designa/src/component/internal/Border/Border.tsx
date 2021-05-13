import React, { useContext } from 'react';
import {
    ConfigContext
} from '../../ConfigProvider/index';
import './index.scss';

const Border=(props)=>{
    const {
        prefixCls:customizedPrefixCls
    }=props;

    const prefixCls=useContext(ConfigContext)?.getPrefixCls('Border',customizedPrefixCls);

    return (
        <div 
            className={prefixCls}
        /> 
    )
};

export default Border;