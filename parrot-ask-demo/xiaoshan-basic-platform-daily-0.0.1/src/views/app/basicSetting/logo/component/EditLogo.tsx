import React, { useState } from 'react';
import { Modal, Form, message, DatePicker } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import UploadFiles from 'src/components/UploadFiles';
import { PlusOutlined } from '@ant-design/icons';

export default function EditLogoModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('修改');
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
      console.log(data, 1);
      setLoading(true);
      api.base
        .updateBaseInfo(data.fileList[0].response.id)
        .then((res) => {
          message.success('修改成功');
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
    setLoading(false);
    form.resetFields();
  };
  const normFile = (e: any, file: any) => {
    return e;
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
        <Form.Item
          name='fileList'
          label='上传图片'
          hasFeedback
          getValueFromEvent={normFile}
          valuePropName='fileList'
          rules={[{ required: true, message: '请上传图片' }]}
          extra={'建议上传200*200像素的图片，图片不超过500KB；'}>
          <UploadFiles max={500} upload={{ accept: 'image/jpeg,image/jpg,image/png' }} limit={1}>
            <div style={{ color: '#84878C' }}>
              <PlusOutlined />
              <div>上传图片</div>
            </div>
          </UploadFiles>
        </Form.Item>
      </Form>
    </Modal>
  );
}
