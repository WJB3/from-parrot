import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  Steps,
  Statistic,
  Button,
  Space,
  Row,
  Result,
} from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import VerifyCode from 'src/components/VerifyCode';
import { token } from 'src/utils';
const { Option } = Select;

export default function UpdatePhoneModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('修改手机号');
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [time, setTime] = useState(0);
  const [smsLoading, setSmsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [form] = Form.useForm<GT.DTO.CreateGradeLeaderDto>();
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
          message.success('修改成功');
          setVisible(false);
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
  const onCodeChange = (rule: any, val: any) => {
    if (val?.length === 4) {
      return new Promise<void>((resolve, reject) => {
        api.base.checkVerifyImage({ code: val }).then((res) => {
          if (res) {
            resolve();
            setDisabled(false);
          } else {
            reject('验证码错误');
            setDisabled(true);
          }
        });
      });
    } else {
      setDisabled(true);
      return Promise.reject('请输入验证码');
    }
  };
  const onSmsChange = (rule: any, val: any, type: 'old' | 'new') => {
    if (val?.length === 6) {
      return new Promise<void>((resolve, reject) => {
        api.base
          .checkSms({
            code: val,
            phone: form.getFieldValue(type === 'old' ? 'oldPhone' : 'newPhone'),
          })
          .then((res) => {
            if (res) {
              resolve();
            } else {
              reject('验证码错误');
            }
          });
      });
    } else {
      return Promise.reject('请输入验证码');
    }
  };
  const onSend = (type: 'old' | 'new') => {
    setSmsLoading(true);
    const data = form.getFieldsValue();
    api.base
      .getSms({
        phone: type === 'old' ? data.oldPhone : data.newPhone,
        time: Date.now(),
        verifyCode: data.verifyCode,
        type: 2,
      })
      .then((res) => {
        setTime(Date.now() + 60000);
        setSmsLoading(false);
      })
      .catch(() => {
        setSmsLoading(false);
      });
  };
  const onSubmit = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      setLoading(true);
      api.user
        .updatePhone({
          oldVerifyCode: data.oldVerifyCode,
          newPhone: data.newPhone,
          newVerifyCode: data.newVerifyCode,
        })
        .then((res) => {
          message.success('修改成功');
          setCurrent(2);
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };
  const next = () => {
    if (current < 1) {
      form.validateFields().then(() => {
        setCurrent(current + 1);
        setTime(0);
        form.setFieldsValue({
          ...form.getFieldsValue(),
          verifyCode: '',
        });
      });
    } else {
      onSubmit();
    }
  };
  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    } else {
      setVisible(false);
    }
    setDisabled(true);
  };
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={handleCancel}
      afterClose={handleCancel}
      confirmLoading={loading}
      footer={
        current === 2 ? (
          <Row justify='center'>
            <Button
              type='primary'
              onClick={() => {
                token.remove();
                window.location.reload();
              }}
              style={{ width: 170 }}>
              确定
            </Button>
          </Row>
        ) : (
          <Row justify='center'>
            <Button onClick={prev} style={{ width: 170, marginRight: 10 }}>
              {current === 0 ? '取消' : '上一步'}
            </Button>
            <Button type='primary' onClick={next} loading={loading} style={{ width: 170 }}>
              下一步
            </Button>
          </Row>
        )
      }>
      <p>
        <Steps labelPlacement='vertical' current={current}>
          <Steps.Step title='原手机号验证' />
          <Steps.Step title='新手机号验证' />
          <Steps.Step title='完成' />
        </Steps>
      </p>
      <Form preserve={false} form={form} initialValues={{}} {...constant.form.layout}>
        <Form.Item label='手机号' name='oldPhone' hasFeedback hidden={current !== 0}>
          <Input placeholder='请输入登录手机号' disabled></Input>
        </Form.Item>
        <Form.Item
          label='手机号'
          name='newPhone'
          hasFeedback
          hidden={current !== 1}
          rules={
            current === 1
              ? [
                  {
                    required: true,
                    message: '请输入登录手机号',
                    pattern: constant.pattern.phone,
                  },
                ]
              : undefined
          }>
          <Input placeholder='请输入登录手机号'></Input>
        </Form.Item>
        <Form.Item
          label='图形验证码'
          required
          hasFeedback
          hidden={current === 2}
          name='verifyCode'
          rules={[{ validator: onCodeChange }]}>
          <Input key={current} suffix={<VerifyCode></VerifyCode>} maxLength={4}></Input>
        </Form.Item>
        <Form.Item
          label='短信验证码'
          name='oldVerifyCode'
          hasFeedback
          required
          hidden={current !== 0}
          rules={[{ validator: (rule, val) => onSmsChange(rule, val, 'old') }]}>
          <Input
            maxLength={6}
            placeholder='请输入短信验证码'
            suffix={
              <Space>
                {time ? (
                  <Statistic.Countdown
                    onFinish={() => setTime(0)}
                    value={time}
                    valueStyle={{ fontSize: 12 }}
                    suffix={<span style={{ fontSize: 12 }}>秒</span>}
                    format='ss'></Statistic.Countdown>
                ) : (
                  <Button
                    type='link'
                    loading={smsLoading}
                    size='small'
                    disabled={disabled}
                    onClick={() => onSend('old')}>
                    获取验证码
                  </Button>
                )}
              </Space>
            }></Input>
        </Form.Item>
        <Form.Item
          label='短信验证码'
          name='newVerifyCode'
          required
          hasFeedback
          hidden={current !== 1}
          rules={
            current === 1
              ? [{ validator: (rule, val) => onSmsChange(rule, val, 'new') }]
              : undefined
          }>
          <Input
            maxLength={6}
            placeholder='请输入短信验证码'
            suffix={
              <Space>
                {time ? (
                  <Statistic.Countdown
                    onFinish={() => setTime(0)}
                    value={time}
                    valueStyle={{ fontSize: 12 }}
                    suffix={<span style={{ fontSize: 12 }}>秒</span>}
                    format='ss'></Statistic.Countdown>
                ) : (
                  <Button
                    type='link'
                    loading={smsLoading}
                    size='small'
                    disabled={disabled}
                    onClick={() => onSend('new')}>
                    获取验证码
                  </Button>
                )}
              </Space>
            }></Input>
        </Form.Item>
        {current === 2 ? (
          <Result status='success' subTitle='密码重置成功，请返回登录页重新登录' />
        ) : null}
      </Form>
    </Modal>
  );
}
