import React, { useState, useRef } from 'react';
import { Table, Form, Button, Space, Modal, message } from 'antd';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';
import useDownload from 'src/hook/useDownload';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import api from 'src/api';
import { ColumnType } from 'antd/es/table/interface';
import constant from 'src/constant';
import appStyle from 'src/App.style';
import CreateStudentModal from './CreateStudent';
import ImportExcelModal from 'src/components/importModal';
import PrivateComponent from 'src/components/PrivateComponent';
interface Props {
  sectionId: number;
  enrollmentYear: number;
  classId: number;
}
export default function ClassStudentList(props: Props) {
  const [rows, setRows] = useState<GT.Model.Student[]>([]);
  const { renderText, renderSelect } = useDictionary();
  const { download } = useDownload();
  const importModal = useRef<GT.Modal.Ref>();
  const createModal = useRef<GT.Modal.Ref>();
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    return api.student.getPage({
      ...formData,
      ...props,
      scope: 1,
      current,
      size,
    });
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    refreshDeps: [props.sectionId, props.enrollmentYear, props.classId],
  });
  const { submit, reset } = search;
  const columns: ColumnType<GT.Model.Student>[] = [
    {
      title: '学号',
      dataIndex: 'studentNo',
      align: 'center',
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
      title: '性别',
      dataIndex: 'gender',
      render: (value) => renderText('gender', value),
      align: 'center',
    },
    {
      title: '学生类型',
      dataIndex: 'studentType',
      render: (value) => renderText('studentType', value),
      align: 'center',
    },
    // {
    //   title: '住校情况',
    //   dataIndex: 'livingCondition',
    //   render: (value) => renderText('studentLivingCondition', value),
    //   align: 'center',
    // },
    {
      title: '状态',
      dataIndex: 'state',
      render: (value) => renderText('studentState', value),
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      render: (text, record) => (
        <Space>
          <PrivateComponent id={142}>
            <Button
              type='link'
              onClick={() => {
                message.info('该功能暂未开通，敬请期待');
              }}>
              学生档案
            </Button>
          </PrivateComponent>
          <PrivateComponent id={143}>
            <Button type='link' onClick={() => onEdit(record)}>
              编辑
            </Button>
          </PrivateComponent>
          <PrivateComponent id={144}>
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
  // event

  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.Student[]) => {
    setRows(selectedRows);
  };
  const onEdit = (record: GT.Model.Student) => {
    createModal.current?.setVisible(true);
    createModal.current?.setTitle('编辑学生');
    createModal.current?.form?.setFieldsValue({
      ...record,
      classId: [record.sectionId, record.enrollmentYear, record.classId],
    });
  };

  const onDelete = (records: GT.Model.Student[]) => {
    Modal.confirm({
      title: '删除后将清空该学生在平台内所有数据 且无法恢复，确认删除该学生吗？',
      content: '（如需调班请联系年级组长或管理员）',
      onOk: () => {
        api.student.delete({ data: records.map((record) => record.id) }).then(() => {
          message.success('删除成功');
          submit();
          setRows([]);
        });
      },
    });
  };
  const onCreate = () => {
    createModal.current?.setTitle('新增学生');
    createModal.current?.setVisible(true);
  };
  const onImport = () => {
    importModal.current?.setVisible(true);
  };
  const onExport = () => {
    api.student
      .export({
        ...props,
        scope: 1,
      })
      .then((res) => {
        download(res);
      });
  };
  return (
    <div>
      <p>
        <b>班级列表</b>
      </p>
      <PrivateComponent id={[58, 59, 60, 61]}>
        <p>
          <Space>
            <PrivateComponent id={58}>
              <Button type='primary' ghost onClick={onCreate}>
                新增学生
              </Button>
            </PrivateComponent>
            <PrivateComponent id={59}>
              <Button type='primary' ghost onClick={onImport}>
                批量导入
              </Button>
            </PrivateComponent>
            <PrivateComponent id={60}>
              <Button type='primary' ghost onClick={onExport}>
                数据导出
              </Button>
            </PrivateComponent>
            <PrivateComponent id={61}>
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
        rowSelection={{ type: 'checkbox', onChange, selectedRowKeys: rows.map((item) => item.id) }}
        size='small'
        scroll={{ scrollToFirstRowOnChange: true }}
      />
      <CreateStudentModal
        defaultClassId={[props.sectionId, props.enrollmentYear, props.classId]}
        onRef={(ref) => (createModal.current = ref)}
        onOk={refresh}></CreateStudentModal>
      <ImportExcelModal
        type='student'
        studentQuery={{
          sectionId: props.sectionId,
          enrollmentYear: props.enrollmentYear,
          classId: props.classId,
        }}
        onRef={(ref) => (importModal.current = ref)}
        onOk={refresh}></ImportExcelModal>
    </div>
  );
}
