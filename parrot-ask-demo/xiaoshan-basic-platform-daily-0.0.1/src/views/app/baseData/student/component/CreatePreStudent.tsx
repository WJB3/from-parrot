import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  message,
  TreeSelect,
  Cascader,
} from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';
import { useRequest } from 'ahooks';
import { TreeNode } from 'antd/lib/tree-select';
import { CascaderOptionType } from 'antd/lib/cascader';
const { Option } = Select;

export default function CreatePreStudentModal(
  props: GT.Modal.Props & { sectionId: number; enrollmentYear: number; defaultClassId?: number },
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增学生');
  const [loading, setLoading] = useState(false);
  const { renderSelect, renderRadio } = useDictionary();
  const [form] = Form.useForm<GT.DTO.CreateStudentDto>();
  const [formData, setFormData] = useState<GT.DTO.CreateStudentDto>();
  const { data: classes, loading: classLoading } = useRequest(() =>
    api.section.getClasses({
      sectionId: props.sectionId,
      enrollmentYear: props.enrollmentYear,
      all: true,
    }),
  );
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
        api.student
          .updatePre({
            ...data,
          })
          .then(() => {
            setVisible(false);
            message.success('编辑成功');
            props.onOk && props.onOk();
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        api.student
          .createPre({
            ...data,
          })
          .then(() => {
            setVisible(false);
            message.success('新增成功');
            props.onOk && props.onOk();
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
  };
  const onValuesChange = (val: any, all: any) => {
    setFormData(all);
  };
  const onIdNoValidator = (rule: any, value: any) => {
    const idType = form.getFieldValue('idType');
    if (idType === 0 && !constant.pattern.idNo.test(value)) {
      return Promise.reject(rule.message);
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
        initialValues={{
          classId: props.defaultClassId,
        }}
        {...constant.form.layout}
        onValuesChange={onValuesChange}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item
          name='name'
          label='姓名'
          hasFeedback
          rules={[{ required: true }, { whitespace: true }]}>
          <Input maxLength={10} placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='icCardNo'
          label='IC卡号'
          hasFeedback
          validateFirst
          rules={[
            { required: true },
            { pattern: constant.pattern.natural_int, message: '仅支持数字' },
          ]}>
          <Input maxLength={20} placeholder={'请输入'} />
        </Form.Item>
        <Form.Item label='证件号码' required>
          <Input.Group compact>
            <Form.Item
              name='idType'
              label='证件类型'
              noStyle
              rules={[{ required: true, message: '请选择证件类型' }]}>
              {renderSelect('idType', { style: { width: '50%' } })}
            </Form.Item>
            <Form.Item
              hasFeedback
              dependencies={['idType']}
              name='idNo'
              label='证件号码'
              noStyle
              validateFirst
              rules={[
                { required: true },
                { validator: onIdNoValidator, message: '请输入正确的身份证' },
              ]}>
              <Input style={{ width: '50%' }} maxLength={18} />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item
          hasFeedback
          name='classId'
          label='班级'
          rules={[{ required: true, message: '请选择班级' }]}>
          <Select placeholder='请输入' loading={classLoading} disabled={!!props.defaultClassId}>
            {classes?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name='gender' label='性别' rules={[{ required: true, message: '请选择性别' }]}>
          {renderRadio('gender')}
        </Form.Item>
      </Form>
    </Modal>
  );
}
