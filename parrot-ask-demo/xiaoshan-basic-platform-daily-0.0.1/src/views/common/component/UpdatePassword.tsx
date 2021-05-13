import React, { useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
const { Option } = Select;

export default function UpdatePasswordModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('修改登录密码');
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
      api.user
        .updatePassword({
          ...data,
        })
        .then((res) => {
          message.success('密码修改成功');
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
        <Form.Item name='phone' hidden={true}></Form.Item>
        <Form.Item
          label='原密码'
          name='oldPassword'
          rules={[
            {
              required: true,
              message: '密码由6-26位英文字母和数字组成',
              pattern: constant.pattern.password,
            },
          ]}>
          <Input.Password placeholder='请输入新的登录密码' maxLength={26}></Input.Password>
        </Form.Item>
        <Form.Item
          label='新密码'
          name='password'
          help='密码由6-26位英文字母和数字组成'
          rules={[
            {
              required: true,
              message: '密码由6-26位英文字母和数字组成',
              pattern: constant.pattern.password,
            },
          ]}>
          <Input.Password placeholder='请输入新的登录密码' maxLength={26}></Input.Password>
        </Form.Item>
        <Form.Item
          label='确认新密码'
          name='checkPassword'
          dependencies={['password']}
          validateFirst={true}
          rules={[
            {
              required: true,
              message: '密码由6-26位英文字母和数字组成',
              pattern: constant.pattern.password,
            },
            {
              validator: (rule, value) => {
                const password = form.getFieldValue('password');
                if (value === password) {
                  return Promise.resolve();
                }
                return Promise.reject(rule.message);
              },
              message: '密码不一致',
            },
          ]}>
          <Input.Password
            placeholder='请再次输入新的登录密码'
            maxLength={26}
            type='password'></Input.Password>
        </Form.Item>
      </Form>
    </Modal>
  );
}
