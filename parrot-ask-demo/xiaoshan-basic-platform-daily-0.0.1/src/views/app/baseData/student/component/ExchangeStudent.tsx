import React, { useState } from 'react';
import GT from 'types';
import { Form, Table, Modal, Space, Button, Select, message } from 'antd';
import constant from 'src/constant';
import api from 'src/api';
import { ColumnType } from 'antd/es/table/interface';
export default function ExchangeStudentModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('调班');
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<GT.Model.Class[]>([]);
  const [students, setStudents] = useState<GT.Model.Student[]>();
  const [form] = Form.useForm();

  props.onRef({
    setVisible,
    setTitle,
    form: form,
  });
  const handleOk = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      const classId = data.classId;
      const studentIds = data.students.map((s: GT.Model.Student) => s.id);
      setLoading(true);
      api.student
        .exchange(classId, studentIds)
        .then(() => {
          setVisible(false);
          message.success('调班成功');
          props.onOk && props.onOk();
        })
        .catch(() => setLoading(false));
    });
  };
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };
  const columns: ColumnType<GT.Model.Student>[] = [
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
      render: (text, record, index) =>
        form.getFieldValue('students')?.length > 1 && (
          <Space>
            <Button type='link' danger onClick={() => onDelete(index)}>
              删除
            </Button>
          </Space>
        ),
    },
  ];
  const onDelete = (index: number) => {
    const students = form.getFieldValue('students');
    students.splice(index, 1);
    form.setFieldsValue({
      students: [...students],
    });
    setStudents(students);
  };
  const getClasses = (open: boolean) => {
    if (open) {
      const data = form.getFieldsValue();
      const student: GT.Model.Student = data.students[0];
      if (student) {
        const { sectionId, enrollmentYear } = student;
        api.section.getClasses({ sectionId, enrollmentYear }).then((res) => setClasses(res));
      } else {
        setClasses([]);
      }
    }
  };
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={handleCancel}
      confirmLoading={loading}>
      <Form preserve={false} form={form} initialValues={{}} {...constant.form.layout}>
        <Form.Item label='选择调入班级' hasFeedback name='classId' rules={[{ required: true }]}>
          <Select
            placeholder='请选择'
            onDropdownVisibleChange={getClasses}
            showSearch
            optionFilterProp='children'>
            {classes.map((item) => (
              <Select.Option value={item.id}>{item.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label='调入学生名单'
          name='students'
          valuePropName='dataSource'
          rules={[{ required: true, message: '请选择调入学生名单' }]}>
          <Table columns={columns} pagination={false}></Table>
        </Form.Item>
      </Form>
    </Modal>
  );
}
