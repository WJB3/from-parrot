/*
 * @Author: xuhansong
 * @Date: 2020-08-27 15:39:00
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-09-19 20:32:11
 * 基础数据应用
 *
 */

import React from 'react';
import { Switch, RouteComponentProps } from 'react-router-dom';
import TeacherPage from './teacher';
import StudentPage from './student';
import PrivateRoute from 'src/components/PrivateRoute';
import ParentPage from './parent';
import ArchitecturalspacePage from './architecturalspace';
import FacePage from './face';
import GroupPage from './group';
import Service from './service';
export default function BaseDataApp(props: RouteComponentProps) {
  return (
    <Switch>
      <PrivateRoute id={9} path={'/app/8/9'} exact component={TeacherPage}></PrivateRoute>
      <PrivateRoute id={314} path={'/app/8/314'} exact component={Service}></PrivateRoute>
      <PrivateRoute id={10} path={'/app/8/10'} exact component={StudentPage}></PrivateRoute>
      <PrivateRoute id={11} path={'/app/8/11'} exact component={GroupPage}></PrivateRoute>
      <PrivateRoute id={12} path={'/app/8/12'} exact component={FacePage}></PrivateRoute>
      <PrivateRoute
        id={13}
        path={'/app/8/13'}
        exact
        component={ArchitecturalspacePage}></PrivateRoute>
      <PrivateRoute id={123} path={'/app/8/123'} exact component={ParentPage}></PrivateRoute>
    </Switch>
  );
}
