/*
 * @Author: your name
 * @Date: 2021-02-01 09:43:15
 * @LastEditTime: 2021-02-01 10:32:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Slider/index.ts
 */

import {
    IBaseProps,
    IFormBaseProps
} from '../internal/config/types';

export interface ICopyProps extends IBaseProps,IFormBaseProps{
    text?:string,/** 需要复制的文字 */
    children?:any,
    onCopy?:Function,/** copy成功的回调 */
}
 
export {
    default
} from './Copy';