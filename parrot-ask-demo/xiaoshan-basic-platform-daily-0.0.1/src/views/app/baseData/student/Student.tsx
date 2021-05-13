import React, { useState, useRef } from 'react';
import {
  Table,
  Form,
  Input,
  Row,
  Col,
  Button,
  Avatar,
  Select,
  Space,
  Modal,
  message,
  TreeSelect,
  Cascader,
} from 'antd';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';
import useDownload from 'src/hook/useDownload';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import api from 'src/api';
import { ColumnType } from 'antd/es/table/interface';
import constant from 'src/constant';
import appStyle from 'src/App.style';
import { CascaderOptionType } from 'antd/lib/cascader';
import CreateStudentModal from './component/CreateStudent';
import ExchangeStudentModal from './component/ExchangeStudent';
import ImportExcelModal from 'src/components/importModal';
import PrivateComponent from 'src/components/PrivateComponent';
export default function StudentList() {
  const [form] = Form.useForm();
  const [options, setOptions] = useState<CascaderOptionType[]>([]);
  const [rows, setRows] = useState<GT.Model.Student[]>([]);
  const { renderText, renderSelect } = useDictionary();
  const { download } = useDownload();
  const createModal = useRef<GT.Modal.Ref>();
  const exchangeModal = useRef<GT.Modal.Ref>();
  const importModal = useRef<GT.Modal.Ref>();
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    const { org = [], ...rest } = formData;
    const [sectionType, enrollmentYear, classId] = org;
    return api.student.getPage({
      sectionType,
      enrollmentYear,
      classId,
      ...rest,
      scope: 1,
      current,
      size,
    });
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const { submit, reset } = search;
  const columns: ColumnType<GT.Model.Student>[] = [
    {
      title: '学段',
      dataIndex: 'sectionName',
      fixed: true,
      align: 'center',
    },
    {
      title: '年级',
      dataIndex: 'gradeName',
      align: 'center',
    },
    {
      title: '班级',
      dataIndex: 'className',
      align: 'center',
    },
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
          <PrivateComponent id={128}>
            <Button
              type='link'
              onClick={() => {
                message.info('该功能暂未开通，敬请期待');
              }}>
              学生档案
            </Button>
          </PrivateComponent>
          <PrivateComponent id={129}>
            <Button type='link' onClick={() => onEdit(record)}>
              编辑
            </Button>
          </PrivateComponent>
          <PrivateComponent id={130}>
            <Button type='link' onClick={() => onExchange([record])}>
              调班
            </Button>
          </PrivateComponent>
          <PrivateComponent id={131}>
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
  const loadData = (selectedOptions: CascaderOptionType[] | undefined) => {
    if (selectedOptions) {
      const target = selectedOptions[selectedOptions.length - 1];
      switch (target.type) {
        case 'section':
          target.value &&
            api.section
              .getGrades({
                params: {
                  sectionType: target.value,
                },
              })
              .then((grades) => {
                target.children =
                  grades?.map((grade) => ({
                    label: grade.name,
                    type: 'grade',
                    value: grade.enrollmentYear,
                    isLeaf: false,
                  })) || [];
                setOptions([...options]);
              });
          break;
        case 'grade':
          const [sectionType, enrollmentYear] = selectedOptions.map((item) => item.value);
          api.section
            .getClasses({ sectionType: sectionType as number, enrollmentYear })
            .then((classes) => {
              target.children = classes.map((c) => ({
                label: c.name,
                type: 'class',
                value: c.id,
              }));
              setOptions([...options]);
            });
          break;
      }
    }
  };
  const getSections = (open: boolean) => {
    if (open && !options.length) {
      api.section.getAll({ params: { all: false } }).then((sections) => {
        setOptions(
          sections.map((section) => ({
            label: section.name,
            value: section.id,
            type: 'section',
            isLeaf: false,
          })),
        );
      });
    }
  };
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
  const onExchange = (record: GT.Model.Student[]) => {
    const first = record[0];
    const isSameGrade = record.every((student) => student.enrollmentYear === first.enrollmentYear);
    if (isSameGrade) {
      exchangeModal.current?.setTitle(record.length > 1 ? '批量调班' : '调班');
      exchangeModal.current?.setVisible(true);
      exchangeModal.current?.form?.setFieldsValue({ students: [...record] });
    } else {
      message.warn('不同年级的学生不可以调班');
    }
  };
  const onImport = () => {
    importModal.current?.setVisible(true);
  };
  const onExport = () => {
    const { org = [], ...rest } = form.getFieldsValue();
    const [sectionType, enrollmentYear, classId] = org;
    api.student
      .export({
        ...rest,
        sectionType,
        enrollmentYear,
        classId,
        scope: 1,
      })
      .then((res) => {
        download(res);
      });
  };
  return (
    <div>
      <Form form={form} className='search_form'>
        <Row>
          <Row className='search_form_items'>
            <Form.Item label='学生组织' name='org'>
              <Cascader
                placeholder='请选择'
                loadData={loadData}
                options={options}
                changeOnSelect
                onPopupVisibleChange={getSections}></Cascader>
            </Form.Item>
            <Form.Item label='学号' name='studentNo'>
              <Input placeholder='请输入' />
            </Form.Item>
            <Form.Item label='IC卡号' name='icCardNo'>
              <Input placeholder='请输入' />
            </Form.Item>

            <Form.Item label='姓名' name='name'>
              <Input placeholder='请输入' />
            </Form.Item>

            <Form.Item label='性别' name='gender'>
              {renderSelect('gender')}
            </Form.Item>

            <Form.Item label='状态' name='state'>
              {renderSelect('studentState')}
            </Form.Item>
            <Form.Item label='学生类型' name='studentType'>
              {renderSelect('studentType')}
            </Form.Item>
            {/* <Form.Item label='住校情况' name='livingCondition'>
              {renderSelect('studentLivingCondition')}
            </Form.Item> */}
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
      <PrivateComponent id={[35, 36, 37, 38, 39]}>
        <p>
          <Space>
            <PrivateComponent id={35}>
              <Button type='primary' ghost onClick={onCreate}>
                新增学生
              </Button>
            </PrivateComponent>
            <PrivateComponent id={36}>
              <Button type='primary' ghost onClick={onImport}>
                批量导入
              </Button>
            </PrivateComponent>
            <PrivateComponent id={37}>
              <Button type='primary' ghost onClick={onExport}>
                数据导出
              </Button>
            </PrivateComponent>
            <PrivateComponent id={38}>
              <Button type='primary' ghost disabled={!rows.length} onClick={() => onExchange(rows)}>
                批量调班
              </Button>
            </PrivateComponent>
            <PrivateComponent id={39}>
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
      <CreateStudentModal onRef={(ref) => (createModal.current = ref)} onOk={refresh} />
      {/* <Exchange */}
      <ExchangeStudentModal
        onRef={(ref) => (exchangeModal.current = ref)}
        onOk={() => {
          refresh();
          setRows([]);
        }}
      />
      <ImportExcelModal
        type='student'
        onRef={(ref) => (importModal.current = ref)}
        onOk={refresh}
      />
    </div>
  );
}
