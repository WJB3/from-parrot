/*
 * @Author: your name
 * @Date: 2021-01-22 16:28:42
 * @LastEditTime: 2021-01-29 09:55:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Portal/index.ts
 */

import React ,{ useState } from 'react';
import ReactDOM from 'react-dom';
import useForkRef from '../../hook/useForkRef';
import useEnhancedEffect from '../../hook/useEnhancedEffect';

export interface IPortalProps{
    disablePortal?:boolean,/** 是否禁用portal */
    container?:Function | React.ReactElement /** 目标挂载 */
}

function getContainer(container:Function | React.ReactElement) {
    const containerSelf = typeof container === 'function' ? container() : container;
    return ReactDOM.findDOMNode(containerSelf);
}

const Portal=React.forwardRef<any,IPortalProps>((props,ref)=>{

    const {
        disablePortal=false,
        children,
        container
    }=props;

    const [mountNode,setMountNode]=useState(null);

    const handleRef=useForkRef(React.isValidElement(children) ? (children as any).ref : null,ref)

    useEnhancedEffect(()=>{
        if (!disablePortal) {
            setMountNode(getContainer(container) || document.body);
        }
    },[container,disablePortal]);

    if(disablePortal){
        /** 验证对象是否是React元素 */
        if(React.isValidElement(children)){
            return React.cloneElement(children,{
                ref:handleRef,
                id:"protal"
            })
        }
    }

    return mountNode ? ReactDOM.createPortal(children,mountNode) : mountNode ;

}) as React.FC<IPortalProps>;

export default Portal;
