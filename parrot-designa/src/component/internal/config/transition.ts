/*
 * @Author: your name
 * @Date: 2021-01-21 17:05:28
 * @LastEditTime: 2021-01-21 17:08:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/internal/config/transition.ts
 */

export interface IDurationProps{
    enteringScreen?:number,
    leavingScreen?:number,
    standard?:number
}

const duration:IDurationProps = {
    enteringScreen: 225,
    leavingScreen: 195,
    standard: 300
}

export {
    duration
}
