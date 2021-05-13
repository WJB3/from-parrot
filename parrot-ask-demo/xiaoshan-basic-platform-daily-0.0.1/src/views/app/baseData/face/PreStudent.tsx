import { useRequest } from 'ahooks';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import {
  Button,
  Cascader,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  TreeSelect,
  Table,
  Select,
} from 'antd';
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
export default function FacePreStudentPage() {
  const [form] = Form.useForm();
  const { download } = useDownload();
  const uploadModal = useRef<GT.Modal.Ref>();
  const batchModal = useRef<GT.Modal.Ref>();
  const checkModal = useRef<GT.Modal.Ref>();
  const { renderText, renderSelect } = useDictionary();
  const [classes, setClasses] = useState<GT.Model.Class[]>();
  const [rows, setRows] = useState<GT.Model.PreStudentFace[]>([]);
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    const { ...rest } = formData;

    return api.student.getPreFacePage({
      ...rest,

      current,
      size,
    });
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const { submit, reset } = search;
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  const onUpload = (record: GT.Model.PreStudentFace) => {
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
    api.student
      .exportFace({
        ...form.getFieldsValue(),
        type: 2,
      })
      .then((res) => {
        download(res);
      });
  };
  const onCheck = (record: GT.Model.PreStudentFace) => {
    Modal.info({
      title: false,
      icon: false,
      maskClosable: true,
      content: <img src={record.url} width='100%' />,
      okButtonProps: { style: { display: 'none' } },
    });
  };
  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.PreStudentFace[]) => {
    setRows(selectedRows);
  };
  const onDelete = (records: GT.Model.PreStudentFace[]) => {
    Modal.confirm({
      title: '删除后该用户将不能通过人脸道闸正常进出校园，确认要删除照片吗？',
      onOk: () => {
        api.student.deleteFace(records.map((record) => record.id)).then(() => {
          message.success('删除成功');
          setRows([]);
          submit();
        });
      },
    });
  };
  const getClasses = (open: boolean) => {
    if (open) {
      api.section.getClasses({ prepare: true }).then((res) => {
        setClasses(res);
      });
    }
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
  const columns: ColumnType<GT.Model.PreStudentFace>[] = [
    {
      title: '班级',
      align: 'center',
      dataIndex: 'className',
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
      title: '证件类型',
      align: 'center',
      dataIndex: 'idTypeName',
    },
    {
      title: '证件号码',
      align: 'center',
      dataIndex: 'idNo',
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
          <PrivateComponent id={97}>
            <Button
              type='link'
              size='small'
              disabled={!record.fileId}
              onClick={() => onCheck(record)}>
              查看
            </Button>
          </PrivateComponent>
          <PrivateComponent id={98}>
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
          <PrivateComponent id={99}>
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
            <Form.Item label='关键词' name='keyWord' style={{ width: 270 }}>
              <Input placeholder='请输入IC卡号/姓名/证件号码' />
            </Form.Item>
            <Form.Item label='班级' name='classId'>
              <Select
                onDropdownVisibleChange={getClasses}
                optionFilterProp='children'
                allowClear
                placeholder='请选择'>
                {classes?.map((c) => (
                  <Select.Option value={c.id}>{c.name}</Select.Option>
                ))}
              </Select>
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
      <PrivateComponent id={[88, 94, 95, 96]}>
        <p>
          <Space>
            <PrivateComponent id={88}>
              <Button type='primary' ghost onClick={onBatchImport}>
                批量导入照片
              </Button>
            </PrivateComponent>
            <PrivateComponent id={94}>
              <Button
                type='primary'
                ghost
                onClick={() => {
                  checkModal.current?.setVisible(true);
                }}>
                查看导入记录
              </Button>
            </PrivateComponent>
            <PrivateComponent id={95}>
              <Button type='primary' ghost onClick={onExport}>
                数据导出
              </Button>
            </PrivateComponent>
            <PrivateComponent id={96}>
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
        type='prestudent'
        onRef={(ref) => (uploadModal.current = ref)}
        onOk={refresh}></UploadAvatarModal>
      <BatchUploadAvatarModal
        onRef={(ref) => (batchModal.current = ref)}
        onOk={refresh}
        type='prestudent'></BatchUploadAvatarModal>
      <UploadRecordsModal
        type='prestudent'
        onRef={(ref) => (checkModal.current = ref)}></UploadRecordsModal>
    </div>
  );
}
