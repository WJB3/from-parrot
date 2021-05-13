import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, message, Radio } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';

export default function CreateCampusModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增校区');
  const [loading, setLoading] = useState(false);
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
      api.building
        .createCampus({ ...data })
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
    form.resetFields();
    setLoading(false);
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
        <Form.Item name='name' label='校区名称' rules={[{ required: true, whitespace: true }]}>
          <Input placeholder={'请输入'} maxLength={10}></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
}
