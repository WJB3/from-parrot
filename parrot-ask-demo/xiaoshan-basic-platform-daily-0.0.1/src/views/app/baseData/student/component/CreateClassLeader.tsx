import React, { useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
const { Option } = Select;

export default function CreateClassLeaderModal(
  props: GT.Modal.Props & { classId: number; data: any },
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('设置班主任');
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<GT.Model.Teacher[]>([]);
  const [form] = Form.useForm<any>();
  props.onRef({
    setVisible,
    setTitle,
    form: form,
  });
  const handleOk = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      setLoading(true);
      api.classes
        .update({
          ...props.data,
          id: props.classId,
          headTeacherId: data.headTeacherId,
        })
        .then(() => {
          message.success('新增成功');
          setVisible(false);
          props.onOk?.();
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
    setTeachers([]);
  };
  const onSearch = (value: string) => {
    api.classes
      .getLeaderCandidatePage({
        name: value,
      })
      .then((res) => {
        setTeachers(res.list);
      });
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
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item name='headTeacherId' label='班主任' rules={[{ required: true }]} hasFeedback>
          <Select
            showSearch
            showArrow
            onSearch={onSearch}
            onDropdownVisibleChange={(open) => open && onSearch('')}
            placeholder='请输入'
            filterOption={false}>
            {teachers.map((t) => (
              <Select.Option value={t.id}>
                <div>
                  <div>
                    <span style={{ fontSize: 13 }}>{t.name}</span>
                    <span style={{ fontSize: 12, color: '#909499' }}>({t.phone})</span>
                  </div>
                  <div style={{ color: '#616266', fontSize: 12 }}>{t.departmentName}</div>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
