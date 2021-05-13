/*
 * @Author: your name
 * @Date: 2021-01-21 16:12:14
 * @LastEditTime: 2021-01-29 09:55:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Transition/Fade.ts
 */
import React ,{useRef} from 'react';
import { Transition } from '../internal/TransitionGroup/index';
import { duration } from '../internal/config/transition'; 
import {
    ITransitionStatusProps,
    ITransitionTimeoutProps
} from './index'; 
import useEnhancedEffect from '../../hook/useEnhancedEffect';

 
export function setTranslateValue(direction, node) {
    const transform = getTranslateValue(direction, node); 
    if (transform) {
        node.style.webkitTransform = transform;
        node.style.transform = transform;
    }
}


function getTranslateValue(direction, node) { 
    const rect = node.getBoundingClientRect();

    const nodeChild=node?.childNodes[0]; 
 
    let transform;
    let childTop=0;

    if(nodeChild){
        childTop=Number(window.getComputedStyle(nodeChild).getPropertyValue('top').slice(0, -2));
        if(Number.isNaN(childTop)){
            childTop=0;
        }
    }
  
    if (node.fakeTransform) {
        transform = node.fakeTransform;
    } else {
        const computedStyle = window.getComputedStyle(node);
        transform =
            computedStyle.getPropertyValue('-webkit-transform') ||
            computedStyle.getPropertyValue('transform');
    } 
  

    let offsetX = 0;
    let offsetY = 0;

    if (transform && transform !== 'none' && typeof transform === 'string') {
        const transformValues = transform
            .split('(')[1]
            .split(')')[0]
            .split(',');
        offsetX = parseInt(transformValues[4], 10);
        offsetY = parseInt(transformValues[5], 10);
    }

    if (direction === 'left') {
        return `translateX(${window.innerWidth}px) translateX(-${rect.left - offsetX}px)`;
    }

    if (direction === 'right') {
        return `translateX(-${rect.left + rect.width - offsetX}px)`;
    }

    if (direction === 'up') {
        return `translateY(${window.innerHeight}px) translateY(-${rect.top - offsetY}px)`;
    } 

    if (direction === 'down') { 
        return `translateY(-${rect.top + rect.height +childTop- offsetY}px)`;
    } 
    // direction === 'down'
   
    return `translateY(-${rect.top + rect.height +childTop - offsetY}px)`;
}



export interface ISlideProps {
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
    orientation?:'top','bottom','left','right'
} 

interface IRef{
    current?:React.ReactNode
}
 
const Fade = React.forwardRef<IRef,ISlideProps>((props,ref)=>{
    
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
        orientation,
        ...other
    }=props;
 
    const childrenRef = useRef(null);
    
    const handleEnter = (node)=>{   

        setTranslateValue(orientation, node); 

        onEnter?.(node);

    };

    const handleEntering = (node) => { 
         
        node.style.webkitTransition=`transform ${timeout && timeout.enter ? timeout.enter : timeout}ms cubic-bezier(0, 0, 0.2, 1) 0ms`;
        node.style.transition=`transform ${timeout && timeout.enter ? timeout.enter : timeout}ms cubic-bezier(0, 0, 0.2, 1) 0ms`;
        node.style.webkitTransform = 'none';
        node.style.transform = 'none';

        onEntering?.(node);
         
    };


    const handleExit = (node)=>{

        node.style.webkitTransition = `transform ${timeout && timeout.exit ? timeout.exit : timeout}ms`;
        node.style.transition = `transform ${timeout && timeout.exit ? timeout.exit : timeout}ms`;

        setTranslateValue(orientation, node);

        onExit?.(node);

    };

    const handleExited=(node)=>{ 
        node.style.webkitTransition="";
        node.style.transition="";
        onExited?.(node)
    }

    useEnhancedEffect(()=>{
        if(!visibleProp){
            if (childrenRef.current) {
                setTranslateValue(orientation, childrenRef.current);
            }
        }
    },[visibleProp])
  
    return (
        <TransitionComponent
            appear
            visible={visibleProp}
            onEnter={handleEnter} 
            onEntering={handleEntering}
            onEntered={onEntered} 
            onExit={handleExit}
            onExited={handleExited} 
            onExiting={onExiting}
            timeout={timeout} 
            ref={ref}
            {...other}
        >
            {
                (status:string,childProps:any[])=>{
                    return React.cloneElement(children,{
                        style:{
                            visibility: status === 'exited' && !visibleProp ? 'hidden' : undefined,
                            ...style,
                            ...children.props.style,
                        },
                      
                        ...childProps
                    })
                }
            }
        </TransitionComponent>
    )

});

export default Fade;