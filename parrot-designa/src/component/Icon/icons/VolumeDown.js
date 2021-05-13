/*
 * @Author: your name
 * @Date: 2021-02-18 16:09:32
 * @LastEditTime: 2021-02-18 16:15:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Icon/icons/VolumnMute.js
 */
import React from 'react';
import VolumeDownSvg from '../svg/VolumeDown';

import ParrotIcon from '../components/ParrotIcon';

const VolumeDown=(props,ref)=><ParrotIcon {...props} ref={ref} icon={VolumeDownSvg} />;

export default React.forwardRef(VolumeDown)