/*
 * @Author: your name
 * @Date: 2021-01-27 09:57:11
 * @LastEditTime: 2021-01-28 18:53:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/hook/useTrigger.ts
 */
import React, { useMemo ,useRef } from 'react'
import createChainedFunction from '../utils/createChainedFunction'
import isArray from '../utils/isArray'
import isString from '../utils/isString' 

export interface notSureEventObj{
    handleMouseOver?:Function, /** 鼠标进入时触发 */
    handleMouseLeave?:Function, /** 鼠标离开时触发 */
    handleTouchStart?:Function,/** 手指触摸时触发 */
    handleTouchEnd?:Function,/** 手指离开时触发 */
    handleFocus?:Function,/** 焦点事件触发时 */
    handleBlur?:Function,/** 焦点离焦事件 */
    handleClick?:Function,/** 点击事件 */
    handleContextMenu?:Function,/** 点击事件 */
}
/**
 * 处理trigger事件的函数
 * @param trigger 传入的事件
 * @param eventHandlerObj 一个空对象
 */
export default function useTrigger (
    trigger,
    /**
     * 传入的事件集合
     */
    eventHandlerObj:notSureEventObj = {},
    childrenProps, 
) {
  
    const handleMoveOver = React.useCallback((event) => {
        /** 移动端忽略mouseover */
        const handler = createChainedFunction(eventHandlerObj.handleMouseOver, childrenProps.onMouseOver)
        handler(event)
    }, [eventHandlerObj.handleMouseOver, childrenProps.onMouseOver])

    const handleMoveLeave = React.useCallback((event) => { 
        const handler = createChainedFunction(eventHandlerObj.handleMouseLeave, childrenProps.onMouseLeave)
        handler(event)
    }, [eventHandlerObj.handleMouseLeave, childrenProps.onMouseLeave])

    const handleTouchStart=React.useCallback((event)=>{ 
        /** ontouchstart在上层中处理 */
        const handler = createChainedFunction(eventHandlerObj.handleTouchStart)
        handler(event)
    },[eventHandlerObj.handleTouchStart]);

    const handleTouchEnd=React.useCallback((event)=>{
        const handler = createChainedFunction(eventHandlerObj.handleTouchEnd, childrenProps.onTouchEnd)
        handler(event)
    },[eventHandlerObj.handleTouchEnd,childrenProps.onTouchEnd]);

    const handleFocus=React.useCallback((event)=>{
        const handler = createChainedFunction(eventHandlerObj.handleFocus, childrenProps.onFocus)
        handler(event)
    },[eventHandlerObj.handleFocus,childrenProps.onFocus])

    const handleBlur=React.useCallback((event)=>{
        const handler = createChainedFunction(eventHandlerObj.handleBlur, childrenProps.onBlur)
        handler(event)
    },[eventHandlerObj.handleBlur,childrenProps.onFocus])

    const handleClick=React.useCallback((event)=>{
        const handler = createChainedFunction(eventHandlerObj.handleClick, childrenProps.onClick)
        handler(event)
    },[eventHandlerObj.handleClick,childrenProps.onClick]);

    const  handleContextMenu=React.useCallback((event)=>{
        /** 阻止默认菜单事件 */
        event.preventDefault();
        const handler = createChainedFunction(eventHandlerObj.handleContextMenu, childrenProps.onContextMenu)
        handler(event)
    },[eventHandlerObj.handleContextMenu,childrenProps.onContextMenu]);

    return useMemo(() => {
        let mapEventHandler = {}
        const mapEvent = {
            hover: { onMouseOver: handleMoveOver, onMouseLeave: handleMoveLeave },
            touch: { onTouchStart:handleTouchStart, onTouchEnd: handleTouchEnd },
            focus: { onFocus:handleFocus, onBlur:handleBlur},
            click: { onClick:handleClick },
            contextMenu:{ onContextMenu:handleContextMenu }
        }
        if (isString(trigger)) {
            mapEventHandler = mapEvent[trigger]
        } else if (isArray(trigger)) {
            trigger.forEach(action => {
                mapEventHandler = { ...mapEventHandler, ...mapEvent[action] }
            })
        }
        return mapEventHandler
    }, [trigger, handleMoveOver, handleMoveLeave])
}
