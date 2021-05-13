// @flow


export default function rectToClientRect (rect) {
    return {
        ...rect,
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
    }
}
