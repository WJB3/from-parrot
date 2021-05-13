import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Radio, message } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';

export default function CreateRoleModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增角色');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<GT.DTO.CreateRoleDto>();
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
        api.role
          .update(data)
          .then(() => {
            setVisible(false);
            message.success('编辑成功');
            props.onOk && props.onOk();
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        api.role
          .create(data)
          .then(() => {
            message.success('新增角色成功');
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
    form.resetFields();
    setVisible(false);
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
      <Form preserve={false} form={form} initialValues={{ state: 1 }} {...constant.form.layout}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item
          name='name'
          label='角色编码'
          hasFeedback
          rules={[
            { required: true },
            { pattern: constant.pattern.en_name, message: '仅支持英文和下划线' },
          ]}>
          <Input maxLength={20} />
        </Form.Item>
        <Form.Item
          name='zhName'
          label='角色名称'
          hasFeedback
          rules={[
            { required: true },
            { pattern: constant.pattern.cn_en_number, message: '仅支持中英文、数字' },
          ]}>
          <Input maxLength={20} />
        </Form.Item>
        <Form.Item name='state' label='权限状态' rules={[{ required: true }]}>
          <Radio.Group>
            {[...constant.role.state.entries()].map(([val, label]) => {
              return <Radio value={val}>{label}</Radio>;
            })}
          </Radio.Group>
        </Form.Item>

        <Form.Item name='remarks' label='备注'>
          <Input.TextArea rows={4} maxLength={100} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
