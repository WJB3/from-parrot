

export default function getMainAxisFromPlacement (
    placement
): 'x' | 'y' {
    return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y'
}
