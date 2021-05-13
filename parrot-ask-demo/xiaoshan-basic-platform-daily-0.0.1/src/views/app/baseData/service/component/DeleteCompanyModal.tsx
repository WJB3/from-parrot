import React, { useState } from 'react';
import { Modal, Form, Radio, message } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';

export default function CreateCompanyModal(
  props: GT.Modal.Props
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('选择删除方式');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [disabled, setDisabled] = useState<boolean>(false);
  const [form] = Form.useForm<GT.DTO.DeleteCompanyDto>();

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
      if (data.type == 1) {
          api.service.deleteCompany(data.id, {type: 1})
          .then(() => {
            message.success('删除成功');
            props.onOk && props.onOk();
            setVisible(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        Modal.confirm({
            title: '删除后不可恢复，确认删除当前公司及所有服务人员？',
            onOk: () => {
                api.service.deleteCompany(data.id, {type: 2})
                .then(() => {
                  message.success('删除成功');
                  props.onOk && props.onOk();
                  setVisible(false);
                })
                .catch(() => {
                  setLoading(false);
                });
            },
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
        initialValues={{ type: 1 }}
        onValuesChange={onValuesChange}
        {...constant.form.layout}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item name='type' rules={[{ required: true }]}>
          <Radio.Group>
            {[...constant.deleteType.type.entries()].map(([val, label]) => {
              return <Radio value={val}>{label}</Radio>;
            })}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
