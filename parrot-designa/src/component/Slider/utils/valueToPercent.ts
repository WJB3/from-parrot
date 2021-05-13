/**
 * 根据max和min将value转化为百分比
 */

 export default function valueToPercent(value,min,max){
    return ((value - min) * 100) / (max - min);
 }