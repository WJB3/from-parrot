/*
 * @Author: your name
 * @Date: 2021-02-01 09:43:15
 * @LastEditTime: 2021-02-01 16:23:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Slider/utils/findClosest.ts
 */
/**
 * 寻找最近的点
 * @param values 
 * @param currentValue 
 */
export default function findClosest(values,currentValue){
    const { index:closestIndex }=values.reduce((acc,value,index)=>{
        const distance=Math.abs(currentValue-value);

        if(acc===null || distance<acc.distance || distance===acc.distance){
            return {
                distance,
                index
            }
        }
        return acc;
    },null);
    return closestIndex;
}
 