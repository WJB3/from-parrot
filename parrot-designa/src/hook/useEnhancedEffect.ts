/*
 * @Author: your name
 * @Date: 2021-01-20 12:46:31
 * @LastEditTime: 2021-01-20 12:49:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/hook/useEnhancedEffect.ts
 */
/**
 * @description:
 * @param {*}
 * @return {*}
 */
import React from 'react'

// 在ssr渲染中 使用useLayoutEffect可能会产生问题
const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

export default useEnhancedEffect
