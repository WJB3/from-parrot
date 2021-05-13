/*
 * @Author: xuhansong
 * @Date: 2020-08-28 17:26:47
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-09-18 15:56:17
 * 角色权限
 *
 */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import RoleManagerPage from './RoleManager';
import OrgSettingPage from './OrgSetting';
import PageTab from 'src/components/PageTab';
import PrivateComponent from 'src/components/PrivateComponent';
import PrivateRoute from 'src/components/PrivateRoute';
import RoleSetting from './component/RoleSetting';

export default function RolePage(props: RouteComponentProps) {
  return (
    <PageTab>
      {({ id, pageId, tab }) => (
        <div>
          <PrivateComponent id={64}>{tab === '64' && <OrgSettingPage />}</PrivateComponent>
          <PrivateComponent id={65}>{tab === '65' && <RoleManagerPage />}</PrivateComponent>
        </div>
      )}
    </PageTab>
  );
}
