/*
 * @Author: your name
 * @Date: 2021-02-01 09:43:15
 * @LastEditTime: 2021-02-01 16:08:57
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Slider/hook/useOffset.ts
 */
import React from 'react';
import valueToPercent from '../utils/valueToPercent';

/**
 * 根据方向等获取轨道style thumbstyle等
 * @param range 
 * @param values 
 * @param min 
 * @param max 
 */
const orientationProps={
    horizontal:{
        offset:(percent)=>({left:`${percent}%`}),
        leap:(percent)=>({width:`${percent}%`})
    },
    vertical:{
        offset:(percent)=>({bottom:`${percent}%`}),
        leap:(percent)=>({height:`${percent}%`})
    }
}

export default function useOffset(values,min,max,orientation){ 

    return React.useMemo(()=>{
        const trackOffset = valueToPercent(min, min, max);
        const trackLeap = valueToPercent(values[values.length - 1], min, max) - trackOffset;
        const trackStyle = {
            ...orientationProps[orientation].offset(trackOffset),
            ...orientationProps[orientation].leap(trackLeap),
        };

        return [trackStyle,orientationProps]

    },[values,min,max,orientation,orientationProps])
}

export {
    orientationProps
}