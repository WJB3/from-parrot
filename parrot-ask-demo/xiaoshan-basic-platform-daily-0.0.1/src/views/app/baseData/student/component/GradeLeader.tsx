import React, { useRef } from 'react';
import { Row, Avatar, Tag, Button, Badge, Modal, message } from 'antd';
import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons';
import GT from 'types';
import { useRequest } from 'ahooks';
import api from 'src/api';
import CreateGradeLeaderModal from './CreateGradeLeader';
import PrivateComponent from 'src/components/PrivateComponent';
import useApp from 'src/hook/useApp';

export default function GradeLeader(props: {
  enrollmentYear: number;
  sectionId: number;
  onRefresh?: () => void;
  onRef?: (ref: any) => void;
}) {
  const modal = useRef<GT.Modal.Ref>();
  const { hasPermission } = useApp();
  const { data, loading, refresh } = useRequest(
    () =>
      api.section.getGradeLeaders({
        params: {
          enrollmentYear: props.enrollmentYear,
          sectionId: props.sectionId,
        },
      }),
    {
      refreshDeps: [props.enrollmentYear, props.sectionId],
    },
  );

 

  props.onRef?.({
    refresh,
  });
  const onDelete = (teacher: GT.Model.GradeLeader) => {
    Modal.confirm({
      title: '删除后，将不能管理该年级学生信息，确定把该教师从年级组中删除吗？',
      onOk() {
        api.section.deleteGradeLeader(teacher.id).then(() => {
          message.success('删除成功');
          refresh();
          props.onRefresh?.();
        });
      },
    });
  };

  console.log("--adminData--",data?.filter)
  console.log("--data--",data)

  const masterData=data?.filter(item=>item.position)

  return (
    <div>
      <p>
        <b>年级组设置</b>
      </p>
      <Row>
        {data?.map((d) => (
          <p style={{ textAlign: 'center', marginRight: 10 }}>
            <Badge
              count={hasPermission(146) ? <CloseCircleFilled onClick={() => onDelete(d)} /> : null}
              offset={[-10, 10]}>
              <p>
                <Avatar size={70} style={{ background: '#5781F2' }}>
                  {d.name}
                </Avatar>
              </p>
              <Tag color='gold' style={{ marginRight: 0 }}>
                {d.position}
              </Tag>
            </Badge>
          </p>
        ))}
        <PrivateComponent id={145}>
          <Button
            shape='circle'
            onClick={() => modal.current?.setVisible(true)}
            style={{ width: 70, height: 70, background: '#F4F5F7', borderStyle: 'dashed' }}>
            <PlusOutlined></PlusOutlined>
          </Button>
        </PrivateComponent>
      </Row>
      <CreateGradeLeaderModal
        onRef={(ref) => (modal.current = ref)}
        sectionId={props.sectionId}
        enrollmentYear={props.enrollmentYear}
        onOk={() => {
          refresh();
          props.onRefresh?.();
        }}></CreateGradeLeaderModal>
    </div>
  );
}
