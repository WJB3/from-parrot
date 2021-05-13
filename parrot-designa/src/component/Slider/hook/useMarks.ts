/*
 * @Author: your name
 * @Date: 2021-02-01 09:43:15
 * @LastEditTime: 2021-02-01 16:05:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Slider/hook/useMarks.ts
 */
import { useMemo } from "react";


/**
 * 通过一系列属性得出marks值
 */
export default function useMarks({marksProp,step,max,min}){
    return useMemo(()=>{
      
        const marks=marksProp===true && step!==null
        ?[...Array(Math.floor((max-min)/step)+1)].map(
            (_,index)=>({
                value:min+step*index
            })
        ):marksProp||[]; 

        const marked=marks.length>0&&marks.some((mark)=>marks.label);

        return [marks,marked];
        
    },[marksProp,step,min,max])
}