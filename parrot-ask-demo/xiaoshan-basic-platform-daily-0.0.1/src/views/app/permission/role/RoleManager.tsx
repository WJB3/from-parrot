/*
 * @Author: xuhansong
 * @Date: 2020-08-30 10:32:01
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-10-15 16:27:23
 *
 * 角色管理
 */

import React, { useRef } from 'react';
import {
  Table,
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  Space,
  Switch,
  Popconfirm,
  message,
  Modal,
} from 'antd';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable } from 'ahooks';

import { Store } from 'antd/lib/form/interface';
import GT from 'types';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import api from 'src/api';
import constant from 'src/constant';
import CreateRoleModal from '../component/CreateRole';
import { useHistory } from 'react-router-dom';
import PrivateComponent from 'src/components/PrivateComponent';
import OneLineText from 'src/components/OneLineText';
const { Option } = Select;

export default function RolePage(props: any) {
  const history = useHistory();
  const [form] = Form.useForm();
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: Object) =>
    api.role.getPage({
      params: {
        current,
        size,
        ...formData,
      },
    });

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const modal = useRef<GT.Modal.Ref>();
  const { submit, reset } = search;
  const onEdit = (value: Store) => {
    modal.current?.setVisible(true);
    modal.current?.setTitle('编辑角色');
    modal.current?.form?.setFieldsValue(value);
  };
  const onCreate = () => {
    modal.current?.setTitle('新增角色');
    modal.current?.setVisible(true);
  };
  const onDelete = (data: GT.Model.Role) => {
    Modal.confirm({
      title: '删除后关联该角色的用户将不再拥有该角色的权限，确认删除该角色吗？',
      onOk: () => {
        api.role.delete(data.id).then(() => {
          message.success('删除成功');
          submit();
        });
      },
    });
  };
  const onConfirm = (data: GT.Model.Role) => {
    api.role
      .update({
        ...data,
        state: data.state === 1 ? 0 : 1,
      })
      .then(() => {
        message.success('修改成功');
        refresh();
      });
  };

  const columns: ColumnType<GT.Model.Role>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      fixed: true,
      width: 55,
      align: 'center',
    },
    {
      title: '角色名称',
      dataIndex: 'zhName',
      align: 'center',
    },
    {
      title: '角色权限',
      dataIndex: 'id',
      align: 'center',
      render: (id) => (
        <Button
          type='link'
          ghost
          size='small'
          href={`#${history.location.pathname}/role/${id}/check`}>
          查看
        </Button>
      ),
    },
    {
      title: '关联账号数量',
      dataIndex: 'count',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: 250,
      align: 'center',
    },
    {
      title: '权限状态',
      dataIndex: 'state',
      align: 'center',
      render: (state, record) => (
        <Popconfirm
          title='确认修改权限状态？'
          onConfirm={() => onConfirm(record)}
          disabled={record.defaultState === 1}>
          <Switch checked={state === 1} disabled={record.defaultState === 1} />
        </Popconfirm>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      align: 'center',
      render: (val) => <OneLineText>{val}</OneLineText>,
    },
    {
      title: '操作',
      dataIndex: 'defaultState',
      align: 'center',
      fixed: 'right',
      width: 250,
      render: (defaultState, record) =>
        !defaultState && (
          <Space>
            <PrivateComponent id={176}>
              <Button type='link' size='small' onClick={() => onEdit(record)}>
                编辑
              </Button>
            </PrivateComponent>
            <PrivateComponent id={176}>
              <Button
                type='link'
                size='small'
                href={`#${history.location.pathname}/role/${record.id}/edit`}>
                权限设置
              </Button>
            </PrivateComponent>
            <PrivateComponent id={177}>
              <Button type='link' danger size='small' onClick={() => onDelete(record)}>
                删除
              </Button>
            </PrivateComponent>
          </Space>
        ),
    },
  ];
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  return (
    <div>
      <Form form={form}>
        <Row justify='space-between'>
          <Col span={6}>
            <Form.Item label='角色名称' name='name'>
              <Input placeholder='请输入' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label='权限状态' name='state'>
              <Select placeholder='请选择'>
                {[...constant.role.state.entries()].map(([value, label]) => (
                  <Option value={value} key={value}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}></Col>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Space>
              <Button type='primary' onClick={submit}>
                查询
              </Button>
              <Button onClick={reset}>重置</Button>
            </Space>
          </Form.Item>
        </Row>
      </Form>
      <PrivateComponent id={175}>
        <p>
          <Button type='primary' onClick={onCreate}>
            新增角色
          </Button>
        </p>
      </PrivateComponent>
      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        scroll={{ y: 'calc(100vh - 252px)', scrollToFirstRowOnChange: true }}
      />
      <CreateRoleModal onRef={(ref) => (modal.current = ref)} onOk={refresh}></CreateRoleModal>
    </div>
  );
}
