/*
 * @Author: your name
 * @Date: 2021-01-20 14:46:31
 * @LastEditTime: 2021-02-18 15:56:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/utils/capitalize.ts
 */
/**
 * @description: 试首字母大写
 * @param {*}
 * @return {*}
 */
export default function capitalize (str:string) {
    if(!str){
        return '';
    }
    return str.slice(0, 1).toUpperCase() + str.slice(1)
}
