/*
 * @Author: your name
 * @Date: 2021-01-21 16:12:14
 * @LastEditTime: 2021-01-28 11:40:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Transition/Fade.ts
 */
import React from 'react';
import { Transition } from '../internal/TransitionGroup/index';
import { duration } from '../internal/config/transition'; 
import { 
    ITransitionTimeoutProps
} from './index'; 
 
 
export interface IGrowProps {
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
    extraStyle?:Object,/** 额外的样式 */
} 

interface IRef{
    current?:React.ReactNode
}

function getScale(value) {
    return `scale(${value}, ${value ** 2})`;
}

import reflow from './reflow'
 
const Grow = React.forwardRef<IRef,IGrowProps>((props,ref)=>{
    
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
        extraStyle='',
        ...other
    }=props;
 
    
    const handleEnter = function(node){  
 

        node.style.webkitTransition = `opacity ${timeout && timeout.enter?timeout.enter:timeout}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${timeout && timeout.enter?timeout.enter:timeout}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        node.style.transition =`opacity ${timeout && timeout.enter?timeout.enter:timeout}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${timeout && timeout.enter?timeout.enter:timeout}ms cubic-bezier(0.4, 0, 0.2, 1)`;

        onEnter?.(node);

    };

    const handleExit = function(node){ 
 
        node.style.webkitTransition = `opacity ${timeout && timeout.enter?timeout.enter:timeout}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform ${timeout && timeout.exit?timeout.exit:timeout}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;`;
        node.style.transition =  `opacity ${timeout && timeout.enter?timeout.enter:timeout}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform ${timeout && timeout.exit?timeout.exit:timeout}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;`;

        node.style.opacity = '0';
        node.style.transform = `${getScale(0.75)}`;

        onExit?.(node);

    }; 

    const styles = {
        entering: {
            opacity: 1,
            transform:`${getScale(1)} ${extraStyle}`,
        },
        entered: {
            opacity: 1,
            transform: `${getScale(1)} ${extraStyle}`,
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
                            opacity: 0,
                            transform: `${getScale(0.75)} ${extraStyle}`,
                            visibility: status === 'exited' && !visibleProp ? 'hidden' : undefined,
                            ...style,
                            ...styles[status],
                            ...children.props.style,
                            
                        },
                        ref:ref,
                        ...childProps
                    })
                }
            }
        </TransitionComponent>
    )

});

export default Grow;