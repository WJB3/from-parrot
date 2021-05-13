/**
 * 百分比转化为value值
 * @param percent 
 * @param min 
 * @param max 
 */
export default function percentToValue(percent,min,max){
    return (max - min) * percent + min;
}