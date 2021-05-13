/*
 * @Author: your name
 * @Date: 2021-01-29 09:59:28
 * @LastEditTime: 2021-01-29 09:59:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/utils/ownerDocument.ts
 */
export default function ownerDocument(node){
    return (node && node.ownerDocument)||document;
}