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
import CreatePreStudentModal from './CreatePreStudent';
import ImportExcelModal from 'src/components/importModal';
import PrivateComponent from 'src/components/PrivateComponent';
interface Props {
  sectionId: number;
  enrollmentYear: number;
  classId: number;
}
export default function PreClassStudentList(props: Props) {
  const [rows, setRows] = useState<GT.Model.Student[]>([]);
  const { renderText, renderSelect } = useDictionary();
  const importModal = useRef<GT.Modal.Ref>();
  const { download } = useDownload();
  const createModal = useRef<GT.Modal.Ref>();
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    return api.student.getPage({
      ...formData,
      ...props,
      scope: 1,
      all: true,
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
      title: 'IC卡号',
      dataIndex: 'icCardNo',
      align: 'center',
    },
    {
      title: '证件类型',
      dataIndex: 'idType',
      render: (value) => renderText('idType', value),
      align: 'center',
    },
    {
      title: '证件号码',
      dataIndex: 'idNo',
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      render: (text, record) => (
        <Space>
          <PrivateComponent id={274}>
            <Button type='link' onClick={() => onEdit(record)}>
              编辑
            </Button>
          </PrivateComponent>
          <PrivateComponent id={275}>
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
      classId: record.classId,
    });
  };

  const onDelete = (records: GT.Model.Student[]) => {
    Modal.confirm({
      title: '删除后将清空该学生在平台内所有数据 且无法恢复，确认删除该学生吗？',
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
      .exportPre({
        scope: 1,
        sectionId: props.sectionId,
        enrollmentYear: props.enrollmentYear,
        classId: props.classId,
        all: true,
      })
      .then(download);
  };
  return (
    <div>
      <p>
        <b>班级列表</b>
      </p>
      <PrivateComponent id={[269, 271, 272, 273]}>
        <p>
          <Space>
            <PrivateComponent id={269}>
              <Button type='primary' ghost onClick={onCreate}>
                新增预备生
              </Button>
            </PrivateComponent>
            <PrivateComponent id={271}>
              <Button type='primary' ghost onClick={onImport}>
                批量导入
              </Button>
            </PrivateComponent>
            <PrivateComponent id={272}>
              <Button type='primary' ghost onClick={onExport}>
                数据导出
              </Button>
            </PrivateComponent>
            <PrivateComponent id={273}>
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
      <CreatePreStudentModal
        defaultClassId={props.classId}
        sectionId={props.sectionId}
        enrollmentYear={props.enrollmentYear}
        onRef={(ref) => (createModal.current = ref)}
        onOk={refresh}></CreatePreStudentModal>
      <ImportExcelModal
        studentQuery={{ sectionId: props.sectionId, classId: props.classId }}
        type='prestudent'
        onRef={(ref) => (importModal.current = ref)}
        onOk={refresh}
      />
    </div>
  );
}
