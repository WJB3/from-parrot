/*
 * @Author: your name
 * @Date: 2021-01-29 10:09:27
 * @LastEditTime: 2021-01-29 10:11:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/utils/mapEventPropToEvent.ts
 */
/**
 * 将prop event属性转化为原生event属性
 * @param eventProp 
 */
export default function mapEventPropToEvent(eventProp){
    return eventProp.substring(2).toLowerCase()
}