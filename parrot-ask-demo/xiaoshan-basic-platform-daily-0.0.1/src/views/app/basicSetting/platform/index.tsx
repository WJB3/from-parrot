import React, { useRef, useState } from 'react';
import { Table, Form, Input, Row, Button, Space, Modal, message, TreeSelect } from 'antd';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable, useRequest } from 'ahooks';

import { Store } from 'antd/lib/form/interface';
import GT from 'types';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import api from 'src/api';
import constant from 'src/constant';
import PrivateComponent from 'src/components/PrivateComponent';
import OneLineText from 'src/components/OneLineText';
import EditSettingModal from './component/EditSettingModal';
import CreatePushModal from './component/CreatePushModal';
import { mode } from 'crypto-js';

export default function PlatformList() {
  const [rows, setRows] = useState<GT.Model.Platform[]>([]);

  const getTableData = ({ current, pageSize: size }: PaginatedParams[0]) =>
    api.platform.getPage({params: {current: current, size: size}});

  const { data: apps } = useRequest(() => api.permission.getPermissions({ level: 2 }));

  const { tableProps, search, refresh } = useAntdTable(getTableData, {});
  const modal = useRef<GT.Modal.Ref>();
  const editModal = useRef<GT.Modal.Ref>();
  const { submit, reset } = search;

  const onCreate = () => {
    modal.current?.setTitle('添加推送事项');
    modal.current?.setVisible(true);
  };

  const onEdit = (value: GT.Model.Platform) => {
    modal.current?.setVisible(true);
    modal.current?.setTitle('设置事项');
    for (let item of value.templates) {
      if (item.pushType == 1) {
        modal.current?.setPushTemplate1(item);
      } else if (item.pushType == 2) {
        modal.current?.setPushTemplate2(item);
      } else if (item.pushType == 3) {
        modal.current?.setPushTemplate3(item);
      } else {
        modal.current?.setPushTemplate4(item);
      }
    }
    modal.current?.form?.setFieldsValue(value);
    let defaultValues = value.templates.filter((e)=> e.openState ).map((e) => `pushTemplate${e.pushType}`);
    modal.current?.form?.setFieldsValue({templates: defaultValues});
   };

  const onEditPush = (value: GT.Model.Platform) => {
    editModal.current?.setVisible(true);
    editModal.current?.form?.setFieldsValue(value);
    editModal.current?.setTemplate(value.openState);
    editModal.current?.setTemplates(value.templates);
    let defaultValues: string[] = [];
    let bools: boolean[] = [false, false, false, false, false];
    value.templates.forEach((e) => {
      if (e.openState) {
        defaultValues.push(`pushTemplate${e.pushType}`);
        bools[e.pushType] = true;
      }
    });
    editModal.current?.setBools(bools);
    // let defaultValues = value.templates.filter((e)=> e.openState ).map((e) => `pushTemplate${e.pushType}`);
    console.log(defaultValues);
    editModal.current?.form?.setFieldsValue({templates: defaultValues, openState: value.openState ? 1 : 0});
  }

  const onDelete = (value: GT.Model.Platform) => {
    Modal.confirm({
      title: '确认删除吗？',
      onOk: () => {
        api.platform.delete(value.id).then(() => {
          message.success('删除成功');
          setRows([]);
          submit();
        });
      },
    });
  };

  const columns: ColumnType<GT.Model.Platform>[] = [
    {
      title: '序号',
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
    },
    {
      title: '应用名称',
      dataIndex: 'applicationName',
      align: 'center',
    },
    {
      title: '推送事项',
      dataIndex: 'name',
      render: (value) => <OneLineText>{value}</OneLineText>,
      align: 'center',
    },
    {
      title: '推送描述',
      dataIndex: 'detail',
      render: (value) => <OneLineText>{value}</OneLineText>,
      align: 'center',
    },
    {
      title: '是否推送',
      dataIndex: 'openState',
      render: (value) => value ? "是" : "否",
      align: 'center',
    },
    {
      title: '推送方式',
      dataIndex: 'templates',
      render: (value, model) => (model.templates.filter((template) => template.openState).map((teplate) => constant.pushType.type.get(teplate.pushType)).join(',')),
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 250,
      render: (text, record) => (
        <Space>
          <PrivateComponent id={372}>
            <Button type='link' onClick={() => onEdit(record)}>
              事项编辑
            </Button>
          </PrivateComponent>
          <Button type='link' onClick={() => onEditPush(record)}>
              编辑
          </Button>
          <Button type='link' danger onClick={() => onDelete(record)}>
              删除
          </Button>
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
      <PrivateComponent id={[371]}>
        <p>
          <Space>
            <PrivateComponent id={371}>
              <Button type='primary' ghost onClick={onCreate}>
                添加推送事项
              </Button>
            </PrivateComponent>
          </Space>
        </p>
      </PrivateComponent>

      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        size='small'
        scroll={{ scrollToFirstRowOnChange: true, x: 1400 }}
      />
      <CreatePushModal
        onRef={(ref) => (modal.current = ref)}
        onOk={refresh}
        node={apps}
      />
      <EditSettingModal
      onRef={(ref) => (editModal.current = ref)}
      onOk={refresh}
      ></EditSettingModal>
    </div>
  );
}
