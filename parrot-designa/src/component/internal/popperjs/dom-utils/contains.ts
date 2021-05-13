/*
 * @Author: your name
 * @Date: 2021-01-26 09:54:48
 * @LastEditTime: 2021-01-26 14:51:39
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/internal/popperjs/dom-utils/contains.ts
 */
// @flow
import { isShadowRoot } from './instanceOf'

export default function contains (parent, child) {
    const rootNode = child.getRootNode && child.getRootNode()

    // First, attempt with faster native method
    if (parent.contains(child)) {
        return true
    } else if (rootNode && isShadowRoot(rootNode)) {
        let next = child
        do {
            if (next && parent.isSameNode(next)) {
                return true
            }
            next = next.parentNode || next.host
        } while (next)
    }

    // Give up, the result is false
    return false
}
