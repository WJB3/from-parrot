/*
 * @Author: your name
 * @Date: 2021-01-26 09:54:48
 * @LastEditTime: 2021-01-26 14:48:34
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/internal/popperjs/dom-utils/getComputedStyle.ts
 */
// @flow
import getWindow from './getWindow'

export default function getComputedStyle (
    element
) {
    return getWindow(element).getComputedStyle(element)
}
