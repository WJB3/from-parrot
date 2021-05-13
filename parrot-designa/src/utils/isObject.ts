import { isObject } from "lodash";

/*
 * @Author: your name
 * @Date: 2021-01-27 10:59:11
 * @LastEditTime: 2021-01-27 11:00:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/utils/isObject.ts
 */
export default function isObject(obj){
    return Object.prototype.toString.call(obj)==='[object Object]';
}