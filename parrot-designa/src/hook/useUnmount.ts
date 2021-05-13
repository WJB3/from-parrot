/*
 * @Author: your name
 * @Date: 2021-01-26 14:30:59
 * @LastEditTime: 2021-01-29 09:56:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/hook/useUnmount.ts
 */

/**
 * 模仿class组件的卸载方法
 */
import React from 'react'
import useEnhancedEffect from '../hook/useEnhancedEffect'

export default function useUnmount (func) {
    useEnhancedEffect(() => {
        return () => {
            func()
        }
    }, [])
}
