import React, { useState, useRef } from 'react';
import {
  Table,
  Form,
  Input,
  Row,
  Button,
  Space,
  Cascader,
  Dropdown,
  Menu,
  Modal,
  message,
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
import CreateParentModal from './component/CreateParent';
import PrivateComponent from 'src/components/PrivateComponent';
import ImportExcelModal from 'src/components/importModal';
import { DownOutlined } from '@ant-design/icons';

export default function ParentPage() {
  const [form] = Form.useForm();
  const [options, setOptions] = useState<CascaderOptionType[]>([]);
  const { renderText } = useDictionary();
  const { download } = useDownload();
  const createModal = useRef<GT.Modal.Ref>();
  const importModal = useRef<GT.Modal.Ref>();
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    const { org = [], ...rest } = formData;
    const [sectionType, enrollmentYear, classId] = org || [];
    return api.student.getPage({
      sectionType,
      enrollmentYear,
      classId,
      ...rest,
      scope: 2,
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
      title: '学生姓名',
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
      title: '家长1',
      dataIndex: 'parents',
      render: (parents?: GT.Model.Parent[]) => {
        const parent = parents?.filter((p) => p.number === 1)[0];
        return (
          <div>
            <div>{parent?.name}</div>
            <div>{parent?.relation}</div>
            <div>{parent?.phone}</div>
            <div>{parent?.unit}</div>
          </div>
        );
      },
      align: 'center',
    },
    {
      title: '家长2',
      dataIndex: 'parents',
      render: (parents: GT.Model.Parent[]) => {
        const parent = parents?.filter((p) => p.number === 2)[0];
        return (
          <div>
            <div>{parent?.name}</div>
            <div>{parent?.relation}</div>
            <div>{parent?.phone}</div>
            <div>{parent?.unit}</div>
          </div>
        );
      },
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'parents',
      align: 'center',
      render: (text: GT.Model.Parent[], record) => (
        <Space>
          <PrivateComponent id={126}>
            <Button type='link' onClick={() => onEdit(record)}>
              {text.length ? '编辑家长' : '新增家长'}
            </Button>
          </PrivateComponent>
          <PrivateComponent id={375}>
            {text.length ? (
              <Dropdown
                overlay={
                  <Menu>
                    {text.map((item, index) => (
                      <Menu.Item onClick={() => removeParent(index, record)}>{item.name}</Menu.Item>
                    ))}
                  </Menu>
                }>
                <Button type='link' danger>
                  删除家长
                  <DownOutlined />
                </Button>
              </Dropdown>
            ) : null}
          </PrivateComponent>
        </Space>
      ),
    },
  ];
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  const removeParent = (index: number, record: GT.Model.Student) => {
    Modal.confirm({
      title: '确定删除该家长？',
      onOk() {
        const parents = record.parents || [];
        parents.splice(index, 1);
        api.student.updateParent(record.id, parents).then(() => {
          message.success('删除成功');
          submit();
        });
      },
    });
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
                target.children = grades.map((grade) => ({
                  label: grade.name,
                  type: 'grade',
                  value: grade.enrollmentYear,
                  isLeaf: false,
                }));
                setOptions([...options]);
              });
          break;
        case 'grade':
          const [sectionType, enrollmentYear] = selectedOptions.map((item) => item.value);
          api.section
            .getClasses({ sectionType: Number(sectionType), enrollmentYear })
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
  const onEdit = (record: GT.Model.Student) => {
    createModal.current?.setVisible(true);
    createModal.current?.setTitle(record.parents?.length ? '编辑家长' : '新增家长');
    const parent1 = record.parents?.filter((p) => p.number === 1)[0] || { number: 1 };
    const parent2 = record.parents?.filter((p) => p.number === 2)[0] || { number: 2 };
    createModal.current?.form?.setFieldsValue({
      id: record.id,
      parents: [parent1, parent2],
    });
    createModal.current?.setFormData({
      id: record.id,
      parents: [parent1, parent2],
    });
  };

  const onImport = () => {
    importModal.current?.setVisible(true);
  };
  const onExport = () => {
    const { org, ...rest } = form.getFieldsValue();
    const [sectionType, enrollmentYear, classId] = org || [];
    api.student
      .exportParent({
        ...rest,
        sectionType,
        enrollmentYear,
        classId,
        scope: 2,
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
            <Form.Item label='学生组织' name='org' style={{ width: 270 }}>
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

            <Form.Item label='学生姓名' name='name'>
              <Input placeholder='请输入' />
            </Form.Item>
            <Form.Item label='家长姓名' name='parentName'>
              <Input placeholder='请输入' />
            </Form.Item>
            <Form.Item label='家长手机号' name='parentPhone'>
              <Input placeholder='请输入' />
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
      <PrivateComponent id={[124, 125]}>
        <p>
          <Space>
            <PrivateComponent id={124}>
              <Button type='primary' ghost onClick={onImport}>
                批量导入
              </Button>
            </PrivateComponent>
            <PrivateComponent id={125}>
              <Button type='primary' ghost onClick={onExport}>
                数据导出
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
        size='small'
        scroll={{ scrollToFirstRowOnChange: true }}
      />
      <CreateParentModal
        onRef={(ref) => (createModal.current = ref)}
        onOk={refresh}></CreateParentModal>
      <ImportExcelModal type='parent' onRef={(ref) => (importModal.current = ref)} onOk={refresh} />
    </div>
  );
}
