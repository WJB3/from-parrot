import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, message, Radio } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';

export default function CreateDictionaryValModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增字典值');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<GT.DTO.CreateDictionaryValueDto>();
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
        .updateValue({
          ...data,
          photo: 0,
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
      <Form preserve={false} form={form} initialValues={{ useStatus: 0 }} {...constant.form.layout}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item name='dicCode' hidden={true}></Form.Item>
        <Form.Item label='字典类型'>
          <Input disabled defaultValue='可定义字典'></Input>
        </Form.Item>
        <Form.Item label='所属字典' name='dicName'>
          <Input disabled></Input>
        </Form.Item>
        <Form.Item
          name='name'
          label='名称'
          hasFeedback
          rules={[
            { required: true },
            { pattern: constant.pattern.cn_en_number, message: '仅支持中英文、数字' },
          ]}>
          <Input maxLength={50} />
        </Form.Item>
        <Form.Item
          name='value'
          label='值'
          hasFeedback
          rules={[
            { required: true },
            // { pattern: constant.pattern.cn_en_number, message: '仅支持中英文、数字' },
          ]}>
          <InputNumber min={0} step={1} max={99999} precision={0} />
        </Form.Item>
        <Form.Item name='sort' label='字典内排序' rules={[{ required: true }]} hasFeedback>
          <InputNumber min={0} step={1} max={999} precision={0} />
        </Form.Item>
        <Form.Item name='useStatus' label='启用状态' rules={[{ required: true }]}>
          <Radio.Group>
            {[...constant.dictionary.useStatus.entries()].map(([value, label]) => (
              <Radio value={value}>{label}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
