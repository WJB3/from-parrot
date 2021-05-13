import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { Button, Form, Row, Select, Space, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import React, { useMemo, useRef, useState } from 'react';
import { SyncOutlined } from '@ant-design/icons';
import api from 'src/api';
import appStyle from 'src/App.style';
import constant from 'src/constant';
import Cascader, { CascaderOptionType } from 'antd/lib/cascader';
import GT from 'types';
import EditLessonGroupModal from './component/EditLessonGroup';
import useDictionary from 'src/hook/useDictionary';
import PrivateComponent from 'src/components/PrivateComponent';
import OneLineText from 'src/components/OneLineText';
export default function LessonGroup() {
  const [form] = Form.useForm<any>();
  const [options, setOptions] = useState<CascaderOptionType[]>([]);
  const [sectionType, setSectionType] = useState<number>();
  const { renderText, renderSelect } = useDictionary();
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    const { org = [], ...rest } = formData;
    const [sectionType, enrollmentYear] = org || [];
    return api.group.getLessonGroupPage({
      ...rest,
      sectionType,
      enrollmentYear,
      current,
      size,
    });
  };

  const modal = useRef<GT.Modal.Ref>();
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const { reset, submit } = search;
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
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
                }));
                setOptions([...options]);
              });
          break;
        default:
          break;
      }
    }
  };
  const onEdit = (record: any) => {
    modal.current?.setVisible(true);
    const obj = (record as GT.Model.Group).members?.reduce(
      (obj, item) => {
        obj.organization = obj.organization.concat(
          item.parentIds?.length
            ? item.parentIds?.map((pId) => ({
                id: item.memberId,
                key: `node,${pId},${item.memberId}`,
              }))
            : [
                {
                  id: item.memberId,
                  key: `node,${-1},${item.memberId}`,
                },
              ],
        );
        return obj;
      },
      {
        organization: [] as any[],
        group: [] as any[],
        student: [] as any[],
        parent: [] as any[],
      },
    );
    let map = new Map([
      [
        'organization',
        {
          nodes: obj?.organization,
        },
      ],
      [
        'group',
        {
          nodes: obj?.group,
        },
      ],
    ]);
    modal.current?.form?.setFieldsValue({
      id: record.id,
      name: `${getSectionName(record.sectionType)}/${record.enrollmentYear + 3}届/${renderText(
        `subject${record.sectionType}`,
        record.subjectId,
      )}`,
      leaderId: record.leaderId,
      member: map,
    });
    modal.current?.setMember(map);
    modal.current?.getTeachers(record.leaderName);
  };
  const getSectionName = (val: any) => {
    const map: any = {
      1: '高中',
      2: '初中',
      3: '预备',
    };
    return map[val];
  };
  const columns: ColumnType<any>[] = [
    {
      title: '学段',
      align: 'center',
      dataIndex: 'sectionType',
      render: (val) => getSectionName(val),
    },
    {
      title: '年级',
      align: 'center',
      dataIndex: 'enrollmentYear',
      render: (val, record) => `${getSectionName(record.sectionType)}${val + 3}届`,
    },
    {
      title: '科目',
      align: 'center',
      dataIndex: 'subjectId',
      render: (val, record) => renderText(`subject${record.sectionType}`, val),
    },
    {
      title: '组长',
      align: 'center',
      dataIndex: 'leaderName',
    },
    {
      title: '成员',
      align: 'center',
      dataIndex: 'members',
      width: 300,
      render: (members: GT.Model.GroupMember[]) => {
        return (
          <OneLineText>
            {members
              ?.map((m) => {
                const length = members.filter((item) => item.name === m.name).length;
                if (length > 1) {
                  return `${m.name}(${m.phone})`;
                }
                return m.name;
              })
              .join('，')}
          </OneLineText>
        );
      },
    },
    {
      title: '人数',
      align: 'center',
      dataIndex: ['members', 'length'],
    },
    {
      title: '操作',
      align: 'center',
      render: (val, record) => (
        <PrivateComponent id={173}>
          <Button type='link' onClick={() => onEdit(record)}>
            编辑
          </Button>
        </PrivateComponent>
      ),
    },
  ];
  const org = form.getFieldValue('org');
  const subjectContent = useMemo(() => {
    if (sectionType) {
      return renderSelect(`subject${sectionType}`);
    }
    return <Select placeholder='请选择'></Select>;
  }, [sectionType]);
  return (
    <div>
      <Form form={form} className='search_form'>
        <Row>
          <Row className='search_form_items'>
            <Form.Item label='年级' name='org'>
              <Cascader
                placeholder='请选择'
                loadData={loadData}
                options={options}
                changeOnSelect
                onChange={(values) => {
                  if (!values.length) {
                    form.setFieldsValue({ subjectId: undefined });
                    setSectionType(undefined);
                  } else {
                    values[0] !== sectionType && form.setFieldsValue({ subjectId: undefined });
                    setSectionType(values[0] as number);
                  }
                }}
                onPopupVisibleChange={getSections}></Cascader>
            </Form.Item>
            <Form.Item label='科目' name='subjectId'>
              {subjectContent}
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

      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        size='small'
        scroll={{ scrollToFirstRowOnChange: true }}
      />
      <EditLessonGroupModal
        onRef={(ref) => (modal.current = ref)}
        onOk={refresh}></EditLessonGroupModal>
    </div>
  );
}
