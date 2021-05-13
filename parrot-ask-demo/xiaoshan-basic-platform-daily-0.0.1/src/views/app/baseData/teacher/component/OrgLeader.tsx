import React, { useRef } from 'react';
import { Row, Avatar, Tag, Button, Badge, Modal, message } from 'antd';
import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons';
import CreateOrgLeaderModal from './CreateLeader';
import GT from 'types';
import { useRequest } from 'ahooks';
import api from 'src/api';
import PrivateComponent from 'src/components/PrivateComponent';
import useApp from 'src/hook/useApp';

export default function OrgLeader(props: {
  node: GT.Model.Organization;
  onRefresh?: () => void;
  onRef?: (ref: any) => void;
}) {
  const modal = useRef<GT.Modal.Ref>();
  const { data, loading, refresh } = useRequest(() => api.organization.getLeaders(props.node.id), {
    refreshDeps: [props.node],
  });
  const { data: adminData, loading: adminloading, refresh: adminrefresh } = useRequest(() => api.organization.getAdminLeader(props.node.id), {
    refreshDeps: [props.node],
  });

  const { hasPermission } = useApp();

  props.onRef?.({
    refresh,
  });

  const onDelete = (teacher: GT.Model.Teacher) => {
    Modal.confirm({
      title: '确定删除该教师的部门领导职位吗？取消后，该教师仍属于该部门成员。',
      onOk() {
        api.organization
          .deleteLeader({
            params: {
              teacherId: teacher.id,
              departmentId: props.node.id,
            },
          })
          .then(() => {
            message.success('删除成功');
            refresh();
            props.onRefresh?.();
          });
      },
    });
  };

  const onAdminDelete = (teacher: GT.Model.Teacher) => {
    Modal.confirm({
      title: '确定删除该主任/管理员',
      onOk() {
        api.organization
          .deleteAdminLeader({
            teacherId: teacher.id,
            departmentId: props.node.id,
            management: false
          })
          .then(() => {
            message.success('删除成功');
            adminrefresh();
            props.onRefresh?.();
          });
      },
    });
  }

  console.log("adminData", adminData);

  return (
    <div>
      <p>
        <b>部门领导</b>
      </p>
      <Row>

        {adminData && adminData.length ? <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}>
          <Avatar size={70} style={{ background: '#5781F2' }}>
            {adminData?.[0]?.name}
          </Avatar>
          <CloseCircleFilled onClick={() => onAdminDelete(adminData?.[0])} style={{
            position: 'absolute',
            right: '5px',
            zIndex: 999,
            top: '4px'
          }} />
          <Tag color='gold' style={{ marginRight: 0, marginTop: 14 }}>
            {"主任/管理员"}
          </Tag>
        </div> : <div style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          <Button
            shape='circle'
            onClick={() => {
              modal.current?.setVisible(true)
              modal.current?.setAdmin(true)
            }}
            style={{ width: 70, height: 70, background: '#fdf6ec', borderColor: 'grey', borderStyle: 'dashed' }}>
            <PlusOutlined style={{ color: 'grey' }}></PlusOutlined>
          </Button>
          <Tag color='gold' style={{ marginRight: 0, marginTop: 14 }}>
            {"主任/管理员"}
          </Tag>
        </div>}


        {data?.map((d) => (
          <p style={{ textAlign: 'center', marginLeft: 10 }}>
            <Badge
              count={hasPermission(245) ? <CloseCircleFilled onClick={() => onDelete(d)} /> : null}
              offset={[-10, 10]}>
              <p>
                <Avatar size={70} style={{ background: '#5781F2' }}>
                  {d.name}
                </Avatar>
              </p>
              <Tag color='blue' style={{ marginRight: 0 }}>
                {d.position}
              </Tag>
            </Badge>
          </p>
        ))}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 10,
          alignItems: 'center'
        }}>
          <Button
            shape='circle'
            onClick={() => {
              modal.current?.setVisible(true)
              modal.current?.setAdmin(false)
            }}
            style={{ width: 70, height: 70, background: '#ecf5ff', borderColor: 'grey', borderStyle: 'dashed' }}>
            <PlusOutlined style={{ color: 'grey' }}></PlusOutlined>
          </Button>
          <Tag color='blue' style={{ marginRight: 0, marginTop: 14 }}>
            {"其他领导"}
          </Tag>
        </div>
        {/* <PrivateComponent id={244}>
          <Button
            shape='circle'
            onClick={() => modal.current?.setVisible(true)}
            style={{ width: 70, height: 70, background: '#F4F5F7', borderStyle: 'dashed' }}>
            <PlusOutlined></PlusOutlined>
          </Button>
        </PrivateComponent> */}
      </Row>
      <CreateOrgLeaderModal
        onRef={(ref) => (modal.current = ref)}
        node={props.node}
        onOk={() => {
          refresh();
          adminrefresh();
          props.onRefresh?.();
        }}
      />
    </div>
  );
}
