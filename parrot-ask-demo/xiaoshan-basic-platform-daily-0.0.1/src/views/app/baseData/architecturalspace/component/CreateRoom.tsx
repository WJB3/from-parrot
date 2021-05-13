import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, message, Radio, Space } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';

export default function CreateRoomModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增房间');
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
          .updateRoom({ ...data, towards: data.towards || null, height: data.height || null })
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
          .createRoom({ ...data })
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
      <Form
        preserve={false}
        form={form}
        initialValues={{ towards: null }}
        {...constant.form.layout}>
        <Form.Item name='id' hidden></Form.Item>
        <Form.Item name='floorId' hidden></Form.Item>
        <Form.Item name='name' label='房间名称' rules={[{ required: true, whitespace: true }]}>
          <Input placeholder={'请输入'} maxLength={10}></Input>
        </Form.Item>
        <Form.Item name='type' label='房间类型' rules={[{ required: true }]}>
          {renderSelect('roomType')}
        </Form.Item>
        <Form.Item label='房间面积' name='area' rules={[{ required: true }]}>
          <Space>
            <Form.Item noStyle name='area'>
              <InputNumber step={1} min={1} precision={2} max={999999999.99}></InputNumber>
            </Form.Item>
            <span>m²</span>
          </Space>
        </Form.Item>
        <Form.Item name='towards' label='房间朝向'>
          {renderSelect('towards', { allowClear: true })}
        </Form.Item>
        <Form.Item label='房间层高' name='height'>
          <Space>
            <Form.Item noStyle name='height'>
              <InputNumber step={1} min={1} precision={2}></InputNumber>
            </Form.Item>
            <span>m</span>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
