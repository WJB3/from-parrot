/*
 * @Author: xuhansong
 * @Date: 2020-09-14 16:44:23
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-09-18 15:53:50
 * 基础数据-学生数据
 */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PrivateComponent from 'src/components/PrivateComponent';
import StudentList from './Student';
import SectionPage from './Section';
import PageTab from 'src/components/PageTab';

export default function StudentPage(props: RouteComponentProps) {
  return (
    <PageTab>
      {({ id, pageId, tab }) => (
        <div>
          <PrivateComponent id={33}>{tab === '33' && <StudentList></StudentList>}</PrivateComponent>
          <PrivateComponent id={34}>{tab === '34' && <SectionPage></SectionPage>}</PrivateComponent>
        </div>
      )}
    </PageTab>
  );
}
