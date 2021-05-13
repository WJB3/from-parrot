/*
 * @Author: xuhansong
 * @Date: 2020-08-28 17:26:47
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-09-18 15:54:04
 * 角色权限
 *
 */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PrivateComponent from 'src/components/PrivateComponent';
import PageTab from 'src/components/PageTab';
import UserTeacherPage from './UserTeacher';
import UserParentPage from './UserParent';
import UserServicePage from './UserService';

export default function UserPage(props: RouteComponentProps) {
  return (
    <PageTab>
      {({ id, pageId, tab }) => {
        return (
          <div>
            <PrivateComponent id={62}>
              {tab === '62' && <UserTeacherPage></UserTeacherPage>}
            </PrivateComponent>
            <PrivateComponent id={63}>
              {tab === '63' && <UserParentPage></UserParentPage>}
            </PrivateComponent>
            <PrivateComponent id={343}>
              {tab === '343' && <UserServicePage></UserServicePage>}
            </PrivateComponent>
          </div>
        );
      }}
    </PageTab>
  );
}
