/*
 * @Author: your name
 * @Date: 2021-01-26 09:54:48
 * @LastEditTime: 2021-01-26 14:47:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/internal/popperjs/dom-utils/instanceOf.ts
 */
// @flow
import getWindow from './getWindow'

/*:: declare function isElement(node: mixed) %checks(node instanceof
  Element); */

function isElement (node) {
    const OwnElement = getWindow(node).Element
    return node instanceof OwnElement
}

/*:: declare function isHTMLElement(node: mixed) %checks(node instanceof
  HTMLElement); */

function isHTMLElement (node) {
    const OwnElement = getWindow(node).HTMLElement
    return node instanceof OwnElement
}

/*:: declare function isShadowRoot(node: mixed) %checks(node instanceof
  ShadowRoot); */

function isShadowRoot (node) {
    const OwnElement = getWindow(node).ShadowRoot
    return node instanceof OwnElement
}

export { isElement, isHTMLElement, isShadowRoot }
