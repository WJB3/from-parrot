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
import CreateCompanyModal from './component/CreateCompanyModal';
import PrivateComponent from 'src/components/PrivateComponent';
import DeleteCompanyModal from './component/DeleteCompanyModal';
import OneLineText from 'src/components/OneLineText';

export default function CompanyList() {
  const [rows, setRows] = useState<GT.Model.Company[]>([]);

  const getTableData = ({ current, pageSize: size }: PaginatedParams[0]) =>
    api.service.getCompany({
      current,
      size,
    });

  const { tableProps, search, refresh } = useAntdTable(getTableData, {});
  const modal = useRef<GT.Modal.Ref>();
  const deleteModal = useRef<GT.Modal.Ref>();
  const { submit, reset } = search;
  const onEdit = (value: Store) => {
    modal.current?.setVisible(true);
    modal.current?.setTitle('编辑服务商');
    modal.current?.form?.setFieldsValue(value);
  };
  const onDelete = (value: Store) => {
    deleteModal.current?.setVisible(true);
    deleteModal.current?.form?.setFieldsValue(value);
  };
  const finishDelete = ()=> {
    setRows([]);
    submit();
  };

  const columns: ColumnType<GT.Model.Company>[] = [
    {
      title: '序号',
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
    },
    {
      title: '公司名称',
      dataIndex: 'name',
      render: (value) => <OneLineText>{value}</OneLineText>,
      align: 'center',
    },
    {
      title: '公司地址',
      dataIndex: 'address',
      render: (value) => <OneLineText>{value}</OneLineText>,
      align: 'center',
    },
    {
      title: '联系人姓名',
      dataIndex: 'contact',
      align: 'center',
    },
    {
      title: '联系人手机号',
      dataIndex: 'contactPhone',
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 250,
      render: (text, record) => (
        <Space>
          <PrivateComponent id={339}>
            <Button type='link' onClick={() => onEdit(record)}>
              编辑
            </Button>
          </PrivateComponent>
          <PrivateComponent id={341}>
            <Button type='link' danger onClick={() => onDelete(record)}>
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
  const onCreate = () => {
    modal.current?.setTitle('新增服务商');
    api.service
    .getCompanyMaxSort()
    .then((res) => {
      modal.current?.form?.setFieldsValue({
        sort: Math.min(999, res + 1),
      });
      modal.current?.setFormData({
        sort: Math.min(999, res + 1),
      });
    });
    modal.current?.setVisible(true);
  };
  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.Company[]) => {
    setRows(selectedRows);
  };

  return (
    <div>
      <PrivateComponent id={[338]}>
        <p>
          <Space>
            <PrivateComponent id={338}>
              <Button type='primary' ghost onClick={onCreate}>
              新增服务商
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
        // rowSelection={{
        //   type: 'checkbox',
        //   onChange,
        //   fixed: true,
        //   selectedRowKeys: rows.map((item) => item.id),
        // }}
        size='small'
        scroll={{ scrollToFirstRowOnChange: true, x: 1400 }}
      />
      <CreateCompanyModal
        onRef={(ref) => (modal.current = ref)}
        onOk={refresh}
      />
      <DeleteCompanyModal
      onRef={(ref) => (deleteModal.current = ref)}
      onOk={finishDelete}
      ></DeleteCompanyModal>
    </div>
  );
}
