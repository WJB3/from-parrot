import React, { useEffect, useRef, useState } from 'react';
import { Table, Form, Input, Row, Button, Space, Modal, message, Dropdown, Menu, TreeSelect } from 'antd';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable, useRequest } from 'ahooks';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Store } from 'antd/lib/form/interface';
import GT from 'types';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import api from 'src/api';
import constant from 'src/constant';
import useDictionary from 'src/hook/useDictionary';
import CreateTeacherModal from './component/CreateTeacher';
import useDownload from 'src/hook/useDownload';
import ImportTeacherModal from './component/ImportTeacher';
import { TreeNode } from 'antd/lib/tree-select';
import ImportExcelModal from 'src/components/importModal';
import PrivateComponent from 'src/components/PrivateComponent';
import UpdateTeacherOrgModal from './component/UpdateTeacherOrg';
import OneLineText from 'src/components/OneLineText';

export default function TeacherList() {
  const [form] = Form.useForm<GT.DTO.SearchTeacherParams>();
  const [rows, setRows] = useState<GT.Model.Teacher[]>([]);
  const { renderText, renderSelect } = useDictionary();
  const [exportLoading, setExportLoading] = useState(false);
  const { download } = useDownload();
  const { data: treeData } = useRequest(api.organization.getAll);

  const [sort,setSort]=useState(0);

  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) =>
    api.teacher.getPage({
      ...formData,
      departmentIds: formData.departmentIds?.join(',') || null,
      current,
      size,
      sort
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
    modal.current?.setTitle('????????????');
    modal.current?.form?.setFieldsValue(value);
  };
  const onDelete = (records: GT.Model.Teacher[]) => {
    Modal.confirm({
      title: '??????????????????????????????????????????????????? ?????????????????????????????????????????????',
      onOk: () => {
        api.teacher.delete({ data: records.map((record) => record.id) }).then(() => {
          message.success('????????????');
          setRows([]);
          submit();
        });
      },
    });
  };
  const columns: ColumnType<GT.Model.Teacher>[] = [
    {
      title: '??????',
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
    },
    {
      title: '?????????',
      dataIndex: 'employeeNo',
      align: 'center',
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
      title: '??????',
      dataIndex: 'phone',
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
      dataIndex: 'budgetedPost',
      render: (value) => renderText('budgetedPost', value),
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
          <PrivateComponent id={71}>
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
      title: '??????',
      fixed: 'right',
      align: 'center',
      width: 250,
      render: (text, record) => (
        <Space>
          <PrivateComponent id={70}>
            <Button
              type='link'
              onClick={() => {
                message.info('????????????????????????????????????');
              }}>
              ????????????
            </Button>
          </PrivateComponent>
          <PrivateComponent id={71}>
            <Button type='link' onClick={() => onEdit(record)}>
              ??????
            </Button>
          </PrivateComponent>
          <PrivateComponent id={72}>
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
    modal.current?.setTitle('????????????');
    modal.current?.setVisible(true);
  };
  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.Teacher[]) => {
    setRows(selectedRows);
  };
  const onExport = () => {
    const searchParams = form.getFieldsValue();
    setExportLoading(true);
    api.teacher
      .export({
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

  const handleMenuClick = (value:any) => {
    console.log("menuClick",value)
    setSort(value.key) 
  }

  useEffect(()=>{
    refresh()
  },[sort])

  const downButtonStyle = {
    'height': '32px',
    'font-size': '13px',
    'font-family': 'PingFang SC',
    'font-weight': 400,
    'line-height': '18px',
    'color': '#5781F2',
    'background': 'rgba(87, 129, 242, 0.1)',
    'border-radius': '3px',
    border: '1px solid #5781F2',
    opacity: 1
  }


  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key={0}>
        ????????????
      </Menu.Item>
      <Menu.Item key={1}  >
        ????????????
      </Menu.Item>
      <Menu.Item key={2} >
        ???????????????
      </Menu.Item>
    </Menu>
  );

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

            <Form.Item label='??????' name='budgetedPost'>
              {renderSelect('budgetedPost')}
            </Form.Item>
            <Form.Item name='departmentIds' label='??????' style={{ width: 220 }}>
              <TreeSelect
                showSearch
                maxTagCount={1}
                treeNodeFilterProp={'title'}
                placeholder='?????????'
                multiple
                showArrow>
                {renderTreeNode(treeData || [])}
              </TreeSelect>
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
      <PrivateComponent id={[19, 20, 21, 22]}>
        <p>
          <Space>
            <PrivateComponent id={19}>
              <Button type='primary' ghost onClick={onCreate}>
                ????????????
              </Button>
            </PrivateComponent>
            <PrivateComponent id={20}>
              <Button type='primary' ghost onClick={onImport}>
                ????????????
              </Button>
            </PrivateComponent>
            <PrivateComponent id={21}>
              <Button type='primary' ghost onClick={onExport} loading={exportLoading}>
                ????????????
              </Button>
            </PrivateComponent>
            <PrivateComponent id={22}>

              <Button type='primary' ghost disabled={!rows.length} onClick={() => onDelete(rows)}>
                ????????????
              </Button>

            </PrivateComponent>
          </Space>

          <PrivateComponent id={22}>
            <Dropdown overlay={menu}>
              <div style={{ float: 'right' }}>
                <Button style={downButtonStyle}>
                  {sort==0?'????????????':sort==1?'????????????':'???????????????'} <DownOutlined />
                </Button>
              </div>
            </Dropdown>
          </PrivateComponent>
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
      <CreateTeacherModal
        onRef={(ref) => (modal.current = ref)}
        onOk={refresh}
        orgTree={treeData?.slice(0, treeData.length - 1) || []}
      />
      <ImportExcelModal onRef={(ref) => (importModal.current = ref)} onOk={refresh} />
      <UpdateTeacherOrgModal
        onRef={(ref) => (orgModal.current = ref)}
        orgTree={treeData?.slice(0, treeData.length - 1) || []}
        onOk={refresh}></UpdateTeacherOrgModal>
    </div>
  );
}
