/*
 * @Author: your name
 * @Date: 2021-02-18 17:27:28
 * @LastEditTime: 2021-02-18 17:33:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/hook/useRect.ts
 */
import React from 'react';

function isWindow(val: unknown){
  return val === window
}

export default function useRect(
    elementRef
){
 
        const element=elementRef?.current;

        if(isWindow(elementRef)){
            const width = element.innerWidth
            const height = element.innerHeight

            return {
                top: 0,
                left: 0,
                right: width,
                bottom: height,
                width,
                height,
            }
            
        }

        if (element && element.getBoundingClientRect) {
            return element.getBoundingClientRect();
        }
        
        return {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
        }
       
}