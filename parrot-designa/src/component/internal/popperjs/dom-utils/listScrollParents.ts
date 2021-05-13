/*
 * @Author: your name
 * @Date: 2021-01-26 09:54:48
 * @LastEditTime: 2021-01-26 14:46:54
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/internal/popperjs/dom-utils/listScrollParents.ts
 */
// @flow
import getScrollParent from './getScrollParent'
import getParentNode from './getParentNode'
import getNodeName from './getNodeName'
import getWindow from './getWindow'
import isScrollParent from './isScrollParent'

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/
export default function listScrollParents (
    element,
    list = []
) {
    const scrollParent = getScrollParent(element)
    const isBody = getNodeName(scrollParent) === 'body'
    const win = getWindow(scrollParent)
    const target = isBody
        ? [win].concat(
            win.visualViewport || [],
            isScrollParent(scrollParent) ? scrollParent : []
        )
        : scrollParent
    const updatedList = list.concat(target)

    return isBody
        ? updatedList
        : updatedList.concat(listScrollParents(getParentNode(target)))
}
