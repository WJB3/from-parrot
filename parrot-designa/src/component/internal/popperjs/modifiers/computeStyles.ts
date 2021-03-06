// @flow

import { top, left, right, bottom } from '../enums'
import getOffsetParent from '../dom-utils/getOffsetParent'
import getWindow from '../dom-utils/getWindow'
import getDocumentElement from '../dom-utils/getDocumentElement'
import getBasePlacement from '../utils/getBasePlacement'


const unsetSides = {
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto'
}

// Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.
function roundOffsetsByDPR ({ x, y }) {
    const win = window
    const dpr = win.devicePixelRatio || 1

    return {
        x: Math.round(x * dpr) / dpr || 0,
        y: Math.round(y * dpr) / dpr || 0
    }
}

export function mapToStyles ({
    popper,
    popperRect,
    placement,
    offsets,
    position,
    gpuAcceleration,
    adaptive,
    roundOffsets
}) {
    let { x = 0, y = 0 } = roundOffsets ? roundOffsetsByDPR(offsets) : offsets

    const hasX = offsets.hasOwnProperty('x')
    const hasY = offsets.hasOwnProperty('y')

    let sideX = left
    let sideY = top

    const win = window

    if (adaptive) {
        let offsetParent = getOffsetParent(popper)
        if (offsetParent === getWindow(popper)) {
            offsetParent = getDocumentElement(popper)
        }

        // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it
        /*:: offsetParent = (offsetParent); */

        if (placement === top) {
            sideY = bottom
            y -= offsetParent.clientHeight - popperRect.height
            y *= gpuAcceleration ? 1 : -1
        }

        if (placement === left) {
            sideX = right
            x -= offsetParent.clientWidth - popperRect.width
            x *= gpuAcceleration ? 1 : -1
        }
    }

    const commonStyles = {
        position,
        ...(adaptive && unsetSides)
    }

    if (gpuAcceleration) {
        return {
            ...commonStyles,
            [sideY]: hasY ? '0' : '',
            [sideX]: hasX ? '0' : '',
            // Layer acceleration can disable subpixel rendering which causes slightly
            // blurry text on low PPI displays, so we want to use 2D transforms
            // instead
            transform:
        (win.devicePixelRatio || 1) < 2
            ? `translate(${x}px, ${y}px)`
            : `translate3d(${x}px, ${y}px, 0)`
        }
    }

    return {
        ...commonStyles,
        [sideY]: hasY ? `${y}px` : '',
        [sideX]: hasX ? `${x}px` : '',
        transform: ''
    }
}

function computeStyles ({ state, options }) {
    const {
        gpuAcceleration = true,
        adaptive = true,
        roundOffsets = true
    } = options

    if (false) {

    }

    const commonStyles = {
        placement: getBasePlacement(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration
    }

    if (state.modifiersData.popperOffsets != null) {
        state.styles.popper = {
            ...state.styles.popper,
            ...mapToStyles({
                ...commonStyles,
                offsets: state.modifiersData.popperOffsets,
                position: state.options.strategy,
                adaptive,
                roundOffsets
            })
        }
    }

    if (state.modifiersData.arrow != null) {
        state.styles.arrow = {
            ...state.styles.arrow,
            ...mapToStyles({
                ...commonStyles,
                offsets: state.modifiersData.arrow,
                position: 'absolute',
                adaptive: false,
                roundOffsets
            })
        }
    }

    state.attributes.popper = {
        ...state.attributes.popper,
        'data-popper-placement': state.placement
    }
}

export default ({
    name: 'computeStyles',
    enabled: true,
    phase: 'beforeWrite',
    fn: computeStyles,
    data: {}
})
