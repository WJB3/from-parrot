/*
 * @Author: your name
 * @Date: 2021-01-22 18:57:18
 * @LastEditTime: 2021-01-22 19:01:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/hook/useDisableHandler.ts
 */
import React from 'react';
/** 根据disabled 来决定是否进行回调  */
export default function useDisableHandler (callback:Function, disabled:boolean) {
    return React.useCallback((event) => {
        if (!disabled && callback) {
            callback(event)
        }
    }, [callback, disabled]);
}
