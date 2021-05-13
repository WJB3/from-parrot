import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, message, Radio, Space, DatePicker } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';

export default function CreateBuildingModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增楼宇');
  const [loading, setLoading] = useState(false);
  const { renderSelect } = useDictionary();
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
      if (data.id) {
        api.building
          .update({
            ...data,
            structure: data.structure || null,
            deliveryTime: data.deliveryTime?.toISOString(),
          })
          .then(() => {
            message.success('编辑成功');
            setVisible(false);
            props.onOk?.();
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        api.building
          .create({
            ...data,
            structure: data.structure || null,
            deliveryTime: data.deliveryTime?.toISOString(),
          })
          .then(() => {
            message.success('新增成功');
            setVisible(false);
            props.onOk?.();
          })
          .catch(() => {
            setLoading(false);
          });
      }
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
        <Form.Item name='id' hidden></Form.Item>
        <Form.Item name='campusId' hidden></Form.Item>
        <Form.Item name='name' label='楼宇名称' rules={[{ required: true, whitespace: true }]}>
          <Input placeholder={'请输入'} maxLength={10}></Input>
        </Form.Item>
        <Form.Item
          name='nature'
          label='楼宇性质'
          rules={[{ required: true, message: '请选择楼宇性质' }]}>
          {renderSelect('nature')}
        </Form.Item>
        <Form.Item label='楼宇面积' name='area'>
          <Space>
            <Form.Item noStyle name='area'>
              <InputNumber step={1} min={1} max={999999999.99} precision={2}></InputNumber>
            </Form.Item>
            <span>m²</span>
          </Space>
        </Form.Item>

        <Form.Item label='建筑结构' name='structure'>
          {renderSelect('structure', {
            allowClear: true,
          })}
        </Form.Item>
        <Form.Item label='交付日期' name='deliveryTime'>
          <DatePicker />
        </Form.Item>
        <Form.Item label='楼宇序号' name='sort' rules={[{ required: true }]}>
          <InputNumber step={1} min={1} precision={0}></InputNumber>
        </Form.Item>
      </Form>
    </Modal>
  );
}
