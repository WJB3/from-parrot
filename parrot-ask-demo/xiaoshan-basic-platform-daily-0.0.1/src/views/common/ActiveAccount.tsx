import { Modal, Row, Button, Form, Input, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'src/api';
import VerifyCode from 'src/components/VerifyCode';
import constant from 'src/constant';
import { token } from 'src/utils';
export default function ActiveAccountPage() {
  const [form] = useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const onSubmit = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();

      setLoading(true);
      api.user
        .updatePassword({
          password: data.password,
        })
        .then((res) => {
          message.success('修改成功');
          // history.goBack();
          token.remove();
          window.location.reload();
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };
  return (
    <Modal
      visible
      title={<Row justify='center'>修改密码</Row>}
      closable={false}
      footer={
        <Row justify='center'>
          <Button type='primary' style={{ width: 350 }} onClick={onSubmit} loading={loading}>
            确定修改
          </Button>
        </Row>
      }>
      <div>
        <Form form={form} layout='vertical' requiredMark={false}>
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
      </div>
    </Modal>
  );
}
