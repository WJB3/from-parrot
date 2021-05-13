/*
 * @Author: your name
 * @Date: 2021-01-27 09:51:07
 * @LastEditTime: 2021-02-18 18:06:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/App.tsx
 */

import React, { useState, useRef } from 'react'
import Copy from './component/Copy/index';
import Paper from './component/Paper/index';
import AlertBar from './component/AlertBar/index';
import {
  VolumeUp
} from './component/Icon/index';

const Example = () => {
 
  return (
    <> 
        <AlertBar icon={VolumeUp} >
          {"在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"}
        </AlertBar> 
        {/* <AlertBar color="danger" >
          {"在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"}
        </AlertBar> 
        <AlertBar color="info" >
          {"在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"}
        </AlertBar> 
        <AlertBar color="success" >
          {"在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"}
        </AlertBar> 
        <AlertBar  type='outline'>
          {"在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"}
        </AlertBar> 
        <AlertBar color="danger" type='outline'>
          {"在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"}
        </AlertBar> 
        <AlertBar color="info" type='outline'>
          {"在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"}
        </AlertBar> 
        <AlertBar color="success" type='outline'>
          {"在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"}
        </AlertBar>  */}
    </>
  )
}

export default Example
