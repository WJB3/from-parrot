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
    modal.current?.setTitle('??????????????????');
    modal.current?.form?.setFieldsValue(value);
  };
  const onDelete = (records: GT.Model.Service[]) => {
    Modal.confirm({
      title: '????????????????????????????????????????????????????????????????????????????????????????????????',
      onOk: () => {
        api.service.delete({ data: records.map((record) => record.id) }).then(() => {
          message.success('????????????');
          setRows([]);
          submit();
        });
      },
    });
  };
  const columns: ColumnType<GT.Model.Service>[] = [
    {
      title: '??????',
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
    },
    {
      title: 'IC??????',
      dataIndex: 'icCardNo',
      align: 'center',
    },
    {
      title: '??????',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '????????????',
      dataIndex: 'idNo',
      align: 'center',
    },
    {
      title: '??????',
      dataIndex: 'gender',
      render: (value) => renderText('gender', value),
      align: 'center',
    },
    {
      title: '??????',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: '??????',
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
              ?????????
            </Button>
          </PrivateComponent>
        );
      },
    },
    {
      title: '????????????',
      dataIndex: 'companyName',
      align: 'center',
    },
    {
      title: '??????',
      fixed: 'right',
      align: 'center',
      width: 250,
      render: (text, record) => (
        <Space>
          <PrivateComponent id={323}>
            <Button type='link' onClick={() => onEdit(record)}>
              ??????
            </Button>
          </PrivateComponent>
          <PrivateComponent id={324}>
            <Button type='link' danger onClick={() => onDelete([record])}>
              ??????
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
    modal.current?.setTitle('??????????????????');
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

            <Form.Item label='??????' name='name'>
              <Input placeholder='?????????' />
            </Form.Item>

            <Form.Item label='IC??????' name='icCardNo'>
              <Input placeholder='?????????' />
            </Form.Item>

            <Form.Item label='?????????' name='phone'>
              <Input placeholder='?????????'></Input>
            </Form.Item>

            <Form.Item label='??????' name='gender'>
              {renderSelect('gender')}
            </Form.Item>

            <Form.Item name='departmentIds' label='????????????' style={{ width: 220 }}>
              <TreeSelect
                showSearch
                maxTagCount={1}
                treeNodeFilterProp={'title'}
                placeholder='?????????'
                multiple
                showArrow
                allowClear>
                {renderTreeNode(treeData || [])}
              </TreeSelect>
            </Form.Item>

            <Form.Item label='????????????' name='companyId'>
              <Select
              placeholder={'?????????'}
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
                ??????
              </Button>
              <Button onClick={reset}>??????</Button>
            </Space>
          </Form.Item>
        </Row>
      </Form>
      <PrivateComponent id={[319, 320, 321, 322]}>
        <p>
          <Space>
            <PrivateComponent id={319}>
              <Button type='primary' ghost onClick={onCreate}>
              ??????????????????
              </Button>
            </PrivateComponent>
            <PrivateComponent id={320}>
              <Button type='primary' ghost onClick={onImport}>
                ????????????
              </Button>
            </PrivateComponent>
            <PrivateComponent id={321}>
              <Button type='primary' ghost onClick={onExport} loading={exportLoading}>
                ????????????
              </Button>
            </PrivateComponent>
            <PrivateComponent id={322}>
              <Button type='primary' ghost disabled={!rows.length} onClick={() => onDelete(rows)}>
                ????????????
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
