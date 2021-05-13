import { Modal, Row, Button, Form, Input, message, Steps, Space, Statistic, Result } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'src/api';
import VerifyCode from 'src/components/VerifyCode';
import constant from 'src/constant';
export default function ForgetPasswordPage() {
  const [form] = useForm();
  const history = useHistory();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [smsLoading, setSmsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const onSubmit = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      setLoading(true);
      api.user
        .forgetPassword({
          password: data.password,
          phone: data.phone,
          code: data.code,
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
  const onCodeChange = (rule: any, val: any) => {
    if (val?.length === 4) {
      return new Promise<void>((resolve, reject) => {
        api.base.checkVerifyImage({ code: val }).then((res) => {
          if (res) {
            resolve();
            setDisabled(false);
          } else {
            reject('图形验证码错误');
            setDisabled(true);
          }
        });
      });
    } else {
      setDisabled(true);
      return Promise.reject('请输入图形验证码');
    }
  };
  const onSmsChange = (rule: any, val: any) => {
    if (val?.length === 6) {
      return new Promise<void>((resolve, reject) => {
        api.base.checkSms({ code: val, phone: form.getFieldValue('phone') }).then((res) => {
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
  const onSend = () => {
    setSmsLoading(true);
    const data = form.getFieldsValue();
    api.base
      .getSms({
        phone: data.phone,
        time: Date.now(),
        verifyCode: data.verifyCode,
        type: 1,
      })
      .then((res) => {
        setTime(Date.now() + 60000);
        setSmsLoading(false);
      })
      .catch(() => {
        setSmsLoading(false);
      });
  };
  const next = () => {
    if (current < 1) {
      form.validateFields().then(() => {
        setCurrent(current + 1);
      });
    } else {
      onSubmit();
    }
  };
  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    } else {
      history.goBack();
    }
  };
  const picCode = useMemo(() => <VerifyCode></VerifyCode>, []);
  return (
    <Modal
      visible
      title='忘记密码'
      closable={false}
      footer={
        current === 2 ? (
          <Row justify='center'>
            <Button type='primary' onClick={history.goBack} style={{ width: 170 }}>
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
      <div>
        <p>
          <Steps labelPlacement='vertical' current={current}>
            <Steps.Step title='手机号验证' />
            <Steps.Step title='设置新密码' />
            <Steps.Step title='完成' />
          </Steps>
        </p>
        <Form
          form={form}
          layout='vertical'
          requiredMark={false}
          style={{ width: 350, margin: '0 auto' }}>
          <Form.Item
            label='手机号'
            name='phone'
            hasFeedback
            hidden={current !== 0}
            rules={[
              {
                required: true,
                message: '请输入登录手机号',
                pattern: constant.pattern.phone,
              },
            ]}>
            <Input placeholder='请输入登录手机号'></Input>
          </Form.Item>
          <Form.Item
            label='图形验证码'
            name='verifyCode'
            hidden={current !== 0}
            rules={[{ validator: onCodeChange }]}
            hasFeedback>
            <Input suffix={picCode} maxLength={4}></Input>
          </Form.Item>
          <Form.Item
            label='短信验证码'
            name='code'
            hasFeedback
            hidden={current !== 0}
            rules={[{ validator: onSmsChange }]}>
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
                      onClick={() => onSend()}>
                      获取验证码
                    </Button>
                  )}
                </Space>
              }></Input>
          </Form.Item>
          <Form.Item
            label='新密码'
            name='password'
            hidden={current !== 1}
            help='密码由6-26位英文字母和数字组成'
            rules={
              current === 1
                ? [
                    {
                      required: true,
                      message: '密码由6-26位英文字母和数字组成',
                      pattern: constant.pattern.password,
                    },
                  ]
                : undefined
            }>
            <Input.Password placeholder='请输入新的登录密码' maxLength={26}></Input.Password>
          </Form.Item>
          <Form.Item
            label='确认新密码'
            name='checkPassword'
            dependencies={['password']}
            hidden={current !== 1}
            validateFirst={true}
            rules={
              current === 1
                ? [
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
                  ]
                : undefined
            }>
            <Input.Password
              placeholder='请再次输入新的登录密码'
              maxLength={26}
              type='password'></Input.Password>
          </Form.Item>
          {current === 2 ? (
            <Result status='success' subTitle='密码重置成功，请返回登录页重新登录' />
          ) : null}
        </Form>
      </div>
    </Modal>
  );
}
