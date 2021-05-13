/*
 * @Author: your name
 * @Date: 2021-01-21 16:12:14
 * @LastEditTime: 2021-01-27 16:34:32
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
import reflow from './reflow'


 
const styles:ITransitionStatusProps={
    entering:{
        opacity:1
    },
    entered:{
        opacity:1
    }
}

export interface IFadeProps {
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
} 

interface IRef{
    current?:React.ReactNode
}
 
const Fade = React.forwardRef<IRef,IFadeProps>((props,ref)=>{
    
    const {
        transitionComponent:TransitionComponent=Transition,
        visible:visibleProp,
        children,
        style,
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
        ...other
    }=props;
 
    
    const handleEnter=(node:HTMLElement)=>{ 
        reflow(node);

        node.style.webkitTransition = `opacity ${timeout && timeout.enter?timeout.enter:timeout}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`;
        node.style.transition =`opacity ${timeout && timeout.enter?timeout.enter:timeout}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`;

        onEnter?.(node);
    };

    const handleExit = function(node:HTMLElement){ 
 
        node.style.webkitTransition = `opacity ${timeout && timeout.exit?timeout.exit:timeout}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`;
        node.style.transition =  `opacity ${timeout && timeout.exit?timeout.exit:timeout}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`;

        onExit?.(node);

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
            mountOnEnter
            {...other}
        >
            {
                (status:string,childProps:any[])=>{
                    return React.cloneElement(children,{
                        style:{
                            opacity:0,
                            visibility:status==='exited' && !visibleProp ? 'hidden' :undefined,
                            ...style,
                            ...(styles as any)[status],
                            ...children?.props?.style
                        },
                        ref:ref,
                        ...childProps
                    })
                }
            }
        </TransitionComponent>
    )

});

export default Fade;