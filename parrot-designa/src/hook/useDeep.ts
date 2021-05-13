
/**
 * 获得真实深度
 * params incomingDeep 外部传入的deep属性 internalDeep 内部的deep属性
 */
import React from 'react';

export default function useDeep (incomingDeep:number|undefined, internalDeep:number|undefined, disabled:boolean|undefined) {
    return React.useMemo(() => {
        /** 外部传入的deep优先级最高 */
        if (disabled) {
            return 0;
        }
        if (incomingDeep) {
            return incomingDeep;
        }
        return internalDeep;
    }, [incomingDeep, internalDeep]);
}
