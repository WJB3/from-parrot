/*
 * @Author: your name
 * @Date: 2021-01-21 17:27:27
 * @LastEditTime: 2021-01-28 11:39:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Transition/index.ts
 */
import Fade from './Fade'
import Grow from './Grow'
import Zoom from './Grow'

export interface IStatusCSSProps{
    opacity?:number
}

export interface ITransitionStatusProps{
    entering?:IStatusCSSProps,
    entered?:IStatusCSSProps,
    exiting?:IStatusCSSProps,
    exited?:IStatusCSSProps,
    unmounted?:IStatusCSSProps,
}

export interface ITransitionTimeoutProps{
    enter?:number,
    exit?:number
}

export {
    Fade,
    Grow,
    Zoom
}
