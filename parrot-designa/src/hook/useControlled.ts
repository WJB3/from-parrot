/*
 * @Author: your name
 * @Date: 2021-01-26 16:37:50
 * @LastEditTime: 2021-01-26 16:53:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/hook/useControlled.ts
 */
import React, { useState } from 'react'
import hasValue from '../utils/hasValue'

export default function useControlled ({ controlled: controlledProp, default: defaultValue }) {

    const controlled = hasValue(controlledProp)

    const [stateValue, setStateValue] = useState(defaultValue)

    const value = controlled ? controlledProp : stateValue

    const setValueIfNotControlled = React.useCallback((newValue) => {
        if (!controlled) {
            setStateValue(newValue)
        }
    }, [value, controlled])

    return [value, setValueIfNotControlled]

}
