import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, message } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';

export default function CreateCompanyModal(
  props: GT.Modal.Props
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增服务商');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [disabled, setDisabled] = useState<boolean>(false);
  const [form] = Form.useForm<GT.DTO.CreateCompanyDto>();

  props.onRef({
    setVisible,
    setTitle,
    form: form,
    setFormData,
    setDisabled,
  });
  const handleOk = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      if (data.id) {
        api.service
          .updateCompany(data)
          .then(() => {
            message.success('编辑成功');
            props.onOk && props.onOk();
            setVisible(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        api.service
          .addCompany(data)
          .then(() => {
            message.success('新增成功');
            props.onOk && props.onOk();
            setVisible(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }
    });
  };
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
    setFormData({});
  };
  const onValuesChange = (val: any, all: any) => {
    setFormData(all);
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={handleCancel}
      confirmLoading={loading}>
      <Form
        preserve={false}
        form={form}
        initialValues={{}}
        onValuesChange={onValuesChange}
        {...constant.form.layout}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item
          name='name'
          label='公司名称'
          hasFeedback
          rules={[
            {required: true},
            { whitespace: true }
          ]}>
          <Input maxLength={50} placeholder='请输入' />
        </Form.Item>

        <Form.Item
          name='address'
          label='公司地址'
          hasFeedback
          rules={[
            { whitespace: true }
          ]}>
          <Input maxLength={100} placeholder='请输入' />
        </Form.Item>

        <Form.Item
          name='contact'
          label='联系人姓名'
          hasFeedback
          rules={[
            { whitespace: true }
          ]}>
          <Input maxLength={20} placeholder='请输入' />
        </Form.Item>

        <Form.Item
            name='contactPhone'
            label='联系人手机号'
            hasFeedback
            rules={[
              { pattern: constant.pattern.phone, message: '请输入正确的手机号码' },
            ]}>
            <Input maxLength={20} placeholder={'请输入'} />
        </Form.Item>

        <Form.Item name='sort' label='公司序号' rules={[{ required: true }]}>
          <InputNumber min={0} step={1} precision={0} max={999} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
