import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, message, Radio } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';

export default function CreateDictionaryModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增字典');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<GT.DTO.CreateDictionaryDto>();
  props.onRef({
    setVisible,
    setTitle,
    form: form,
  });
  const handleOk = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      setLoading(true);
      api.dictionary
        .update({
          ...data,
        })
        .then(() => {
          setVisible(false);
          message.success(data.id ? '编辑成功' : '新增成功');
          props.onOk && props.onOk();
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
      <Form
        preserve={false}
        form={form}
        initialValues={{ state: 0, defaultStatus: 0 }}
        {...constant.form.layout}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item label='字典类型' name='defaultStatus'>
          <Radio.Group>
            <Radio value={0} key={0}>
              系统默认字典
            </Radio>
            <Radio value={1} key={1}>
              可定义字典
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name='dicCode'
          label='字典编码'
          hasFeedback
          rules={[
            { required: true },
            { pattern: constant.pattern.en_number, message: '仅支持英文和下划线' },
          ]}>
          <Input maxLength={30} />
        </Form.Item>
        <Form.Item
          name='dicName'
          label='字典名称'
          hasFeedback
          rules={[
            { required: true },
            { pattern: constant.pattern.cn_en_number, message: '仅支持中英文、数字' },
          ]}>
          <Input maxLength={20} />
        </Form.Item>
        <Form.Item name='sort' label='排序值' rules={[{ required: true }]}>
          <InputNumber min={0} step={1} precision={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
