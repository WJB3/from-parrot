import { useRequest } from 'ahooks';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { Button, Cascader, Form, Input, message, Modal, Row, Space, TreeSelect, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import React, { useRef, useState } from 'react';
import api from 'src/api';
import appStyle from 'src/App.style';
import PrivateComponent from 'src/components/PrivateComponent';
import constant from 'src/constant';
import useDictionary from 'src/hook/useDictionary';
import useDownload from 'src/hook/useDownload';
import GT from 'types';
import BatchUploadAvatarModal from './component/BatchUploadAvatars';
import UploadAvatarModal from './component/UploadAvatars';
import UploadRecordsModal from './component/UploadRecords';
export default function FaceStudentPage() {
  const [form] = Form.useForm();
  const { download } = useDownload();
  const uploadModal = useRef<GT.Modal.Ref>();
  const batchModal = useRef<GT.Modal.Ref>();
  const checkModal = useRef<GT.Modal.Ref>();
  const { renderText, renderSelect } = useDictionary();

  const [rows, setRows] = useState<GT.Model.StudentFace[]>([]);
  const { data = [] } = useRequest(() => api.section.getTree({ all: false }));
  const handler = (list: any[]) => {
    return list.map((d) => {
      const r: any = {
        label: d.sectionName || d.gradeName || d.className,
        value: d.sectionType || d.enrollmentYear || d.classId,
      };
      if (d.nodes) {
        r.children = handler(d.nodes);
      }
      return r;
    });
  };
  const options = handler(data);
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    const { org = [], ...rest } = formData;
    const [sectionType, enrollmentYear, classId] = org || [];
    return api.student.getFacePage({
      ...rest,
      sectionType,
      enrollmentYear,
      classId,
      current,
      size,
    });
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const { submit, reset } = search;

  const onUpload = (record: GT.Model.StudentFace) => {
    api.student.getFaceStatus().then((status) => {
      if (status === 0) {
        uploadModal.current?.setVisible(true);
        uploadModal.current?.form?.setFieldsValue({ id: record.id });
      } else {
        message.warning('正在处理导入任务，请稍后再试');
      }
    });
  };
  const renderTreeNode = (data: GT.Model.Organization[]) => {
    return data.map((item) => (
      <TreeSelect.TreeNode value={item.id} title={item.name}>
        {item.departments && renderTreeNode(item.departments)}
      </TreeSelect.TreeNode>
    ));
  };
  const onExport = () => {
    const { org = [], ...rest } = form.getFieldsValue();
    const [sectionType, enrollmentYear, classId] = org || [];
    api.student
      .exportFace({
        ...rest,
        sectionType,
        enrollmentYear,
        classId,
        type: 1,
      })
      .then((res) => {
        download(res);
      });
  };
  const onCheck = (record: GT.Model.StudentFace) => {
    Modal.info({
      title: false,
      icon: false,
      maskClosable: true,
      content: <img src={record.url} width='100%' />,
      okButtonProps: { style: { display: 'none' } },
    });
  };
  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.StudentFace[]) => {
    setRows(selectedRows);
  };
  const onDelete = (records: GT.Model.StudentFace[]) => {
    Modal.confirm({
      title: '删除后该用户将不能通过人脸道闸正常进出校园，确认要删除照片吗？',
      onOk: () => {
        api.student.deleteFace(records.map((record) => record.id)).then(() => {
          message.success('删除成功');
          setRows([]);
          refresh();
        });
      },
    });
  };
  const onBatchImport = () => {
    api.student.getFaceStatus().then((status) => {
      if (status === 0) {
        batchModal.current?.setVisible(true);
      } else {
        message.warning('正在处理导入任务，请稍后再试');
      }
    });
  };
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  const columns: ColumnType<GT.Model.StudentFace>[] = [
    {
      title: '学段',
      align: 'center',
      dataIndex: 'sectionName',
    },
    {
      title: '年级',
      align: 'center',
      dataIndex: 'gradeName',
    },
    {
      title: '班级',
      align: 'center',
      dataIndex: 'className',
    },
    {
      title: '学号',
      align: 'center',
      dataIndex: 'studentNo',
    },
    {
      title: 'IC卡号',
      align: 'center',
      dataIndex: 'icCardNo',
    },
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'name',
    },

    {
      title: '性别',
      align: 'center',
      dataIndex: 'gender',
      render: (val) => renderText('gender', val),
    },

    {
      title: '本次下发结果',
      align: 'center',
      dataIndex: 'passResult',
      render: (val) => renderText('passResult', val),
    },
    {
      title: '通行权限',
      align: 'center',
      dataIndex: 'crossStatus',
      render: (val) => renderText('crossStatus', val),
    },
    {
      title: '描述',
      align: 'center',
      dataIndex: 'description',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Space>
          <PrivateComponent id={87}>
            <Button
              type='link'
              size='small'
              disabled={!record.fileId}
              onClick={() => onCheck(record)}>
              查看
            </Button>
          </PrivateComponent>
          <PrivateComponent id={117}>
            <Button
              type='link'
              size='small'
              disabled={record.deleteStatus !== 1 || record.downloadStatus !== 1}
              onClick={() => {
                onUpload(record);
              }}>
              上传
            </Button>
          </PrivateComponent>
          <PrivateComponent id={89}>
            <Button
              type='link'
              disabled={!record.fileId || record.deleteStatus !== 1 || record.downloadStatus !== 1}
              size='small'
              danger
              onClick={() => onDelete([record])}>
              删除照片
            </Button>
          </PrivateComponent>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <Form form={form} className='search_form'>
        <Row>
          <Row className='search_form_items'>
            <Form.Item label='关键词' name='keyWord' style={{ width: 250 }}>
              <Input placeholder='请输入学号/IC卡号/姓名' />
            </Form.Item>
            <Form.Item label='学生组织' name='org' style={{ width: 250 }}>
              <Cascader placeholder='请选择' options={options} changeOnSelect></Cascader>
            </Form.Item>
            <Form.Item label='本次下发结果' name='passResult'>
              {renderSelect('passResult')}
            </Form.Item>
            <Form.Item label='通行权限' name='crossStatus'>
              {renderSelect('crossStatus')}
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
      <PrivateComponent id={[86, 92, 119, 93]}>
        <p>
          <Space>
            <PrivateComponent id={86}>
              <Button type='primary' ghost onClick={onBatchImport}>
                批量导入照片
              </Button>
            </PrivateComponent>
            <PrivateComponent id={92}>
              <Button
                type='primary'
                ghost
                onClick={() => {
                  checkModal.current?.setVisible(true);
                }}>
                查看导入记录
              </Button>
            </PrivateComponent>
            <PrivateComponent id={119}>
              <Button type='primary' ghost onClick={onExport}>
                数据导出
              </Button>
            </PrivateComponent>
            <PrivateComponent id={93}>
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
        rowSelection={{
          type: 'checkbox',
          onChange,
          selectedRowKeys: rows.map((item) => item.id),
          getCheckboxProps: (record) => {
            return {
              disabled: !record.fileId || record.deleteStatus !== 1 || record.downloadStatus !== 1,
            };
          },
        }}
        {...tableProps}
        scroll={{ scrollToFirstRowOnChange: true }}
      />
      <UploadAvatarModal
        type='student'
        onRef={(ref) => (uploadModal.current = ref)}
        onOk={refresh}></UploadAvatarModal>
      <BatchUploadAvatarModal
        onRef={(ref) => (batchModal.current = ref)}
        onOk={refresh}
        type='student'></BatchUploadAvatarModal>
      <UploadRecordsModal
        type='student'
        onRef={(ref) => (checkModal.current = ref)}></UploadRecordsModal>
    </div>
  );
}
