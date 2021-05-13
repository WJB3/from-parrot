
import getVariation from './getVariation'
import {
    variationPlacements,
    basePlacements,
    placements as allPlacements
} from '../enums'
import detectOverflow from './detectOverflow'
import getBasePlacement from './getBasePlacement'


/*:: type OverflowsMap = { [ComputedPlacement]: number }; */
/* ;; type OverflowsMap = { [key in ComputedPlacement]: number }; */

export default function computeAutoPlacement (
    state,
    options
) {
    const {
        placement,
        boundary,
        rootBoundary,
        padding,
        flipVariations,
        allowedAutoPlacements = allPlacements
    } = options

    const variation = getVariation(placement)

    const placements = variation
        ? flipVariations
            ? variationPlacements
            : variationPlacements.filter(
                (placement) => getVariation(placement) === variation
            )
        : basePlacements

    let allowedPlacements = placements.filter(
        (placement) => allowedAutoPlacements.indexOf(placement) >= 0
    )

    if (allowedPlacements.length === 0) {
        allowedPlacements = placements


    }

    // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...
    const overflows = allowedPlacements.reduce((acc, placement) => {
        acc[placement] = detectOverflow(state, {
            placement,
            boundary,
            rootBoundary,
            padding
        })[getBasePlacement(placement)]

        return acc
    }, {})

    return Object.keys(overflows).sort((a, b) => overflows[a] - overflows[b])
}
