/*
 * @Author: xuhansong
 * @Date: 2020-08-31 16:57:08
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-10-16 09:54:04
 * 基础设置应用
 */
import React from 'react';
import PrivateRoute from 'src/components/PrivateRoute';
import { Switch } from 'react-router-dom';
import PlatformParamsPage from './params';
import PlatformDictionaryPage from './params/Dictionary';
import SemesterPage from './semester';
import OperateLogPage from './operateLog';
import SchoolCalendarPage from './calendar';
import SchoolLogoPage from './logo';
import SchedulePage from './schedule';
import CreateSchedulePage from './schedule/CreateSchedule';
import SemesterCalendar from './semester/Calendar';
import CheckSchedulePage from './schedule/CheckSchedule';
import EditSchedulePage from './schedule/EditSchedule';
import PlatformPage from './platform/index';

export default function BasicSettingApp() {
  return (
    <Switch>
      <PrivateRoute id={3} path='/app/2/3' exact component={SchoolLogoPage}></PrivateRoute>
      <PrivateRoute id={4} path='/app/2/4' exact component={SchoolCalendarPage}></PrivateRoute>
      <PrivateRoute id={5} path='/app/2/5' exact component={SchedulePage}></PrivateRoute>
      <PrivateRoute id={7} path='/app/2/370' exact component={PlatformPage}></PrivateRoute>
      <PrivateRoute id={6} path='/app/2/6' exact component={PlatformParamsPage}></PrivateRoute>
      <PrivateRoute id={7} path='/app/2/7' exact component={OperateLogPage}></PrivateRoute>
      <PrivateRoute id={150} path='/app/2/150' exact component={SemesterPage}></PrivateRoute>
      {/* 学年校历查看 */}
      <PrivateRoute
        id={281}
        path='/app/2/150/calendar/:semesterId'
        exact
        component={SemesterCalendar}></PrivateRoute>
      {/* 字典编码详情 */}
      <PrivateRoute
        id={6}
        path='/app/2/6/dictionary/:dicCode'
        exact
        component={PlatformDictionaryPage}></PrivateRoute>
      {/* 作息时间 */}
      <PrivateRoute
        id={[291, 295]}
        path='/app/2/5/schedule/create'
        exact
        component={CreateSchedulePage}></PrivateRoute>
      {/* 预览 */}
      <PrivateRoute
        id={293}
        path='/app/2/5/schedule/:id'
        exact
        component={CheckSchedulePage}></PrivateRoute>
      <PrivateRoute
        id={294}
        path='/app/2/5/schedule/:id/edit'
        exact
        component={EditSchedulePage}></PrivateRoute>
    </Switch>
  );
}
