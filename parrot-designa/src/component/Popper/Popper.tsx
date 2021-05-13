/*
 * @Author: your name
 * @Date: 2021-01-26 09:54:48
 * @LastEditTime: 2021-01-29 18:27:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Popper/Popper.tsx
 */
import React ,{useState,useRef} from 'react';
import Portal from '../Portal/index';
import Paper from '../Paper/index';
import { placements } from '../internal/config/types';
import { createPopper } from '../internal/popperjs/index'
import useForkRef from '../../hook/useForkRef';
import useUnmount from '../../hook/useUnmount';
import useEnhancedEffect from '../../hook/useEnhancedEffect';


type FunctionAndNode =Function | React.ReactElement;

type placementTypes=typeof placements[number];

export interface PopperProps{
    disablePortal?:boolean,/** 禁用portal,使其保持在父组件上 */
    container?:FunctionAndNode, /** popper的容器，默认是document.body */
    target?:FunctionAndNode,/** popper的挂载目标 */
    transition?:boolean,/** 是否有过渡动画 */
    orientation?:placementTypes,/** 方位 */
    visible?:boolean,/** popper是否显示 */
    modifiers?:Array<any>,/** popper额外修饰符 */
    popperOptions?:Object,/** popper额外属性 */
    keepMounted?:boolean,/** 是否一直挂载到节点上 */
    className?:string,/** className */
    children?:any,
    disablePreventOverflow?:boolean,/** 是否禁止自动preventOverflow */
    disableFlip?:boolean,/** 是否禁止翻转 */ 
    arrowRef?:React.ReactNode,/** 箭头节点 */
    ref?:any
}

function getTarget(target:FunctionAndNode){
    return typeof target==='function'?target():target;
}

const defaultPopperOptions={}

const Popper=React.forwardRef<any,PopperProps>((props,ref)=>{

    const {
        disablePortal,
        container,
        target,
        transition=false,
        children,
        orientation:initialOrientation='bottom',
        visible=false,
        modifiers,
        popperOptions =defaultPopperOptions ,
        keepMounted=false,
        disablePreventOverflow=false,
        disableFlip=false, 
        arrowRef,
        ...other
    }=props; 

    const popperRef=useRef(null);

    const popperjsRef=useRef(null);

    /** 为了使过渡动画结束后才卸载节点 */
    const [exited, setExited] = React.useState(true);

    const [orientation,setOrientation]=useState(initialOrientation);

    useEnhancedEffect(() => {  
        /** 用以更新位置 */
        if (popperjsRef.current) {
            popperjsRef.current.forceUpdate();
        }
    });

    const handleShow=React.useCallback(
        ()=>{   
            if(!popperRef.current || !target || !visible){ 
                return ;
            } 
            if(popperjsRef.current){
                popperjsRef.current.destroy();
                popperjsRef.current=null;
            }
            
            const handlePopperUpdate = (data) => {   
                /** 当位置在界面无法相容，会触发此方法给予正确的方位 */
                setOrientation(data.placement);
            };
          
            let popperModifiers=[  
                {
                    name: 'preventOverflow',
                    enabled:!disablePreventOverflow,
                    options: {
                        mainAxis: false, // true by default  
                        
                    },
                },
                {
                    name: 'flip',
                    enabled:!disableFlip,
                    options: {   
                        allowedAutoPlacements: ['top', 'bottom','left','right'],
                        fallbackPlacements: ['right'],
                    },
                }, 
                {
                    name: 'onUpdate',
                    enabled: true,
                    phase: 'afterWrite',
                    fn: ({ state }) => {
                      handlePopperUpdate(state);
                    },
                }, 
                arrowRef && {
                    name: 'arrow',
                    options:{
                        element: arrowRef,
                        padding: 6
                    }
                }
            ].filter(Boolean);

            if(modifiers!=null){
                popperModifiers=popperModifiers.concat(modifiers);
            }

            if (popperOptions && (popperOptions as any).modifiers != null) {
                popperModifiers = popperModifiers.concat((popperOptions as any).modifiers);
            } 

            const popper=createPopper(getTarget(target),popperRef.current,{
                placement:initialOrientation,
                ...popperOptions,
                modifiers:popperModifiers
            }) 

            popperjsRef.current=popper;

        },[popperRef,initialOrientation,modifiers,popperOptions,target,visible,arrowRef,disablePreventOverflow,disableFlip]
    )

    const handleRef=useForkRef(popperRef,handleShow,ref); 
    
    const handleEnter = () => {
        setExited(false);
    };

    useUnmount(()=>{
        handleClose();
    })

    const handleClose = () => {
        if (!popperRef.current) {
          return;
        }
     
        popperjsRef.current=null;
    };

    const handleExited = () => { 
        setExited(true);
        handleClose();
    };
 
    /** 当visible为false 且keepMounted为false时 */
    if(!keepMounted && !visible && (!transition || exited)){
        return null;
    }

    const childProps= { orientation };

    if(transition){
        (childProps as any).TransitionProps={
            visible:visible,
            onEnter:handleEnter,
            onExited:handleExited
        }
    } 

    return (
        <Portal disablePortal={disablePortal} container={container}>
            <Paper 
                id='parrot-popper'
                role='popper'
                ref={handleRef}
                deep={0}
                transparent
                inline
                {...other}
            >
                {typeof children === 'function' ? children(childProps) : children}
            </Paper>
        </Portal>
    )


}) as React.FC<PopperProps>;

export default React.memo(Popper);