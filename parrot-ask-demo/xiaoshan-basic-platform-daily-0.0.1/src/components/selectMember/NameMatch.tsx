import React, { useState } from 'react';
import { Form, Input, message, Modal } from 'antd';

import GT from 'types';
import { useForm } from 'antd/lib/form/Form';
import constant from 'src/constant';
import api from 'src/api';

export default function NameMatch(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('姓名匹配');
  const [loading, setLoading] = useState(false);
  const [json, setJSON] = useState({});
  const [form] = useForm();
  props.onRef({
    setVisible,
    setTitle,
    setJSON,
  });
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };
  const handleOk = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      setLoading(true);
      const names = data.names.split(/[(\r\n)\r\n,，]+/);
      api.teacher
        .getAll({
          teacherNames: names,
        })
        .then((ret) => {
          if (ret.list.length) {
            message.success(`成功匹配${ret.list.length}人`);
          } else {
            message.error('匹配失败');
          }

          props.onOk?.(ret.list);
          handleCancel();
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      closable
      okText='匹配并确定'
      confirmLoading={loading}
      afterClose={handleCancel}>
      <Form form={form} initialValues={{}} {...constant.form.layout}>
        <Form.Item name='names' rules={[{ required: true, message: '请输入姓名' }]}>
          <Input.TextArea
            placeholder='请输入姓名，多个用户通过逗号分开或换行'
            rows={8}></Input.TextArea>
        </Form.Item>
        <p>匹配说明:</p>
        <p>1.根据姓名自动匹配教师，仅针对教师，重名教师不支持匹配；</p>
        <p>2.录入或粘贴姓名时，姓名之间用逗号分开或直接换行。</p>
      </Form>
    </Modal>
  );
}
