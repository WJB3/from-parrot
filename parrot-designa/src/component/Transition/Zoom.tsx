/*
 * @Author: your name
 * @Date: 2021-01-21 16:12:14
 * @LastEditTime: 2021-01-28 11:41:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Transition/Fade.ts
 */
import React from 'react';
import { Transition } from '../internal/TransitionGroup/index';
import { duration } from '../internal/config/transition'; 
import {
    ITransitionStatusProps,
    ITransitionTimeoutProps
} from './index'; 

 
export interface IZoomProps {
    transitionComponent?:React.ForwardRefExoticComponent<any>,/** 自定义react过渡组件 */
    visible:boolean,/** Fade组件是否可见 */
    children:React.ReactElement, /** 传入的children */
    style?:React.CSSProperties,/** 组件额外的css属性 */
    timeout?:ITransitionTimeoutProps & number,/** 组件的过渡间隔时间 */
    onEnter?:(...list:any[])=>void,/** 组件进入前的回调 */
    onEntering?:(...list:any[])=>void,/** 组件刚进入时的回调 */
    onEntered?:(...list:any[])=>void,/** 组件进入后的回调 */
    onExit?:(...list:any[])=>void,/** 组件离开前的回调 */
    onExited?:(...list:any[])=>void,/** 组件离开后的回调 */
    onExiting?:(...list:any[])=>void,/** 组件离开时的回调 */
    zoom?:number,/** 初始zoom值 */
    extraStyle?:string,/** 组件额外样式 */
} 

interface IRef{
    current?:React.ReactNode
}
 
const Zoom = React.forwardRef<IRef,IZoomProps>((props,ref)=>{
    
    const {
        transitionComponent:TransitionComponent=Transition,
        visible:visibleProp,
        children,
        style,
        zoom=0,
        timeout={
            enter:duration.enteringScreen,
            exit:duration.leavingScreen
        },
        onEnter,
        onEntered,
        onEntering,
        onExit,
        onExited,
        onExiting,
        extraStyle="",
        ...other
    }=props;
 
    
    const handleEnter=(node:HTMLElement)=>{
        node.style.webkitTransition = `transform ${timeout && timeout.enter?timeout.enter:timeout}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`;
        node.style.transition =`transform ${timeout && timeout.enter?timeout.enter:timeout}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`;

        onEnter?.(node);
    };

    const handleExit = function(node:HTMLElement){ 
 
        node.style.webkitTransition = `transform ${timeout && timeout.exit?timeout.exit:timeout}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`;
        node.style.transition =  `transform ${timeout && timeout.exit?timeout.exit:timeout}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`;

        onExit?.(node);

    }; 

    const styles = {
        entering: {
          transform:`scale(1) ${extraStyle}`,
        },
        entered: {
          transform:`scale(1) ${extraStyle}`,
        },
    };
  
    return (
        <TransitionComponent
            appear
            visible={visibleProp}
            onEnter={handleEnter}
            onEntered={onEntered}
            onEntering={onEntering}
            onExit={handleExit}
            onExited={onExited}
            onExiting={onExiting}
            timeout={timeout} 
            {...other}
        >
            {
                (status:string,childProps:any[])=>{
                    return React.cloneElement(children,{
                        style: {
                            transform: `scale(${zoom}) ${extraStyle}`,
                            visibility: status === 'exited' && !visibleProp ? 'hidden' : undefined,
                            ...style,
                            ...styles[status],
                            ...children.props.style
                        },
                        ref:ref,
                        ...childProps
                    })
                }
            }
        </TransitionComponent>
    )

});

export default Zoom;