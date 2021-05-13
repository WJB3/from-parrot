import React, { useRef, useEffect } from 'react';
import {
  Table,
  Button,
  Select,
  Space,
  message,
  Popconfirm,
  Switch,
  Form,
  Row,
  Input,
  Col,
  Modal,
} from 'antd';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable } from 'ahooks';

import { Store } from 'antd/lib/form/interface';
import GT from 'types';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import api from 'src/api';
import { RouteComponentProps } from 'react-router-dom';
import qs from 'qs';
import { useGlobalState, ActionType } from 'src/store';
import CreateDictionaryValModal from './component/CreateDictionaryVal';
import { useForm } from 'antd/lib/form/Form';
import constant from 'src/constant';
import CreateDictionaryModal from './component/CreateDictionary';
import useUser from 'src/hook/useUser';

export default function PlatformDictionaryPage(props: {
  dicCode?: string;
  node?: GT.Model.Dictionary;
  defaultStatus?: 0 | 1;
  onRefresh?: () => void;
}) {
  // const searchParams = qs.parse(props.location.search.substr(1));
  const [state, dispatch] = useGlobalState();
  const user = useUser();
  const [form] = useForm();
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: Object) =>
    api.dictionary.getAllValuePage({
      params: {
        dicCode: props.dicCode,
        defaultStatus: props.defaultStatus,
        ...formData,
        size,
        current,
      },
    });

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form,
    refreshDeps: [props.dicCode, props.defaultStatus],
  });
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  const modal = useRef<GT.Modal.Ref>();
  const dictionary = useRef<GT.Modal.Ref>();
  const { submit, reset } = search;
  const onEdit = (value: Store) => {
    modal.current?.setVisible(true);
    modal.current?.setTitle('编辑字典值');
    modal.current?.form?.setFieldsValue(value);
  };
  const onCreate = () => {
    props.node?.id &&
      api.dictionary.getMaxSort(props.node?.id).then((sort) => {
        modal.current?.setTitle('新增字典值');
        modal.current?.setVisible(true);
        modal.current?.form?.setFieldsValue({
          dicCode: props.node?.dicCode,
          dicName: props.node?.dicName,
          sort,
        });
      });
  };
  const onCreateDic = () => {
    dictionary.current?.setTitle('新增字典');
    dictionary.current?.setVisible(true);
  };
  const onDelete = (data: GT.Model.DictionaryValue) => {
    Modal.confirm({
      title:
        '删除后，选择时将不会有当前字典值的选项，之前已选中当前字典值的将被清空，确认删除当前字典值？',
      onOk() {
        api.dictionary.deleteValue(data.id).then(() => {
          message.success('删除成功');
          submit();
        });
      },
    });
  };
  const onConfirm = (data: GT.Model.DictionaryValue) => {
    api.dictionary
      .updateValue({
        ...data,
        useStatus: data.useStatus === 1 ? 0 : 1,
      })
      .then(() => {
        message.success('修改成功');
        refresh();
      });
  };
  const columns: ColumnType<GT.Model.DictionaryValue>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '所属字典',
      dataIndex: 'dicName',
      align: 'center',
    },
    {
      title: '值',
      dataIndex: 'value',
      align: 'center',
    },

    {
      title: '是否可用',
      dataIndex: 'useStatus',
      align: 'center',
      render: (useStatus, record) => (
        <Switch
          checked={useStatus === 0}
          disabled={record?.defaultStatus === 0}
          onClick={() => {
            Modal.confirm({
              title: '确认修改状态？',
              onOk: () => onConfirm(record),
            });
          }}
        />
      ),
    },
    {
      title: '操作',
      fixed: 'right',
      width: 250,
      align: 'center',
      render: (text, record) =>
        record.defaultStatus === 1 || user.isSysAdmin ? (
          <Space>
            <Button type='link' size='small' onClick={() => onEdit(record)}>
              编辑
            </Button>
            <Button type='link' danger size='small' onClick={() => onDelete(record)}>
              删除
            </Button>
          </Space>
        ) : null,
    },
  ];
  return (
    <div>
      {!props?.dicCode && (
        <Form form={form} className='search_form'>
          <Row>
            <Row className='search_form_items'>
              <Col span={6}>
                <Form.Item label='名称' name='name' style={{ width: 270 }}>
                  <Input placeholder='请输入名称或所属字典' />
                </Form.Item>
              </Col>
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
      )}

      {props.dicCode && (props.defaultStatus || user.isSysAdmin) ? (
        <p>
          <Space>
            <Button type='primary' ghost onClick={onCreate}>
              新增字典值
            </Button>
            {user.isSysAdmin ? (
              <Button type='primary' ghost onClick={onCreateDic}>
                新增字典
              </Button>
            ) : null}
          </Space>
        </p>
      ) : null}
      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        scroll={{ y: 'calc(100vh - 252px)', scrollToFirstRowOnChange: true }}
      />

      <CreateDictionaryValModal onRef={(ref) => (modal.current = ref)} onOk={refresh} />

      <CreateDictionaryModal
        onRef={(ref) => (dictionary.current = ref)}
        onOk={() => {
          refresh();
          props.onRefresh?.();
        }}
      />
    </div>
  );
}
