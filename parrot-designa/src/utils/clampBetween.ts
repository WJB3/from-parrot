
/**
 * 根据最大值最小值得出最佳的区间值
 * @param value 
 * @param min 
 * @param max 
 */
import hasValue from './hasValue';
export default function clampBetween(value,min,max){
    if(!hasValue(value)){
        return min;
    }
    return Math.min(Math.max(min,value),max);
}