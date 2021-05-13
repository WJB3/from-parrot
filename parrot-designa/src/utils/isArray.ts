/*
 * @Author: your name
 * @Date: 2021-01-27 10:52:44
 * @LastEditTime: 2021-01-27 10:59:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/utils/isArray.ts
 */
/**
 * 判断是否是数组
 * @param arr
 */
export default function isArray (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
}
