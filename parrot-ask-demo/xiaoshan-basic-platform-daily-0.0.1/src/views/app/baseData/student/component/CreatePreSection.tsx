import React, { useState } from 'react';
import { Modal, Form, InputNumber, Radio, message } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';

export default function CreatePreSectionModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('预备班设置');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    open: false,
  });
  const [form] = Form.useForm<GT.DTO.CreateSectionDto>();

  props.onRef({
    setVisible,
    setTitle,
    form: form,
  });
  const handleOk = () => {
    form.validateFields().then(async () => {
      const { number, open } = form.getFieldsValue();
      setLoading(true);
      if (open) {
        api.section
          .create([
            {
              type: 3,
              currentYear: await api.semester.getCurrentYear(),
              namingMethod: 0,
              numbers: [number],
            },
          ])
          .then(() => {
            setVisible(false);
            message.success('新增成功');
            props.onOk && props.onOk();
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        setVisible(false);
      }
    });
  };
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };
  const onValuesChange = (changed: any, all: any) => {
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
        onValuesChange={onValuesChange}
        form={form}
        initialValues={{
          open: false,
        }}
        {...constant.form.layout}>
        <Form.Item name='open' label='开启提前批' rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={false} key={0}>
              否
            </Radio>
            <Radio value={true} key={1}>
              是
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name='number'
          label='预备班数量'
          rules={!formData.open ? [] : [{ required: true }]}
          hidden={!formData.open}>
          <InputNumber max={50} step={1} min={1} precision={0}></InputNumber>
        </Form.Item>
      </Form>
    </Modal>
  );
}
