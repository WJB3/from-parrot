/**
 * 获得更新的nextRef
 */

import React, { useRef } from 'react';
import hasValue from '../utils/hasValue';

const globalKeyMap = new Map([])

/** 得到更新的key */
export default function useNextKey (onlyName:string) {

    return React.useCallback(() => {

        let current:number = globalKeyMap.get(onlyName);
        /** 如果存在key */
        if (hasValue(current)) {
            return current++;
        } else {
            globalKeyMap.set(onlyName, 0);
            return current++;
        }
    }, [globalKeyMap, onlyName]);

}
