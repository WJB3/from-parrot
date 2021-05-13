import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Space, message } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';

export default function CreateFloorModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增楼层');
  const [loading, setLoading] = useState(false);
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
      api.building
        .createFloors(data)
        .then()
        .then(() => {
          message.success('新增成功');
          setVisible(false);
          props.onOk?.();
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
  const validate = (rule: any, val: any) => {
    const min = form.getFieldValue('min');
    if (val && min !== undefined) {
      if (val < min) {
        return Promise.reject('最高楼层不能小于最低楼层');
      }
    }
    return Promise.resolve();
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
        <Form.Item name='buildingId' noStyle></Form.Item>
        <Form.Item
          label='楼层名称'
          required
          extra='输入低楼层和高楼层数字，比如-1~10，系统会自动创建-1层到10层，您也可以输入2~2，系统将单独创建2层，通过编辑来修改。'>
          <Space>
            <Form.Item noStyle label='最低楼层' name='min' rules={[{ required: true }]}>
              <InputNumber
                step={1}
                precision={0}
                style={{ width: '100%' }}
                placeholder='请输入最低楼层'></InputNumber>
            </Form.Item>
            <span>-</span>
            <Form.Item
              noStyle
              label='最高楼层'
              name='max'
              validateFirst
              rules={[{ required: true }, { validator: validate }]}
              dependencies={['min']}>
              <InputNumber
                step={1}
                precision={0}
                style={{ width: '100%' }}
                placeholder='请输入最高楼层'></InputNumber>
            </Form.Item>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
