/*
 * @Author: your name
 * @Date: 2021-01-20 18:02:04
 * @LastEditTime: 2021-01-28 11:36:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/internal/TransitionGroup/Transition.tsx
 */
import React, { useMemo, useRef, useState } from 'react';
import noop from '../../../utils/noop';
import useCallbackState from '../../../hook/useCallbackState';
import TransitionGroupContext from './TransitionGroupContext';
import useForkRef from '../../../hook/useForkRef';
import useEnhancedEffect from '../../../hook/useEnhancedEffect';

export enum STATUS {
    UNMOUNTED = 'unmounted', /** 节点已挂载 */
    ENTERING = 'entering', /** 节点正在进行开始过渡 */
    ENTERED = 'entered', /** 节点进入过渡结束，此时节点挂载 */
    EXITING = 'exiting', /** 节点正在进行离开过渡 */
    EXITED = 'exited', /** 节点离开过渡结束，此时节点挂载 */
}

type common = ((node: React.ReactNode) => void);

interface ITimeout {
    enter?: number,
    exit?: number
}

export interface ITransitionProp {
    visible: boolean, /** 记录此时过渡元素是否显示或者隐藏 */
    onEnter?: common, /** 进入过渡开始时的回调 */
    onEntering?: common, /** 进入过渡开始中的回调 */
    onEntered?: common, /** 进入过渡完成时的回调 */
    onExit?: common, /** 离开过渡开始时的回调 */
    onExiting?: common, /** 离开过渡开始中的回调 */
    onExited?: common, /** 离开过渡完成时的回调 */
    timeout: number & ITimeout, /** 过渡的时间 */
    unmountOnExit?: boolean, /** 离开过渡结束后是否卸载节点 */
    mountOnEnter?: boolean, /** 进入过渡开始前是否挂载节点 */
    appear?: boolean, /** 指定初始化时是否有过渡效果 */
    disappear?: boolean, /** 未知 */
}
 

export type commonFunc = (...list: any[]) => void;

const Transition = React.forwardRef<unknown, ITransitionProp>((props, ref) => {

    const {
        children,
        visible: visibleProp = false,
        onEnter = noop,
        onEntering = noop,
        onEntered = noop,
        onExit = noop,
        onExiting = noop,
        onExited = noop,
        timeout,
        unmountOnExit = false,
        mountOnEnter = false,
        appear = false,
        disappear = false,
        ...childProps
    } = props;

    const nodeRef = useRef<React.ReactNode>(null);

    const handleRef = useForkRef(ref, nodeRef);

    const { initialStatus } = React.useMemo(() => {
        let initialStatus: string;

        if (visibleProp) {
            /** 当visible为true时，默认是已经过渡开始完成 */
            if (appear) {
                initialStatus = STATUS.EXITED;
            } else {
                initialStatus = STATUS.ENTERED;
            }

        } else {
            if (unmountOnExit || mountOnEnter) {
                /** 当visible为false时，默认节点未挂载 */
                initialStatus = STATUS.UNMOUNTED
            } else {
                initialStatus = STATUS.EXITED
            }

        }

        return {
            initialStatus: initialStatus
        }
    }, []);
 

    const [status, setStatus] = useCallbackState(initialStatus);

    const { enter, exit } = useMemo(() => {

        let enter, exit;
        if (typeof timeout === 'number') {
            enter = exit = timeout
        } else if (typeof timeout === 'object') {
            enter = timeout && timeout.enter ? timeout.enter : 225;
            exit = timeout && timeout.exit ? timeout.exit : 195;
        }

        return {
            enter: enter,
            exit: exit
        }

    }, [timeout]) 

    useEnhancedEffect(() => {

        /** 当visible由false变为true时 */
        if (visibleProp && (status === STATUS.EXITED)) { 
            onEnter?.(nodeRef.current);

            setStatus(STATUS.ENTERING, () => {
                onEntering?.(nodeRef.current);

                setTimeout(() => {
                    setStatus(STATUS.ENTERED);
                    onEntered?.(nodeRef.current);
                }, enter);
            })
            /** 当visible由true变为false时 */
        } else if (!visibleProp && status === STATUS.ENTERED) {
   
            onExit?.(nodeRef.current);
            setStatus(STATUS.EXITING, () => {
                onExiting?.(nodeRef.current);

                setTimeout(() => { 
                    setStatus(STATUS.EXITED);
                    onExited?.(nodeRef.current);
                }, exit);
            })
            /** 当元素刚挂载到节点时，先将状态转化为EXITED状态，再走第一个if */
        } else if (visibleProp && status === STATUS.UNMOUNTED) {
            setStatus(STATUS.EXITED);
        } else if (!visibleProp && status === STATUS.EXITED && unmountOnExit) {
            setStatus(STATUS.UNMOUNTED)
        }

    }, [visibleProp, status, exit, enter]);

    const { TransitionComponent } = React.useMemo(() => {

        let Component;

        if (typeof children === 'function') {
            Component = children(status, childProps);
        } else {
            Component = React.cloneElement(React.Children.only((children as any)), childProps);
        }

        return {
            TransitionComponent: Component
        }

    }, [status, children, childProps]) 

    if (status === STATUS.UNMOUNTED) {
        /** 如果状态是unmounted未挂载直接返回null,销毁节点 */
        return null;
    }
 

    return (
        <TransitionGroupContext.Provider value={null}>
            {
                React.cloneElement(
                    TransitionComponent,
                    {
                        ref: handleRef
                    }
                )
            }
        </TransitionGroupContext.Provider>
    )
});

export default Transition;
