/*
 * @Author: your name
 * @Date: 2021-01-19 17:36:16
 * @LastEditTime: 2021-01-22 14:12:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/utils/setRef.ts
 */

/**
  * @description: 设置节点的函数
  * @param {*ref} ref回调函数或者一个ref节点
  * @param {*value} value一个节点或者一个值
  * @return {*} 不返回值
  */
import React from 'react'

export interface IRef{
    current:React.ReactNode
}

export default function setRef (ref:IRef|((node:React.ReactNode)=>void), value:React.ReactNode) {

    if (typeof ref === 'function') {
        ref(value)
    /** 避免null赋值 */
    } else if (ref) {
        ref.current = value
    }
}
