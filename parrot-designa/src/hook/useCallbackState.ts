/*
 * @Author: your name
 * @Date: 2021-01-20 18:15:26
 * @LastEditTime: 2021-02-18 17:59:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/hook/useStateCallback.ts
 */
import React, { useCallback, useState, useRef } from 'react'
import useEnhancedEffect from './useEnhancedEffect'
/**
 * @description: 改变state后的回调
 * @param {*}
 * @return {*}
 */

export type commonFunc=(...list:any[])=>void;

export type hooksFunc =any[]

export default function useCallbackState (initialState: string|object):hooksFunc {

    const [state, setState] = useState(initialState)

    const callbackFunc = useRef(null)

    const setCallbackState:commonFunc = (nextState:string, next:commonFunc):void => {

        callbackFunc.current = typeof next === 'function' ? next : null

        setState(nextState)

    }

    useEnhancedEffect(() => {

        callbackFunc.current?.(state)

    }, [state])

    return [state, setCallbackState]

}
