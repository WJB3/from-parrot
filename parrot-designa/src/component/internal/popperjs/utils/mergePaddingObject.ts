// @flow

import getFreshSideObject from './getFreshSideObject'

export default function mergePaddingObject (
    paddingObject
) {
    return {
        ...getFreshSideObject(),
        ...paddingObject
    }
}
