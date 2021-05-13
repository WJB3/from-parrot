import React, { useState } from 'react';
import { Modal, Form, Input, Select, message, DatePicker } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';

export default function EditScheduleBeginModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('修改执行日期');
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
      console.log(data, 123);
      api.schedule
        .updateBeginTime({
          id: data.id,
          beginTime: data.updateTime.format('YYYY-MM-DD'),
        })
        .then(() => {
          message.success('设置成功');
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

        <Form.Item name='restName' label='当前执行对象' hasFeedback>
          <Input disabled />
        </Form.Item>
        <Form.Item name='beginTime' label='当前执行日期' hasFeedback>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name='updateTime'
          label='修改后执行日期'
          hasFeedback
          rules={[{ required: true }]}>
          <DatePicker dropdownClassName='hideYearDatePicker' format='MM-DD' />
        </Form.Item>
      </Form>
    </Modal>
  );
}
