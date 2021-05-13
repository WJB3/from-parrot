/*
 * @Author: your name
 * @Date: 2021-01-21 18:08:32
 * @LastEditTime: 2021-01-28 11:40:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/hook/useTransitionComponent.ts
 */
import React, { useMemo } from 'react'
import {
    Fade,
    Grow,
    Zoom
} from '../component/Transition/index'

/** transition过渡的名称 */
export type ITransitionName = boolean | string;

export default function useTransitionComponent (transitionName: ITransitionName) {
    return useMemo(() => {
        let TransitionComponent
        switch (transitionName) {
        case 'fade':
            TransitionComponent = Fade
            break
        case 'grow':
            TransitionComponent = Grow
            break;
        case 'zoom':
            TransitionComponent = Zoom
            break;
        case false:
            TransitionComponent = 'div'
            break;
        default:
            TransitionComponent = Fade
        }
        return TransitionComponent
    }, [transitionName])
}
