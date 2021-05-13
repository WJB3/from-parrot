/*
 * @Author: your name
 * @Date: 2021-01-22 17:49:33
 * @LastEditTime: 2021-01-22 18:18:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/internal/ButtonBase/hooks/useRippleHandler.ts
 */
/**
 * @description: 触发涟漪的抽象方法
 * @param {*}
 * @return {*}
 */
import React from 'react';

interface rippleProp{
    current?:React.ReactNode
}

export default function useRippleHandler (
    /** 指定触发事件 */
    rippleAction:string,
    /** 指定回调函数 */
    eventCallback:Function,
    /** 涟漪节点 */
    rippleNode:rippleProp,
    /** 指定是否禁用按钮，禁用按钮时无法进行回调 */
    disabled:boolean = false,
    /** 指定是否跳过执行涟漪操作 */
    disableRipple:boolean
) {
    return React.useCallback((event) => {
        /** 默认进行回调 */
        if (eventCallback && !disabled) {
            eventCallback(event);
        }
        /** 如果有涟漪节点 并且 没有禁用涟漪 */
        if (!disabled && !disableRipple && rippleNode) {
            (rippleNode as any).current[rippleAction](event);
        }
    }, [rippleAction, eventCallback, disabled, disableRipple, rippleNode])
}
