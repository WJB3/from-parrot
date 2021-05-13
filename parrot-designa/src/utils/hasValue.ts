/*
 * @Author: your name
 * @Date: 2021-01-25 09:54:23
 * @LastEditTime: 2021-02-18 11:55:26
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/utils/hasValue.ts
 */
/**
 * 判断是否有值
 * @param value
 */

export default function hasValue (value:undefined|null|string|number|boolean) {
    return value !== undefined && value !== null
}
