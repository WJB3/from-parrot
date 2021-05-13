/**
 * 根据step计算出value值
 * @param value 
 * @param step 
 * @param min 
 */
export default function roundValueToStep(value,step,min){
    const nearest=Math.round((value-min)/step)*step+min;
    return Number(nearest);
}