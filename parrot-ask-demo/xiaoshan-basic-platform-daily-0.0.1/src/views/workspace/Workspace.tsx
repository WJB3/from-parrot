/*
 * @Author: xuhansong
 * @Date: 2020-08-27 15:44:55
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-10-16 16:39:48
 * 首页
 */
import React, { useRef } from 'react';
import * as style from './style';
import CommonApp from './components/app/Common';
import TeacherCard from './components/TeacherCard';
import NewMessageCard from './components/NewMessage';
import { useGlobalState } from 'src/store';
export default function WorkspacePage() {
  const [state, dispatch] = useGlobalState();
  return (
    <div style={style.container}>
      <p>
        <NewMessageCard></NewMessageCard>
      </p>
      <p>
        <CommonApp />
      </p>
      <div style={{ position: 'relative' }}>
        <img src='https://api.xshs.cn:8688/frontend/xszx/1.png' width='100%' alt='' />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 360,
            height: 390, // 170
            background: '#fff',
          }}>
          {!state.user?.isManager && <TeacherCard></TeacherCard>}
        </div>
      </div>
    </div>
  );
}
