import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, message } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';

export default function CreateDepartmentModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增服务部门');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [disabled, setDisabled] = useState<boolean>(false);
  const [form] = Form.useForm<GT.DTO.CreateDepartmentDto>();

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
          .updateDepartment(data)
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
          .addDepartment(data)
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
          label='服务部门名称'
          hasFeedback
          rules={[
            { required: true },
            { pattern: constant.pattern.cn_en_number, message: '仅支持中英文、数字' },
          ]}>
          <Input maxLength={10} placeholder='请输入' />
        </Form.Item>

        <Form.Item name='sort' label='服务部门序号' rules={[{ required: true }]}>
          <InputNumber min={0} step={1} precision={0} max={999} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
