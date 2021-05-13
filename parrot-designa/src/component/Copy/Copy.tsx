import React ,{useContext, useRef, useState} from 'react';
import { ICopyProps } from './index'; 
import {
    Fade
} from '../Transition/index';
import {
    Copy as CopyIcon
} from '../Icon/index';
import {
    ConfigContext
} from '../ConfigProvider/index';
import useEnhancedEffect from '../../hook/useEnhancedEffect';
import copy from '../../utils/copy-to-clipboard';
import './index.scss';


const Copy=React.forwardRef<any,ICopyProps>((props,ref)=>{

    const {
        prefixCls:customizedPrefixCls, 
        children,
        text,
        onCopy
    }=props;

    const prefixCls=useContext(ConfigContext)?.getPrefixCls('Copy',customizedPrefixCls);

    const childrenRef=useRef(null);

    const [visible,setVisible]=useState(false);

    const [fontSize,setFontSize]=useState(0);

    const handleMouseEnter=React.useCallback((event)=>{
        setVisible(true);
    },[visible]);

    const handleMouseLeaver=React.useCallback((event)=>{
        setVisible(false);
    },[visible]);

    const handleCopy=React.useCallback((event)=>{  
        copy(text,{
            onCopy:onCopy
        })
    },[text,onCopy]);

    useEnhancedEffect(()=>{
        const { width,height }=childrenRef.current && childrenRef.current.getBoundingClientRect();
        if(width===height){
            setFontSize(width * 0.4);
        }else if(width>height){
            setFontSize(height * 0.4);
        }else{
            setFontSize(width * 0.4);
        }
    },[childrenRef.current]);

    return (
        <div 
            className={prefixCls} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeaver}   
        >
            {React.cloneElement(children,{ref:childrenRef})}
            <Fade visible={visible} >
                <div className={`${prefixCls}-CopyIcon`}>
                    <CopyIcon style={{fontSize:fontSize}} onClick={handleCopy}/>
                </div>
            </Fade>
        </div>
    )
}) as React.FC<ICopyProps>;

export default Copy;