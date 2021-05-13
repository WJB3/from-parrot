import React, { useState, useRef } from 'react';
import {
  Table,
  Form,
  Input,
  Row,
  Col,
  Button,
  Avatar,
  Select,
  Space,
  Modal,
  message,
  TreeSelect,
  Cascader,
} from 'antd';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';
import useDownload from 'src/hook/useDownload';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import api from 'src/api';
import { ColumnType } from 'antd/es/table/interface';
import constant from 'src/constant';
import appStyle from 'src/App.style';
import { CascaderOptionType } from 'antd/lib/cascader';
import PrivateComponent from 'src/components/PrivateComponent';
import { useRequest } from 'ahooks';
export default function StudentList() {
  const [form] = Form.useForm();
  const [options, setOptions] = useState<CascaderOptionType[]>([]);
  const [rows, setRows] = useState<GT.Model.Student[]>([]);
  const { renderText, renderSelect } = useDictionary();
  const { download } = useDownload();
  const createModal = useRef<GT.Modal.Ref>();
  const exchangeModal = useRef<GT.Modal.Ref>();
  const importModal = useRef<GT.Modal.Ref>();
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    return api.iot.getPage({
      pageNo: current,
      pageSize: size,
      ...formData,
    });
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const { submit, reset } = search;
  const { data: products } = useRequest(() => api.iot.getProducts());
  const { data: regions } = useRequest(() => api.building.getRoomTree());
  console.log(products, 1);
  const columns: ColumnType<GT.Model.IoT_Device>[] = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      align: 'center',
    },
    {
      title: '设备编号',
      dataIndex: 'deviceCode',
      align: 'center',
    },
    {
      title: '设备SN',
      dataIndex: 'sn',
      align: 'center',
    },
    {
      title: '所属产品',
      dataIndex: 'productName',
      align: 'center',
    },
    {
      title: '安装区域',
      dataIndex: 'region',
      align: 'center',
    },
    {
      title: '具体位置',
      dataIndex: 'position',
      align: 'center',
    },
    {
      title: '在线状态',
      dataIndex: 'lifeState',
      align: 'center',
      render: (val) => renderText('deviceStatus', val),
    },
    {
      title: '设备二维码',
      dataIndex: 'studentType',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'state',
      align: 'center',
    },
  ];
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  return (
    <div>
      <Form form={form} className='search_form'>
        <Row>
          <Row className='search_form_items'>
            <Form.Item label='设备名称' name='deviceName'>
              <Input placeholder='请输入' />
            </Form.Item>
            <Form.Item label='所属产品' name='productName'>
              <Input placeholder='请选择' />
            </Form.Item>

            <Form.Item label='安装区域' name='region'>
              <Input placeholder='请选择' />
            </Form.Item>

            <Form.Item label='状态' name='lifeState'>
              {renderSelect('deviceStatus')}
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

      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        size='small'
        scroll={{ scrollToFirstRowOnChange: true }}
      />
    </div>
  );
}
