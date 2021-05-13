/*
 * @Author: your name
 * @Date: 2021-01-26 09:54:48
 * @LastEditTime: 2021-01-26 14:38:03
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/internal/popperjs/modifiers/offset.ts
 */

import getBasePlacement from '../utils/getBasePlacement'
import { top, left, right, placements } from '../enums'


export function distanceAndSkiddingToXY (
    placement,
    rects,
    offset
) {
    const basePlacement = getBasePlacement(placement)
    const invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1

    let [skidding, distance] =
    typeof offset === 'function'
        ? offset({
            ...rects,
            placement
        })
        : offset

    skidding = skidding || 0
    distance = (distance || 0) * invertDistance

    return [left, right].indexOf(basePlacement) >= 0
        ? { x: distance, y: skidding }
        : { x: skidding, y: distance }
}

function offset ({ state, options, name }) {
    const { offset = [0, 0] } = options

    const data = placements.reduce((acc, placement) => {
        acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset)
        return acc
    }, {})

    const { x, y } = data[state.placement]

    if (state.modifiersData.popperOffsets != null) {
        state.modifiersData.popperOffsets.x += x
        state.modifiersData.popperOffsets.y += y
    }

    state.modifiersData[name] = data
}

export default ({
    name: 'offset',
    enabled: true,
    phase: 'main',
    requires: ['popperOffsets'],
    fn: offset
})
