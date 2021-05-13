import React, { useState, useRef } from 'react';
import GT from 'types';
import { Form, Table, Modal, Space, Button, message, Row, Input } from 'antd';
import constant from 'src/constant';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import StudentListModal from './StudentList'

export default function SelectStudentsModal(props: GT.Modal.Props&{ studentLists?: GT.Model.Student[]}) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('选择请假学生');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<GT.Model.Student[]>((props.studentLists !== undefined) ? props.studentLists : []);
  const selectModal = useRef<GT.Modal.Ref>();
  const setData = (data: GT.Model.Student[]) => {
    setStudents(data);
    submit();
  };
 
  const [form] = Form.useForm();

  const getTeachersData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    let lists = students
    if (formData.name) {
      lists = students?.filter(t=>t.name.includes(formData.name));
    }
    // 分页数据加载
    lists = lists?.slice((current - 1) * size, current * size)
    return Promise.resolve({list: lists, total: students?.length})
  };
  
  const { tableProps, search, refresh } = useAntdTable(getTeachersData, {
    form: form,
  });
  const { submit, reset } = search;

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  props.onRef({
    setVisible,
    setTitle,
    setStudents,
    setData,
    form: form,
  });

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
    props.onOk && props.onOk(students);
  };
  const columns: ColumnType<GT.Model.Student>[] = [
    {
      title: '序号',
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
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
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'IC卡号',
      dataIndex: 'icCardNo',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) =>
        <Space>
          <Button type='link' danger onClick={() => onDelete(record)}>
            删除
          </Button>
        </Space>
        
    },
  ];
  const onDelete = (record: GT.Model.Student) => {
    Modal.confirm({
      title: '确认删除当前学生吗？',
      onOk() {
        message.success('删除成功');
        // 数组中对应的数据删除
        let deletedLists =  students.filter(item => item.id !== record.id)
        setStudents(deletedLists);
        search.reset();
      },
    });
  };

  return (
    <div>
      <Modal
        width={1000}
        title={title}
        visible={visible}
        onOk={handleCancel}
        onCancel={handleCancel}
        afterClose={handleCancel}
        confirmLoading={loading}
        footer={
          []
        }>
        <Form
          className='search_form'
          preserve={false}
          form={form}
          {...constant.form.layout}>
          <Row>
            <Row className='search_form_items'>
              <Form.Item label='姓名' name='name'>
                <Input placeholder='请输入' />
              </Form.Item>
            </Row>
            <Form.Item>
              <Space>
                <Button type='primary' onClick={submit}>
                  搜索
                </Button>
                <Button onClick={reset}>清空</Button>
              </Space>
            </Form.Item>
          </Row>
          <p>
            <Space>
                <Button type='primary' ghost
                onClick={() => {
                  selectModal.current?.setVisible(true);
                }}>
                  添加请假学生
                </Button>
            </Space>
          </p>
        </Form>
        <Table style={appStyle.table}
              columns={columns}
              rowKey='id'
              {...tableProps}
              size='small'/>
      </Modal>
      <StudentListModal
        onRef={(ref) => (selectModal.current = ref)}
        onOk={(data)=> setData(data)}></StudentListModal>
    </div>
  );
}
