/*
 * @Author: xuhansong
 * @Date: 2020-08-28 12:02:42
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-10-19 13:55:07
 * 权限设置应用
 *
 */

import React from 'react';
import { RouteComponentProps, Switch } from 'react-router-dom';
import PermissionTree from './PermissionTree';
import RolePage from './role';
import PrivateRoute from 'src/components/PrivateRoute';
import UserPage from './user';
import RoleSetting from './role/component/RoleSetting';

export default function PermissionApp(props: RouteComponentProps) {
  return (
    <Switch>
      <PrivateRoute id={75} path='/app/14/75' exact component={PermissionTree}></PrivateRoute>
      <PrivateRoute id={15} path='/app/14/15' exact component={UserPage}></PrivateRoute>
      <PrivateRoute id={16} path='/app/14/16' exact component={RolePage}></PrivateRoute>

      <PrivateRoute
        id={16}
        path='/app/14/16/role/:roleId/check'
        exact
        render={(props) => {
          return <RoleSetting {...props} roleId={props.match.params.roleId} editable={false} />;
        }}></PrivateRoute>
      <PrivateRoute
        id={16}
        path='/app/14/16/role/:roleId/edit'
        exact
        render={(props) => (
          <RoleSetting {...props} roleId={props.match.params.roleId} />
        )}></PrivateRoute>
    </Switch>
  );
}
