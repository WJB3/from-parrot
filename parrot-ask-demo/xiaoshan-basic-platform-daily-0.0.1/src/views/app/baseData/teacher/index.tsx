/*
 * @Author: xuhansong
 * @Date: 2020-09-14 16:44:38
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-09-18 15:53:57
 * 基础数据-老师数据
 */
import React from 'react';
import TeacherList from './Teacher';
import OrgTree from './Organization';
import { RouteComponentProps } from 'react-router-dom';
import PrivateComponent from 'src/components/PrivateComponent';
import PageTab from 'src/components/PageTab';

export default function TeacherPage(props: RouteComponentProps) {
  return (
    <PageTab>
      {({ id, pageId, tab }) => (
        <div>
          <PrivateComponent id={17}>{tab === '17' && <TeacherList></TeacherList>}</PrivateComponent>
          <PrivateComponent id={18}>{tab === '18' && <OrgTree></OrgTree>}</PrivateComponent>
        </div>
      )}
    </PageTab>
  );
}
