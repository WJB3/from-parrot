/*
 * @Author: your name
 * @Date: 2021-02-01 09:43:15
 * @LastEditTime: 2021-02-01 15:15:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/hook/useFingerOrMousePosition.ts
 */
import React from 'react';
/**
 * 如果是mouse事件获取event.clientX、Y 如果是触摸事件，获取touch
 * @param event 
 * @param touchId 
 */
export default function useFingerOrMousePosition(event,touchId){
 
    /** 有touchId说明先触发的touch事件再触发mousedown事件 说明是移动端  */
    /** 这个 TouchList 对象列出了和这个触摸事件对应的 Touch 对象。 */
    if(touchId.current!==undefined && event.changedTouches){
        for(let i=0;i<event.changedTouches.length;i+=1){
            const touch=event.changedTouches[i];
            /** 返回一个可以唯一地识别和触摸平面接触的点的值. 这个值在这根手指（或触摸笔等）所引发的所有事件中保持一致, 直到它离开触摸平面. */
            if(touch.identifier===touchId.current){
                return {
                    /**  它提供事件发生时的应用客户端区域的水平坐标  */
                    x:touch.clientX,
                    y:touch.clientY
                }
            }
        }
        return false;
    }

    return {
        x:event.clientX,
        y:event.clientY
    }
}