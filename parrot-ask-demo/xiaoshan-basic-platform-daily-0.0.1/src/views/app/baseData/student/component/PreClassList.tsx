import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { Button, Form, Input, message, Modal, Row, Select, Space, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import React, { useEffect, useRef, useState } from 'react';
import api from 'src/api';
import appStyle from 'src/App.style';
import ImportExcelModal from 'src/components/importModal';
import PrivateComponent from 'src/components/PrivateComponent';
import constant from 'src/constant';
import useDictionary from 'src/hook/useDictionary';
import useDownload from 'src/hook/useDownload';
import GT from 'types';
import CreatePreClassModal from './CreatePreClass';
import CreatePreStudentModal from './CreatePreStudent';
import ExchangeStudentModal from './ExchangeStudent';
interface ClassListProps {
  sectionId: number;
  enrollmentYear: number;
  onCheck?: (record: string) => void;
  node: any;
  onRefresh?: () => void;
}
export default function PreClassList(props: ClassListProps) {
  const [form] = Form.useForm<GT.DTO.SearchClassParams>();
  const createModal = useRef<GT.Modal.Ref>();
  const importModal = useRef<GT.Modal.Ref>();
  const createStu = useRef<GT.Modal.Ref>();
  const exchangeModal = useRef<GT.Modal.Ref>();
  const { download } = useDownload();
  const { renderSelect, renderText } = useDictionary();
  const [rows, setRows] = useState<GT.Model.Class[]>([]);
  const [statistic, setStatistic] = useState<GT.Model.SectionStatistic>();
  useEffect(() => {
    api.section
      .getStatistics(props.sectionId, {
        params: {
          enrollmentYear: props.enrollmentYear,
        },
      })
      .then((res) => {
        setStatistic(res[0]);
      });
  }, []);
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) =>
    api.classes.getPage({
      ...formData,
      sectionId: props.sectionId,
      enrollmentYear: props.enrollmentYear,
      current,
      size,
    });

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
    refreshDeps: [props.sectionId, props.enrollmentYear],
  });

  const onCheck = (record: GT.Model.Class) => {
    props.onCheck?.(`${record.sectionId}-${record.id}`);
  };
  const { reset, submit } = search;
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  const columns: ColumnType<GT.Model.Class>[] = [
    {
      title: '班级名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '学生数量',
      dataIndex: 'studentCount',
      align: 'center',
    },
    {
      title: '班主任',
      dataIndex: 'headTeacherName',
      align: 'center',
    },
    {
      title: '班级教室',
      dataIndex: 'roomName',
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      render: (text, record) => (
        <Space>
          <PrivateComponent id={263}>
            <Button type='link' onClick={() => onCheck(record)}>
              查看
            </Button>
          </PrivateComponent>
          <PrivateComponent id={264}>
            <Button type='link' onClick={() => onEdit(record)}>
              编辑
            </Button>
          </PrivateComponent>
          <PrivateComponent id={265}>
            <Button type='link' danger onClick={() => onDelete([record])}>
              删除
            </Button>
          </PrivateComponent>
        </Space>
      ),
    },
  ];
  const onCreate = () => {
    createModal.current?.setTitle('新增班级');
    api.classes
      .getPage({
        current: -1,
        size: -1,
        sectionId: props.sectionId,
      })
      .then((res) => {
        createModal.current?.form?.setFieldsValue({
          sectionId: props.sectionId,
          orderNumber: res.list.length && res.list[res.list.length - 1].orderNumber + 1,
        });
        createModal.current?.setVisible(true);
      });
  };
  const onCreateStudent = () => {
    createStu.current?.setVisible(true);
    createStu.current?.setTitle('新增预备生');
  };
  const onEdit = (record: GT.Model.Class) => {
    createModal.current?.setVisible(true);
    createModal.current?.setTitle('编辑班级');
    createModal.current?.form?.setFieldsValue({
      sectionId: props.sectionId,
      building: record.roomId ? [record.buildingId, record.floorId, record.roomId] : null,
      ...record,
    });
    if (record.headTeacherId) {
      api.teacher.get(record.headTeacherId).then((t) => {
        createModal.current?.setTeachers([t]);
      });
    }

    // createModal.current?.onSearch(record.headTeacherName);
  };
  const onDelete = (records: GT.Model.Class[]) => {
    if (records.some((item) => item.studentCount)) {
      return Modal.info({
        title: '班级学生数量不为0，请先删除该班级全部学生，再删除该班级。',
      });
    }
    Modal.confirm({
      title: '删除后将无法恢复，确认删除该班级吗？',
      onOk: () => {
        api.classes.delete({ data: records.map((record) => record.id) }).then(() => {
          message.success('删除成功');
          submit();
          props.onRefresh?.();
          setRows([]);
        });
      },
    });
  };
  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.Class[]) => {
    setRows(selectedRows);
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
        all: true,
      })
      .then(download);
  };
  return (
    <div>
      <p>
        <b>班级列表</b>
      </p>
      {props.enrollmentYear && statistic && (
        <p style={{ color: '#84878C', fontSize: 13 }}>
          {statistic.sectionName}，{statistic.classCount}个班级，{statistic.studentCount}位学生，
          {statistic.parentCount}位家长
        </p>
      )}
      <PrivateComponent id={[258, 259, 260, 261, 262]}>
        <p>
          <Space>
            <PrivateComponent id={258}>
              <Button ghost type='primary' onClick={onCreate}>
                新增预备班
              </Button>
            </PrivateComponent>
            <PrivateComponent id={259}>
              <Button ghost type='primary' onClick={onCreateStudent}>
                新增预备生
              </Button>
            </PrivateComponent>
            <PrivateComponent id={260}>
              <Button ghost type='primary' onClick={onImport}>
                批量导入预备生
              </Button>
            </PrivateComponent>
            <PrivateComponent id={261}>
              <Button ghost type='primary' onClick={onExport}>
                预备生数据导出
              </Button>
            </PrivateComponent>
            <PrivateComponent id={262}>
              <Button ghost type='primary' disabled={!rows.length} onClick={() => onDelete(rows)}>
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
      <CreatePreClassModal
        onRef={(ref) => (createModal.current = ref)}
        onOk={() => {
          refresh();
          props.onRefresh?.();
        }}
        sectionId={props.sectionId}
        enrollmentYear={props.enrollmentYear}
      />
      <CreatePreStudentModal
        onRef={(ref) => (createStu.current = ref)}
        sectionId={props.sectionId}
        enrollmentYear={props.enrollmentYear}
        onOk={refresh}></CreatePreStudentModal>
      <ImportExcelModal
        type='prestudent'
        onRef={(ref) => (importModal.current = ref)}
        onOk={refresh}
      />
    </div>
  );
}
