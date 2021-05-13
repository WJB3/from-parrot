/*
 * @Author: xuhansong
 * @Date: 2020-08-27 15:42:21
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-09-17 11:40:27
 *
 */
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { HashRouter, Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import './App.less';
import Login from './views/login/Login';
import Layout from './views/common/Layout';
import { useGlobalState } from './store';
import ActiveAccountPage from './views/common/ActiveAccount';
import ForgetPasswordPage from './views/common/ForgetPassword';
import SelectMemberModal, {tabType} from './components/selectMember';
import GuideTeacherModal from 'src/views/app/reportInfo/studentReport/component/GuideTeachers'
import GT from 'types';

function App() {
  const [state] = useGlobalState();
  // const modal = useRef<GT.Modal.Ref>();
  // const teacherModal = useRef<GT.Modal.Ref>();
  // const [tabType, setTabType] = useState<tabType[]>()
  // const [teachers, setTeachers] = useState<GT.Model.Teacher[]>()

  // useEffect(() => {
  //   window.addEventListener(
  //     'message',
  //     (event) => {
  //       console.log(event, '收到打开弹窗的消息');
  //       if (event.data.type === 'selectMemberModal:init') {
  //         // 获取参数
  //         if (event.data.params.tabType === 'organization') {
  //           setTabType(['organization']);
  //         }
  //         modal.current?.setVisible(true);
  //       } else if (event.data.type === 'teacherModalList:init') {
  //         // 收到打开列表的消息
  //         teacherModal.current?.setTitle('新增教师');
  //         const choose = event.data.teachers;
  //         setTeachers(choose);
  //         teacherModal.current?.setTeachers(choose);
  //         teacherModal.current?.setVisible(true);
  //       }
  //     },
  //     false,
  //   );
  // }, []);

  const propsChange = useMemo(() => {
    return (
      <HashRouter>
        <Switch>
          <Route path={'/login'} component={Login} />
          <Route path={'/account/password/forget'} component={ForgetPasswordPage}></Route>
          {/* 判断是否存在token，没有则跳转到登录页面 */}
          {!state.token && <Redirect to='/login' />}
          <Route path={'/account/active'} component={ActiveAccountPage}></Route>
          <Route component={Layout} />
        </Switch>
      </HashRouter>

    )
  }, [state.token]);

  return (
    <div className='App'>
      {/* <iframe
        id='iframe'
        src='http://127.0.0.1:3001/test.html'
        style={{ position: 'fixed', zIndex: 12312312 }}></iframe> */}
      <HashRouter>
        <Switch>
          <Route path={'/login'} component={Login} />
          <Route path={'/account/password/forget'} component={ForgetPasswordPage}></Route>
          {/* 判断是否存在token，没有则跳转到登录页面 */}
          {!state.token && <Redirect to='/login' />}
          <Route path={'/account/active'} component={ActiveAccountPage}></Route>
          <Route component={Layout} />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
