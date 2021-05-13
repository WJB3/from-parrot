import React from 'react';
import useControlled from '../../../hook/useControlled';
import asc from '../../../utils/asc';
import clampBetween from '../../../utils/clampBetween';

export interface rangeProps {
    value?: any,
    defaultValue?: any,
    min?: number,
    max?: number
}

export default function useRange({ value: valueProp, defaultValue, min, max }:rangeProps) {

    const [valueDerived, setValueState] = useControlled({
        controlled: valueProp,
        default: defaultValue ?? min
    });

    /** 如果是数组则存在多thumb */
    const range = Array.isArray(valueDerived);
    let value = range ? valueDerived.slice().sort(asc) : [valueDerived];
    value = value.map((value) => clampBetween(value, min, max));

    return React.useMemo(()=>{
        return [ value,setValueState,range,valueDerived ]
    },[valueProp,defaultValue,min,max,valueDerived,setValueState]); 

}