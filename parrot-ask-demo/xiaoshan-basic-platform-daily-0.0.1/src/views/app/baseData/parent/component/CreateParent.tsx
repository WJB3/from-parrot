import React, { useState } from 'react';
import { Modal, Form, Input, Select, message, Button, Row } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';

export default function CreateParentModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增家长');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<any>();
  const [formData, setFormData] = useState({ parents: [{ number: 1 }, { number: 2 }] });
  props.onRef({
    setVisible,
    setTitle,
    form: form,
    setFormData,
  });
  const handleOk = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      setLoading(true);
      api.student
        .updateParent(data.id, data.parents)
        .then(() => {
          message.success(title === '新增家长' ? '新增成功' : '编辑成功');
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
  const validateSame = (rule: any, val: any) => {
    const { parents } = form.getFieldsValue();
    if (parents.length === 2) {
      const [p1, p2] = parents;
      if (p1.name && p1.phone && p1.name === p2.name && p1.phone === p2.phone) {
        return Promise.reject('家长信息重复');
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
      <Form
        preserve={false}
        form={form}
        onValuesChange={(changed: any, all: any) => {
          setFormData(all);
        }}
        initialValues={{ parents: [{ number: 1 }, { number: 2 }] }}
        {...constant.form.layout}>
        <Form.Item name='id' hidden={true}></Form.Item>

        <Form.List name='parents'>
          {(fields, { add, remove, move }) => {
            return fields.map((field, index) => (
              <React.Fragment>
                <Row justify='space-between'>
                  <div>
                    家长{formData.parents?.[index]?.number}
                    <span style={{ fontSize: 12, color: '#999' }}>
                      (如只需填写一个家长，请点击“移除”)
                    </span>
                  </div>
                  {fields.length > 1 ? (
                    <Button danger type='link' onClick={() => remove(field.name)}>
                      移除
                    </Button>
                  ) : null}
                </Row>
                <Form.Item
                  name={[field.name, 'id']}
                  fieldKey={[field.fieldKey, 'id']}
                  hidden={true}></Form.Item>
                <Form.Item
                  name={[field.name, 'relation']}
                  fieldKey={[field.fieldKey, 'relation']}
                  label='关系'
                  rules={[{ required: true }, { whitespace: true }]}>
                  <Input placeholder='例如父子、母子等' maxLength={5}></Input>
                </Form.Item>
                <Form.Item
                  name={[field.name, 'name']}
                  fieldKey={[field.fieldKey, 'name']}
                  label='家长姓名'
                  validateFirst
                  dependencies={[
                    ['parents', 1, 'name'],
                    ['parents', 0, 'phone'],
                    ['parents', 1, 'phone'],
                  ]}
                  rules={[{ required: true, whitespace: true }, { validator: validateSame }]}>
                  <Input placeholder='请输入' maxLength={10}></Input>
                </Form.Item>
                <Form.Item
                  label='家长手机号'
                  name={[field.name, 'phone']}
                  validateFirst
                  fieldKey={[field.fieldKey, 'phone']}
                  dependencies={[
                    ['parents', 1, 'phone'],
                    ['parents', 0, 'name'],
                    ['parents', 1, 'name'],
                  ]}
                  rules={[
                    {
                      required: true,
                      pattern: constant.pattern.phone,
                      message: '请输入正确的手机号码',
                    },
                    { validator: validateSame },
                  ]}>
                  <Input placeholder='请输入'></Input>
                </Form.Item>
                <Form.Item
                  label='工作单位'
                  name={[field.name, 'unit']}
                  fieldKey={[field.fieldKey, 'unit']}
                  rules={[{ required: true, whitespace: true }]}>
                  <Input placeholder='请输入' maxLength={30}></Input>
                </Form.Item>
                {fields.length < 2 && (
                  <Row justify='center'>
                    <Button
                      type='primary'
                      onClick={() => {
                        let number = formData.parents?.[0].number;
                        if (number === 1) {
                          add({ number: 2 });
                        } else {
                          move(0, 1);
                          add({ number: 1 }, 0);
                        }
                      }}>
                      添加
                    </Button>
                  </Row>
                )}
              </React.Fragment>
            ));
          }}
        </Form.List>
        {/* <Form.Item
          name='position'
          label='职位'
          hasFeedback
          rules={[
            { required: true },
            { pattern: constant.pattern.cn_en_number, message: '仅支持中英文、数字' },
          ]}>
          <Input maxLength={5} placeholder='请输入' />
        </Form.Item> */}
      </Form>
    </Modal>
  );
}
