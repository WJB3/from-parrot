/*
 * @Author: your name
 * @Date: 2021-01-19 17:33:22
 * @LastEditTime: 2021-01-28 20:27:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/hook/useForkRef.ts
 */

/**
  * @description:
  * @param {*}
  * @return {*}
  */
import React from 'react'
import setRef, { IRef } from '../utils/setRef'

/** 同时修改多个ref */
export default function useForkRef (...refs:any[]) {

    return React.useMemo(() => {
        if (refs.every(item => item === null)) {
            return null
        }
        return (refValue:IRef) => {
            for (let i = 0; i < refs.length; i++) {
                setRef(refs[i], refValue)
            }
        }
    }, [...refs])
}
