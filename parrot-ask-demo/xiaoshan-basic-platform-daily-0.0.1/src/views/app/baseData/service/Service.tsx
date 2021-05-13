import React, { useRef, useState } from 'react';
import { Table, Form, Input, Row, Button, Space, Modal, message, TreeSelect, Select } from 'antd';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable, useRequest } from 'ahooks';

import { Store } from 'antd/lib/form/interface';
import GT from 'types';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import api from 'src/api';
import constant from 'src/constant';
import useDictionary from 'src/hook/useDictionary';
import CreateServiceModal from './component/CreateServiceModal';
import useDownload from 'src/hook/useDownload';
import { TreeNode } from 'antd/lib/tree-select';
import ImportExcelModal from 'src/components/importModal';
import PrivateComponent from 'src/components/PrivateComponent';
import UpdateServiceDeModal from './component/UpdateServiceDeModal';
import OneLineText from 'src/components/OneLineText';

const { Option } = Select;

export default function TeacherList() {
  const [form] = Form.useForm<GT.DTO.SearchServiceParmas>();
  const [rows, setRows] = useState<GT.Model.Service[]>([]);
  const { renderText, renderSelect } = useDictionary();
  const [exportLoading, setExportLoading] = useState(false);
  const { download } = useDownload();

  const { data: treeData } = useRequest( () => api.service.getDepartment({params: {current: -1, size: -1}}).then( (res) => { return res.list}));
  const { data: companyList } = useRequest( () => api.service.getCompany({current: -1, size: -1}).then((res)=> { return res.list}));

  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) =>
    api.service.getPage({
      ...formData,
      departmentIds: formData.departmentIds?.join(',') || null,
      current,
      size,
    });

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const modal = useRef<GT.Modal.Ref>();
  const importModal = useRef<GT.Modal.Ref>();
  const orgModal = useRef<GT.Modal.Ref>();

  const { submit, reset } = search;
  const onEdit = (value: Store) => {
    modal.current?.setVisible(true);
    modal.current?.setTitle('编辑服务人员');
    modal.current?.form?.setFieldsValue(value);
  };
  const onDelete = (records: GT.Model.Service[]) => {
    Modal.confirm({
      title: '删除后将清空该人员在平台内所有数据且无法恢复，确认删除该人员吗？',
      onOk: () => {
        api.service.delete({ data: records.map((record) => record.id) }).then(() => {
          message.success('删除成功');
          setRows([]);
          submit();
        });
      },
    });
  };
  const columns: ColumnType<GT.Model.Service>[] = [
    {
      title: '序号',
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
    },
    {
      title: 'IC卡号',
      dataIndex: 'icCardNo',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '证件号码',
      dataIndex: 'idNo',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (value) => renderText('gender', value),
      align: 'center',
    },
    {
      title: '手机',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
      align: 'center',
      render: (val, record) => {
        if (val) {
          return <OneLineText>{val}</OneLineText>;
        }
        return (
          <PrivateComponent id={323}>
            <Button
              type='link'
              style={{ color: '#FF8948' }}
              onClick={() => {
                orgModal.current?.setVisible(true);
                orgModal.current?.form?.setFieldsValue(record);
              }}>
              待分配
            </Button>
          </PrivateComponent>
        );
      },
    },
    {
      title: '所属公司',
      dataIndex: 'companyName',
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 250,
      render: (text, record) => (
        <Space>
          <PrivateComponent id={323}>
            <Button type='link' onClick={() => onEdit(record)}>
              编辑
            </Button>
          </PrivateComponent>
          <PrivateComponent id={324}>
            <Button type='link' danger onClick={() => onDelete([record])}>
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
    modal.current?.setTitle('新增服务人员');
    modal.current?.setVisible(true);
  };
  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.Service[]) => {
    setRows(selectedRows);
  };
  const onExport = () => {
    const searchParams = form.getFieldsValue();
    setExportLoading(true);
    api.service
      .exportExcel({
        ...searchParams,
        departmentIds: searchParams.departmentIds?.join(','),
      })
      .then((res) => {
        download(res).finally(() => setExportLoading(false));
      })
      .catch(() => {
        setExportLoading(false);
      });
  };
  const onImport = () => {
    importModal.current?.setVisible(true);
  };

  const renderTreeNode = (data: GT.Model.Organization[]) => {
    return data.map((item) => (
      <TreeNode value={item.id} title={item.name}>
        {item.departments && renderTreeNode(item.departments)}
      </TreeNode>
    ));
  };

  const renderTreeCompany = (data: GT.Model.Company[]) => {
    return data.map( (item) => (
      <Option value={item.id} key={item.id}>{item.name}</Option>
      ));
  };

  return (
    <div>
      <Form form={form} className='search_form'>
        <Row>
          <Row className='search_form_items'>

            <Form.Item label='姓名' name='name'>
              <Input placeholder='请输入' />
            </Form.Item>

            <Form.Item label='IC卡号' name='icCardNo'>
              <Input placeholder='请输入' />
            </Form.Item>

            <Form.Item label='手机号' name='phone'>
              <Input placeholder='请输入'></Input>
            </Form.Item>

            <Form.Item label='性别' name='gender'>
              {renderSelect('gender')}
            </Form.Item>

            <Form.Item name='departmentIds' label='服务部门' style={{ width: 220 }}>
              <TreeSelect
                showSearch
                maxTagCount={1}
                treeNodeFilterProp={'title'}
                placeholder='请选择'
                multiple
                showArrow
                allowClear>
                {renderTreeNode(treeData || [])}
              </TreeSelect>
            </Form.Item>

            <Form.Item label='所属公司' name='companyId'>
              <Select
              placeholder={'请选择'}
              getPopupContainer={(node) => {
                if (node?.parentElement) {
                  return node.parentElement;
                }
                return document.body;
              }} allowClear={true}>
                {renderTreeCompany(companyList || [])}
              </Select>
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
      <PrivateComponent id={[319, 320, 321, 322]}>
        <p>
          <Space>
            <PrivateComponent id={319}>
              <Button type='primary' ghost onClick={onCreate}>
              新增服务人员
              </Button>
            </PrivateComponent>
            <PrivateComponent id={320}>
              <Button type='primary' ghost onClick={onImport}>
                批量导入
              </Button>
            </PrivateComponent>
            <PrivateComponent id={321}>
              <Button type='primary' ghost onClick={onExport} loading={exportLoading}>
                数据导出
              </Button>
            </PrivateComponent>
            <PrivateComponent id={322}>
              <Button type='primary' ghost disabled={!rows.length} onClick={() => onDelete(rows)}>
                批量删除
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
        rowSelection={{
          type: 'checkbox',
          onChange,
          fixed: true,
          selectedRowKeys: rows.map((item) => item.id),
        }}
        size='small'
        scroll={{ scrollToFirstRowOnChange: true, x: 1400 }}
      />
      <CreateServiceModal
        onRef={(ref) => (modal.current = ref)}
        onOk={refresh}
        orgTree={treeData || []}
        companyList = {companyList || []}
      />
      <ImportExcelModal type='service' onRef={(ref) => (importModal.current = ref)} onOk={refresh} />
      <UpdateServiceDeModal
        onRef={(ref) => (orgModal.current = ref)}
        orgTree={treeData || []}
        onOk={refresh}></UpdateServiceDeModal>
    </div>
  );
}
