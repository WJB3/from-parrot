import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { Button, Form, Input, message, Modal, Row, Select, Space, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import React, { useRef, useState } from 'react';
import { SyncOutlined } from '@ant-design/icons';
import api from 'src/api';
import appStyle from 'src/App.style';
import constant from 'src/constant';
import Cascader, { CascaderOptionType } from 'antd/lib/cascader';
import GT from 'types';
import EditLessonGroupModal from './component/EditLessonGroup';
import CreateCustomGroupModal from './component/CreateCustomGroup';
import useDictionary from 'src/hook/useDictionary';
import PrivateComponent from 'src/components/PrivateComponent';
import OneLineText from 'src/components/OneLineText';
export default function CustomGroup() {
  const [form] = Form.useForm<any>();
  const { renderSelect, renderText } = useDictionary();
  const [options, setOptions] = useState<CascaderOptionType[]>([]);
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) =>
    api.group.getPage({
      params: {
        ...formData,
        current,
        size,
      },
    });
  const modal = useRef<GT.Modal.Ref>();
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const { reset, submit } = search;
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  const onDelete = (record: GT.Model.Group) => {
    Modal.confirm({
      title: '确认删除该群组吗？',
      onOk: () => {
        api.group.delete(record.id).then(() => {
          message.success('删除成功');
          submit();
        });
      },
    });
  };
  const onEdit = (record: GT.Model.Group) => {
    modal.current?.setVisible(true);
    modal.current?.setTitle('编辑群组');
    const leader = record.leaderId
      ? {
          leaderId: record.leaderId,
          leaderName: record.leaderName,
          leaderType: record.leaderType,
          number: record.number,
        }
      : undefined;
    let initial = {
      nodes: [],
      views: {
        nodes: [],
        groups: [],
      },
    };
    const obj = record.members?.reduce(
      (obj, item) => {
        // obj.group = obj.group.concat(
        //   item.groupIds.map((pId, index) => ({
        //     id: item.memberId,
        //     memberType: item.memberType,
        //     number: item.number,
        //     key: item.number
        //       ? `node,${pId},${item.memberId},${item.number}`
        //       : `node,${pId},${item.memberId}`,
        //   })),
        // );
        // 没有parentIds，则认为教师是待分配教师
        if (item.memberType === 1) {
          obj.organization = obj.organization.concat(
            item.parentIds?.length
              ? item.parentIds?.map((pId) => ({
                  id: item.memberId,
                  key: `node,${pId},${item.memberId}`,
                }))
              : [
                  {
                    id: item.memberId,
                    key: `node,${-1},${item.memberId}`,
                  },
                ],
          );
        }
        if (item.memberType === 2) {
          obj.student = obj.student.concat(
            item.parentIds?.map((pId) => ({
              id: item.memberId,
              key: `node,${pId},${item.memberId}`,
            })),
          );
        }
        if (item.memberType === 3) {
          obj.parent = obj.parent.concat(
            [
              {
                id: item.memberId,
                number: item.number,
                key: `node,${item.memberId},${item.number}`,
              },
            ],
            // item.numbers?.map((number) => ()),
          );
        }

        return obj;
      },
      {
        organization: [] as any[],
        group: [] as any[],
        student: [] as any[],
        parent: [] as any[],
      },
    );
    let map = new Map([
      [
        'organization',
        {
          nodes: obj?.organization,
        },
      ],
      [
        'group',
        {
          nodes: obj?.group,
        },
      ],
      [
        'student',
        {
          nodes: obj?.student,
        },
      ],
      [
        'parent',
        {
          nodes: obj?.parent,
        },
      ],
    ]);
    modal.current?.form?.setFieldsValue({
      id: record.id,
      name: record.name,
      propertyType: record.propertyType,
      leader,
      member: map,
    });
    modal.current?.setMember(map);
    modal.current?.setLeader(leader);
  };
  const columns: ColumnType<GT.Model.Group>[] = [
    {
      title: '序号',
      align: 'center',
      render: (val, record, index) => index + 1,
    },
    {
      title: '群组名称',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '群组性质',
      align: 'center',
      dataIndex: 'propertyType',
      render: (val) => renderText('groupType', val),
    },
    {
      title: '组长',
      align: 'center',
      dataIndex: 'leaderName',
    },
    {
      title: '成员',
      align: 'center',
      dataIndex: 'members',
      width: 300,
      render: (members: GT.Model.GroupMember[]) => {
        return (
          <OneLineText>
            {members
              ?.map((m) => {
                const length = members.filter((item) => item.name === m.name).length;
                if (length > 1) {
                  return `${m.name}(${m.phone})`;
                }
                return m.name;
              })
              .join('，')}
          </OneLineText>
        );
      },
    },
    {
      title: '人数',
      align: 'center',
      dataIndex: ['members', 'length'],
    },
    {
      title: '操作',
      align: 'center',
      render: (val, record) => (
        <Space>
          <PrivateComponent id={169}>
            <Button type='link' onClick={() => onEdit(record)}>
              编辑
            </Button>
          </PrivateComponent>
          <PrivateComponent id={169}>
            <Button type='link' danger onClick={() => onDelete(record)}>
              删除
            </Button>
          </PrivateComponent>
        </Space>
      ),
    },
  ];
  const onCreate = () => {
    modal.current?.setVisible(true);
    modal.current?.setTitle('新增群组');
  };
  return (
    <div>
      <Form form={form} className='search_form'>
        <Row>
          <Row className='search_form_items'>
            <Form.Item name='propertyType' label='群组性质'>
              {renderSelect('groupType')}
            </Form.Item>
            <Form.Item label='群组名称' name='name'>
              <Input placeholder='请输入'></Input>
            </Form.Item>
          </Row>
          <Form.Item>
            <Space>
              <Button type='primary' onClick={submit}>
                查询
              </Button>
              <Button onClick={reset}>重置</Button>
            </Space>
          </Form.Item>
        </Row>
      </Form>
      <PrivateComponent id={[69]}>
        <p>
          <Button ghost type='primary' onClick={onCreate}>
            新增群组
          </Button>
        </p>
      </PrivateComponent>

      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        size='small'
        scroll={{ scrollToFirstRowOnChange: true }}
      />
      <CreateCustomGroupModal
        onRef={(ref) => (modal.current = ref)}
        onOk={refresh}></CreateCustomGroupModal>
    </div>
  );
}
