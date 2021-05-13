/*
 * @Author: xuhansong
 * @Date: 2020-09-14 16:44:38
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-09-18 15:53:57
 * 基础数据-人脸库
 */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PrivateComponent from 'src/components/PrivateComponent';
import PageTab from 'src/components/PageTab';
import FaceTeacherPage from './Teacher';
import FaceStudentPage from './Student';
import FacePreStudentPage from './PreStudent';
import FaceServicePage from './Service';

export default function FacePage(props: RouteComponentProps) {
  return (
    <PageTab>
      {({ id, pageId, tab }) => (
        <div>
          <PrivateComponent id={79}>
            {tab === '79' && <FaceTeacherPage></FaceTeacherPage>}
          </PrivateComponent>
          <PrivateComponent id={80}>
            {tab === '80' && <FaceStudentPage></FaceStudentPage>}
          </PrivateComponent>
          <PrivateComponent id={81}>
            {tab === '81' && <FacePreStudentPage></FacePreStudentPage>}
          </PrivateComponent>
          <PrivateComponent id={299}>
            {tab === '299' && <FaceServicePage></FaceServicePage>}
          </PrivateComponent>
          {/* <PrivateComponent id={18}>{tab === '18' && <OrgTree></OrgTree>}</PrivateComponent> */}
        </div>
      )}
    </PageTab>
  );
}
