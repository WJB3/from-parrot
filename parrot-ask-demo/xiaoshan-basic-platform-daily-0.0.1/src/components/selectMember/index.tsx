import { Button, Col, Form, Modal, Row, Tabs, Tag } from 'antd';
import { Store } from 'antd/lib/form/interface';
import React, { useEffect, useRef, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';

import GT from 'types';
import OrganizationMemberSelector, { SelectorData, Ref as OrgRef } from './Organization';
import { useMap } from 'ahooks';
import StudentMemberSelector from './Student';
import ParentMemberSelector from './Parent';
import GroupMemberSelector from './Group';
import DepartmentMemberSelector from './Department';
import BranchMemberSelector from './Branch';
import RoleMemberSelector from './Role';

/**
 * organization: 组织架构
 * group: 群组
 * student: 学生
 * parent: 家长
 * department: 服务人员
 * branch: 部门(不包含具体人)
 * personnel: 人员(类同组织架构)
 * role: 角色
 */
export type tabType = 'organization' | 'group' | 'student' | 'parent' | 'department' | 'branch' | 'personnel' | 'role';
type groupType = 'lesson' | 'custom';
export default function SelectMemberModal(
  props: GT.Modal.Props & {
    tabs: tabType[];
    members: GT.Model.GroupMember[];
    groupType: groupType;
    studentQuery?: any;
    // 自定义群组参数
    customQuery?: any;
  },
) {
  const [visible, setVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(false);
  const [title, setTitle] = useState('选择对象');
  const [expand, setExpand] = useState(false);
  const [loading, setLoading] = useState(false);
  const org = useRef<OrgRef>();
  const student = useRef<OrgRef>();
  const parent = useRef<OrgRef>();
  const group = useRef<OrgRef>();
  const department = useRef<OrgRef>();
  const branch = useRef<OrgRef>();
  const role = useRef<OrgRef>();
  const [map, { get, set, setAll }] = useMap<tabType, SelectorData>(new Map());
  const [form] = Form.useForm<any>();
  useEffect(() => {
    if (visible) {
      setRefreshKey(!refreshKey);
    }
  }, [visible]);
  const tabMaps: Store = {
    organization: {
      name: '组织架构',
      children: (
        <OrganizationMemberSelector
          defaultCheckedKeys={get('organization')?.nodes?.map((item) => item.key)}
          onRef={(ref) => {
            org.current = ref;
          }}
          onChange={(data) => {
            set('organization', data);
          }}></OrganizationMemberSelector>
      ),
    },
    group: {
      name: '群组',
      children: (
        <GroupMemberSelector
          type={props.groupType}
          customQuery={props.customQuery}
          defaultCheckedKeys={get('group')?.nodes?.map((item) => item.key)}
          onRef={(ref) => {
            group.current = ref;
          }}
          onChange={(data) => {
            set('group', data);
          }}></GroupMemberSelector>
      ),
    },
    student: {
      name: '学生',
      children: (
        <StudentMemberSelector
          defaultCheckedKeys={get('student')?.nodes?.map((item) => item.key)}
          studentQuery={props.studentQuery}
          onRef={(ref) => (student.current = ref)}
          onChange={(data) => set('student', data)}></StudentMemberSelector>
      ),
    },
    parent: {
      name: '家长',
      children: (
        <ParentMemberSelector
          defaultCheckedKeys={get('parent')?.nodes?.map((item) => item.key)}
          onRef={(ref) => (parent.current = ref)}
          onChange={(data) => set('parent', data)}></ParentMemberSelector>
      ),
    },
    department: {
      name: '服务人员',
      children: (
        <DepartmentMemberSelector
          defaultCheckedKeys={get('department')?.nodes?.map((item) => item.key)}
          onRef={(ref) => (department.current = ref)}
          onChange={(data) => set('department', data)}></DepartmentMemberSelector>
      ),
    },
    branch: {
      name: '部门',
      children: (
        <BranchMemberSelector
          defaultCheckedKeys={get('branch')?.nodes?.map((item) => item.key)}
          onRef={(ref) => {
            branch.current = ref;
          }}
          onChange={(data) => {
            set('branch', data);
          }}></BranchMemberSelector>
      ),
    },
    personnel: {
      name: '人员',
      children: (
        <OrganizationMemberSelector
          defaultCheckedKeys={get('personnel')?.nodes?.map((item) => item.key)}
          onRef={(ref) => {
            org.current = ref;
          }}
          onChange={(data) => {
            set('personnel', data);
          }}></OrganizationMemberSelector>
      ),
    },
    role: {
      name: '角色',
      children: (
        <RoleMemberSelector
          defaultCheckedKeys={get('role')?.nodes?.map((item) => item.key)}
          onRef={(ref) => {
            role.current = ref;
          }}
          onChange={(data) => {
            set('role', data);
          }}></RoleMemberSelector>
      ),
    }
  };
  props.onRef({
    setVisible,
    setTitle,
    form: form,
    setMembers: (data: Map<tabType, SelectorData>) => {
      setAll(data);
    },
  });
  const handleOk = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      //   setLoading(true);
      props.onOk?.(map);
      setVisible(false);
    });
  };
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };
  const count = [...map.values()].reduce((sum, item) => {
    if (item?.nodes) {
      sum += item.nodes.length;
    }
    return sum;
  }, 0);
  const onClear = (tab: tabType) => {
    switch (tab) {
      case 'organization':
      case 'personnel':
        org.current?.unCheckedAll();
        break;
      case 'group':
        group.current?.unCheckedAll();
        break;
      case 'student':
        student.current?.unCheckedAll();
        break;
      case 'parent':
        parent.current?.unCheckedAll();
        break;
      case 'department':
        department.current?.unCheckedAll();
        break;
      case 'branch':
        branch.current?.unCheckedAll();
        break;
      case 'role':
        role.current?.unCheckedAll();
        break;
      default:
        break;
    }
    // org.current?.unCheckedAll();
  };
  const onDeleteTag = (tab: tabType, tag: any) => {
    switch (tab) {
      case 'organization':
      case 'personnel':
        org.current?.unCheckedNode(tag);
        break;
      case 'group':
        group.current?.unCheckedNode(tag);
        break;
      case 'student':
        student.current?.unCheckedNode(tag);
        break;
      case 'parent':
        parent.current?.unCheckedNode(tag);
        break;
      case 'department':
        department.current?.unCheckedNode(tag);
        break;
      case 'branch':
        branch.current?.unCheckedNode(tag);
        break;
      case 'role':
        role.current?.unCheckedNode(tag);
        break;
      default:
        break;
    }
  };
  return (
    <Modal
      title={title}
      width={'700px'}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={handleCancel}
      confirmLoading={loading}>
      <Row>
        <div
          style={{
            transition: 'all .5s',
            width: expand ? 0 : '50%',
            minHeight: 300,
            overflow: 'hidden',
          }}>
          <Tabs
            defaultActiveKey={props.tabs[0]}
            key={refreshKey.toString()}
            className='tabs_no_line'
            style={{ minWidth: 320 }}>
            {props.tabs.map((tab: string) => (
              <Tabs.TabPane key={tab} tab={tabMaps[tab]?.name} forceRender>
                {tabMaps[tab]?.children}
              </Tabs.TabPane>
            ))}
          </Tabs>
        </div>
        <div
          style={{
            width: expand ? '100%' : '50%',
            position: 'relative',
            borderLeft: '1px solid #E3E4E9',
            paddingLeft: 20,
            transition: 'all .5s',
          }}>
          <div
            onClick={() => setExpand(!expand)}
            style={{
              position: 'absolute',
              cursor: 'pointer',
              left: expand ? -1 : 0,
              top: '50%',
              background: '#fff',
              marginTop: -32,
              border: '1px solid #E3E4E9',
              transformOrigin: 'center left',
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              padding: '20px 0',
              borderLeft: 'none',
              transition: 'transform 1s',
              transform: !expand ? 'rotateY(180deg)' : '',
            }}>
            <RightOutlined style={{ fontSize: 14, color: '#85888D' }} />
          </div>
          <p style={{ color: '#909499', fontSize: 13 }}>已选择对象 {count} 人</p>
          <div style={{ maxHeight: 375, overflow: 'auto' }}>
            {props.tabs.map((tab) =>
              get(tab)?.nodes?.length ? (
                <p>
                  <p>
                    <Row justify='space-between'>
                      <span style={{ fontSize: 16, color: '#303133' }}>
                        {tabMaps[tab].name}
                        <em style={{ fontSize: 13 }}>（{get(tab)?.nodes?.length || 0}人）</em>
                      </span>
                      <Button size='small' onClick={() => onClear(tab)}>
                        清空
                      </Button>
                    </Row>
                  </p>
                  <div>
                    {get(tab)?.views?.groups?.map((org) => (
                      <Tag
                        color='geekblue'
                        key={org.key}
                        closable
                        onClose={() => onDeleteTag(tab, org)}>
                        {org.title}({org.count}人)
                      </Tag>
                    ))}
                    {get(tab)?.views?.nodes?.map((item) => (
                      <Tag
                        color='geekblue'
                        key={item.key}
                        closable
                        onClose={() => onDeleteTag(tab, item)}>
                        {item.name}
                      </Tag>
                    ))}
                  </div>
                </p>
              ) : null,
            )}
          </div>
        </div>
      </Row>
    </Modal>
  );
}

SelectMemberModal.defaultProps = {
  tabs: ['organization', 'group', 'student', 'parent'],
  members: [],
  groupType: 'custom',
};
