//@ts-nocheck
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

export default function CreateStudentModal(props: GT.Modal.Props & { defaultClassId?: number[] }) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增学生');
  const [loading, setLoading] = useState(false);
  const { renderSelect, renderRadio } = useDictionary();
  const [form] = Form.useForm<GT.DTO.CreateStudentDto>();
  const [formData, setFormData] = useState<GT.DTO.CreateStudentDto>();
  const { data = [] } = useRequest(() => api.section.getTree({ all: false }));
  const handler = (list: any[]) => {
    return list.map((d) => {
      const r: any = {
        label: d.sectionName || d.gradeName || d.className,
        value: d.sectionId || d.enrollmentYear || d.classId,
      };
      if (d.nodes) {
        r.children = handler(d.nodes);
      }
      return r;
    });
  };
  const options = handler(data);
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
          .update({
            ...data,
            classId: data.classId[2],
            studentType: data.studentType || null,
            studentLivingCondition: data.studentLivingCondition || null,
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
          .create({
            ...data,
            classId: data.classId[2],
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
  console.log("defaultClassId",props.defaultClassId,options)
  let filterOption=null;
  if(props.mode==="class"){
    filterOption=options.filter(item=>item.value===props.defaultClassId[0]).map((item)=>{
      return ({
        ...item,
        children:item.children.filter(item=>item.value===props.defaultClassId[1])
      })
    })
  }else{
    filterOption=options;
  }
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
          idType: 0,
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
          name='studentNo'
          label='学号'
          hasFeedback
          validateFirst
          rules={[
            { required: true },
            { pattern: constant.pattern.natural_int, message: '仅支持数字' },
          ]}>
          <Input maxLength={20} placeholder={'请输入'} />
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
              {renderSelect('idType', { style: { width: '40%' } })}
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
              <Input style={{ width: '60%' }} maxLength={18} />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item
          hasFeedback
          name='classId'
          label='班级'
          rules={[{ required: true, message: '请选择班级' }]}>
          <Cascader
            disabled={(!!props.defaultClassId && props.mode!=="class")}
            placeholder='请选择'
            options={filterOption}></Cascader>
        </Form.Item>

        <Form.Item name='gender' label='性别' rules={[{ required: true, message: '请选择性别' }]}>
          {renderRadio('gender')}
        </Form.Item>
        <Form.Item name='studentType' label='学生类型'>
          {renderSelect('studentType', { allowClear: true })}
        </Form.Item>
        {/* <Form.Item name='livingCondition' label='住校情况'>
          {renderSelect('studentLivingCondition', { allowClear: true })}
        </Form.Item> */}
      </Form>
    </Modal>
  );
}
