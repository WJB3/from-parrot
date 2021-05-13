/*
 * @Author: your name
 * @Date: 2021-01-28 13:24:37
 * @LastEditTime: 2021-01-28 13:28:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/utils/hasFieldValue.ts
 */
import isArray from './isArray';
import isString from './isString';
/**
 * 判断在一个数组 对象 或者字符串内是否有某值
 * @param field 
 * @param container 
 */
export default function hasFieldValue(field:string,container){
    if(isArray(container)){
        return container.indexOf(field)!==-1;
    }else if(isString(container)){
        return container===field;
    }
}