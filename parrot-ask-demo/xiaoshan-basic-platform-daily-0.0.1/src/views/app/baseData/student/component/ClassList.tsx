//@ts-nocheck
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
import CreateStudentModal from './CreateStudent';
import GT from 'types';
import CreateClassModal from './CreateClass';
interface ClassListProps {
  sectionId?: number;
  enrollmentYear?: number;
  sections: any[];
  grades: any[];
  onCheck?: (record: string) => void;
  onRefresh?: () => void;
}
export default function ClassList(props: ClassListProps) {
  const [form] = Form.useForm<GT.DTO.SearchClassParams>();
  const createModal = useRef<GT.Modal.Ref>();
  const createStudentModal = useRef<GT.Modal.Ref>();
  const { renderSelect, renderText } = useDictionary();
  const [rows, setRows] = useState<GT.Model.Class[]>([]);
  const importModal = useRef<GT.Modal.Ref>();
  const { download } = useDownload();
  const [statistic, setStatistic] = useState<GT.Model.SectionStatistic>();
  const [grades, setGrades] = useState<GT.Model.Grade[]>([]);
  const [building, setBuilding] = useState([]);
  useEffect(() => {
    if (props.sectionId) {
      api.section
        .getGrades({
          params: {
            sectionId: props.sectionId,
          },
        })
        .then((res) => setGrades(res));
      if (props.enrollmentYear) {
        api.section
          .getStatistics(props.sectionId, {
            params: {
              enrollmentYear: props.enrollmentYear,
            },
          })
          .then((res) => {
            setStatistic(res.find((item) => item.enrollmentYear === props.enrollmentYear));
          });
      }
    }
  }, [props.sectionId, props.enrollmentYear]);
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) =>
    api.classes.getPage({
      sectionId: props.sectionId,
      enrollmentYear: props.enrollmentYear,
      ...formData,
      current,
      size,
    });

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
    refreshDeps: [props.sectionId, props.enrollmentYear],
  });

  const { reset, submit } = search;
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  const columns: ColumnType<GT.Model.Class>[] = [
    {
      title: '????????????',
      dataIndex: 'sectionName',
      align: 'center',
    },
    {
      title: '????????????',
      dataIndex: 'enrollmentYear',
      align: 'center',
    },
    {
      title: '??????',
      dataIndex: 'gradeName',
      align: 'center',
    },
    {
      title: '??????',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '????????????',
      dataIndex: 'studentCount',
      align: 'center',
    },
    {
      title: '?????????',
      dataIndex: 'headTeacherName',
      align: 'center',
    },
    {
      title: '????????????',
      dataIndex: 'classType',
      align: 'center',
      render: (text) => renderText('classType', text),
    },
    {
      title: '????????????',
      dataIndex: 'roomName',
      align: 'center',
    },
    {
      title: '??????',
      fixed: 'right',
      align: 'center',
      render: (text, record) => (
        <Space>
          {props.enrollmentYear && (
            <PrivateComponent id={136}>
              <Button type='link' onClick={() => onCheck(record)}>
                ??????
              </Button>
            </PrivateComponent>
          )}

          <PrivateComponent id={props.enrollmentYear ? 137 : 134}>
            <Button type='link' onClick={() => onEdit(record)}>
              ??????
            </Button>
          </PrivateComponent>
          <PrivateComponent id={props.enrollmentYear ? 138 : 135}>
            <Button type='link' danger onClick={() => onDelete([record])}>
              ??????
            </Button>
          </PrivateComponent>
        </Space>
      ),
    },
  ];
  const onCheck = (record: GT.Model.Class) => {
    props.onCheck?.(`${record.sectionId}-${record.enrollmentYear}-${record.id}`);
  }; 
  const onCreate = () => {
    createModal.current?.setTitle('????????????');
    createModal.current?.form?.setFieldsValue({
      sectionId: props.sectionId,
      enrollmentYear: props.enrollmentYear,
    });
    createModal.current?.setFormData({
      sectionId: props.sectionId,
      enrollmentYear: props.enrollmentYear,
    });
    createModal.current?.setVisible(true);
  };
  const onEdit = (record: GT.Model.Class) => {
    console.log("--record--", record)
    createModal.current?.setTitle('????????????');
    createModal.current?.form?.setFieldsValue({
      sectionId: props.sectionId,
      building: record.roomId ? [record.buildingId, record.floorId, record.roomId] : null,
      ...record,
    });
    // let temp = record.roomId ? [record.buildingId, record.floorId, record.roomId] : null
    // setBuilding(temp)
    createModal.current?.setFormData(record);
    if (record.headTeacherId) {
      api.teacher.get(record.headTeacherId).then((t) => {
        createModal.current?.setTeachers([t]);
      });
    }
    createModal.current?.setVisible(true);
  };
  const onDelete = (records: GT.Model.Class[]) => {
    if (records.some((item) => item.studentCount)) {
      return Modal.info({
        title: '????????????????????????0????????????????????????????????????????????????????????????',
      });
    }
    Modal.confirm({
      title: '??????????????????????????????????????????????????????',
      onOk: () => {
        api.classes.delete({ data: records.map((record) => record.id) }).then(() => {
          message.success('????????????');
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
      .export({
        enrollmentYear: props.enrollmentYear,
        sectionId: props.sectionId,
        ...form.getFieldsValue(),
        scope: 1,
      })
      .then((res) => {
        download(res);
      });
  };
  const onClassExport = () => {
    api.classes
      .export({
        sectionId: props.sectionId,
        enrollmentYear: props.enrollmentYear,
        ...form.getFieldsValue(),
      })
      .then((res) => {
        download(res);
      });
  };

  console.log("--building--", building);

  const onCreateStudent = () => {
    createStudentModal.current?.setTitle('????????????');
    createStudentModal.current?.setVisible(true);
  };
  console.log("--props--",props)
  return (
    <div>
      <p>
        <b>????????????</b>
      </p>
      {props.enrollmentYear && statistic && (
        <p style={{ color: '#84878C', fontSize: 13 }}>
          {statistic.gradeName}???{statistic.classCount}????????????{statistic.studentCount}????????????
          {statistic.parentCount}?????????
        </p>
      )}
      {/* enrollmentYear???????????????????????????????????????????????????????????? */}
      {!props.enrollmentYear && (
        <Form form={form} className='search_form'>
          <Row>
            <Row className='search_form_items'>
              <Form.Item label='??????' name='enrollmentYear'>
                <Select placeholder='?????????'>
                  {grades.map((grade) => (
                    <Select.Option value={grade.enrollmentYear}> {grade.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label='????????????' name='classType'>
                {renderSelect('classType')}
              </Form.Item>
              <Form.Item label='?????????' name='headTeacherName'>
                <Input placeholder='?????????' />
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
      )}
      {/* props.enrollmentYear ???????????????????????????????????? ???????????? ?????? ???????????? */}
      <PrivateComponent id={props.enrollmentYear ? [49, 51, 55, 56, 57] : [42, 43, 46, 47, 48]}>
        <p>
          <Space>
            <PrivateComponent id={props.enrollmentYear ? 49 : 42}>
              <Button ghost type='primary' onClick={onCreate}>
                ????????????
              </Button>
            </PrivateComponent>

            <PrivateComponent id={props.enrollmentYear ? 49 : null}>
              <Button ghost type='primary' onClick={onCreateStudent}>
                ????????????
              </Button>
            </PrivateComponent>
          
            <PrivateComponent id={props.enrollmentYear ? 51 : 43}>
              <Button ghost type='primary' onClick={onImport}>
                ??????????????????
              </Button>
            </PrivateComponent>
            <PrivateComponent id={props.enrollmentYear ? 51 : 43}>
              <Button ghost type='primary' onClick={() => refresh()}>
                ??????????????????
              </Button>
            </PrivateComponent>
            <PrivateComponent id={props.enrollmentYear ? 55 : 46}>
              <Button ghost type='primary' onClick={onClassExport}>
                ??????????????????
              </Button>
            </PrivateComponent>
            <PrivateComponent id={props.enrollmentYear ? 56 : 47}>
              <Button ghost type='primary' onClick={onExport}>
                ??????????????????
              </Button>
            </PrivateComponent>
            <PrivateComponent id={props.enrollmentYear ? 57 : 48}>
              <Button ghost type='primary' disabled={!rows.length} onClick={() => onDelete(rows)}>
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
        rowSelection={{ type: 'checkbox', onChange, selectedRowKeys: rows.map((item) => item.id) }}
        size='small'
        scroll={{ scrollToFirstRowOnChange: true }}
      />
     <CreateStudentModal
        defaultClassId={[props.sectionId, props.enrollmentYear, props.classId]}
        onRef={(ref) => (createStudentModal.current = ref)}
        mode="class"
      >
      </CreateStudentModal>
      <CreateClassModal
        onRef={(ref) => (createModal.current = ref)}
        onOk={() => {
          refresh();
          props.onRefresh?.();
        }}
        gradeDisabled={!!props.enrollmentYear}
        sections={props.sections}
        grades={props.grades}
        // building={building}
      />
      <ImportExcelModal
        type='student'
        studentQuery={{
          sectionId: props.sectionId,
          enrollmentYear: props.enrollmentYear,
        }}
        onRef={(ref) => (importModal.current = ref)}
        onOk={refresh}
      />
    </div>
  );
}
