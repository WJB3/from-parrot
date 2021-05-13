import React, { useRef } from 'react';
import { Row, Avatar, Tag, Button, Badge, Modal, message } from 'antd';
import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons';
import GT from 'types';
import { useRequest } from 'ahooks';
import api from 'src/api';
import CreateClassLeaderModal from './CreateClassLeader';
import PrivateComponent from 'src/components/PrivateComponent';
import useApp from 'src/hook/useApp';

export default function ClassLeader(props: {
  enrollmentYear: number;
  sectionId: number;
  classId: number;
  onRefresh?: () => void;
  onRef?: (ref: any) => void;
}) {
  const modal = useRef<GT.Modal.Ref>();
  const { hasPermission } = useApp();
  const { data, loading, refresh } = useRequest(() => api.classes.get(props.classId), {
    refreshDeps: [props.classId],
  });
  props.onRef?.({
    refresh,
  });
  const onDelete = (d: any) => {
    Modal.confirm({
      title: '删除后，将不能管理该班级学生信息，确定取消班主任任命？',
      onOk() {
        api.classes
          .update({
            ...d,
            headTeacherId: undefined,
          })
          .then(() => {
            message.success('删除成功');
            refresh();
            props.onRefresh?.();
          });
      },
    });
  };
  return (
    <div>
      <p>
        <b>班主任设置</b>
      </p>
      <Row>
        {data?.headTeacherId && (
          <p style={{ textAlign: 'center', marginRight: 10 }}>
            <Badge
              count={
                hasPermission(141) ? <CloseCircleFilled onClick={() => onDelete(data)} /> : null
              }
              offset={[-10, 10]}>
              <p>
                <Avatar size={70} style={{ background: '#5781F2' }}>
                  {data.headTeacherName}
                </Avatar>
              </p>
              <Tag color='gold' style={{ marginRight: 0 }}>
                班主任
              </Tag>
            </Badge>
          </p>
        )}
        {!data?.headTeacherId && (
          <PrivateComponent id={140}>
            <Button
              shape='circle'
              onClick={() => modal.current?.setVisible(true)}
              style={{ width: 70, height: 70, background: '#F4F5F7', borderStyle: 'dashed' }}>
              <PlusOutlined></PlusOutlined>
            </Button>
          </PrivateComponent>
        )}
      </Row>
      <CreateClassLeaderModal
        onRef={(ref) => (modal.current = ref)}
        classId={props.classId}
        data={data}
        onOk={() => {
          refresh();
        }}></CreateClassLeaderModal>
    </div>
  );
}
