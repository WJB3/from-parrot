/*
 * @Author: your name
 * @Date: 2021-02-18 11:44:49
 * @LastEditTime: 2021-02-18 17:39:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/AlertBar/index.ts
 */
import {
    IBaseProps
} from '../internal/config/types';

export interface IAlertBarProps extends IBaseProps{ 
    round?:boolean,//是否是椭圆,
    color?:string,//alert类型
    type?:string,//alert类型
    icon?:any,//覆盖默认的icon图标
    scrollable?:boolean,//是否可滚动
    wrapable?:boolean,//是否可换行
    delay?:number,//滚动延时
    speed?:number,//滚动速度
}

export {
    default
} from './AlertBar';