/*
 * @Author: your name
 * @Date: 2021-01-29 09:43:28
 * @LastEditTime: 2021-01-29 10:32:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/internal/ClickAwayListener/ClickAwayListener.tsx
 */
import React from 'react';
import { IClickAwayListenerProps } from './index';
import useEnhancedEffect from '../../../hook/useEnhancedEffect';
import ownerDocument from '../../../utils/ownerDocument';
import useForkRef from '../../../hook/useForkRef';
import mapEventPropToEvent from '../../../utils/mapEventPropToEvent';

const ClickAwayListener: React.FC<IClickAwayListenerProps> = ((props) => {

    const {
        children,
        onClickAway,
        mouseEvent = 'onClick',
        externalNode
    } = props;

    const nodeRef = React.useRef<Element>(null);

    const handleClickAway = React.useCallback((event) => {
        let insideDOM;  
        let externalDOM;

        if (event.composedPath) {
            /** event.composedPath为冒泡路径 可以判断children是否在冒泡节点上 */
            insideDOM = event.composedPath().indexOf(nodeRef.current) > -1;
        }else{
            insideDOM=nodeRef.current.contains( 
              event.target,
            );
        }   
        if(externalNode && externalNode.indexOf(event.target)>-1){ 
            externalDOM=true;
        }
        if (!insideDOM || externalDOM) { 
            onClickAway(event);
        }
    }, [nodeRef.current,externalNode]);

    const handleRef = useForkRef(children.ref, nodeRef)

    useEnhancedEffect(() => {
        if (mouseEvent !== false) {
            const mappedMouseEvent = mapEventPropToEvent(mouseEvent);

            const doc = ownerDocument(nodeRef.current);

            doc.addEventListener(mappedMouseEvent, handleClickAway);

            return () => {
                doc.removeEventListener(mappedMouseEvent, handleClickAway);
            };
        }
        return undefined;

    }, [handleClickAway, mouseEvent])

    const childrenProps = { ref: handleRef }

    return (
        <React.Fragment>{React.cloneElement(children, childrenProps)}</React.Fragment>
    )

});

export default ClickAwayListener;