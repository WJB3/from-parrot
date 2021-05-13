/*
 * @Author: your name
 * @Date: 2021-02-18 16:09:32
 * @LastEditTime: 2021-02-18 16:16:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/demo/parrot-design/src/component/Icon/icons/VolumnMute.js
 */
import React from 'react';
import VolumeUpSvg from '../svg/VolumeUp';

import ParrotIcon from '../components/ParrotIcon';

const VolumeUp=(props,ref)=><ParrotIcon {...props} ref={ref} icon={VolumeUpSvg} />;

export default React.forwardRef(VolumeUp)