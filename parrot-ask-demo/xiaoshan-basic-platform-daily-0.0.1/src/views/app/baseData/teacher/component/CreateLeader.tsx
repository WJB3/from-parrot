import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';

export default function CreateOrgLeaderModal(
  props: GT.Modal.Props & { node: GT.Model.Organization },
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('部门领导');
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<GT.Model.Teacher[]>([]);
  const [form] = Form.useForm<GT.DTO.CreateOrganizationLeaderDto>();
  const [admin,setAdmin] = useState(false);
  props.onRef({
    setVisible,
    setTitle,
    form: form,
    setAdmin
  });
  const handleOk = () => {
    if(admin){
      form.validateFields().then(() => {
        const data = form.getFieldsValue();
        api.organization
          .createAdminLeader({
            departmentId: props.node?props.node.id:999,
            teacherId: data.teacherId,
            management: true,
          })
          .then((res) => {
            message.success('设置成功');
            setVisible(false);
            props.onOk?.();
          })
          .catch(() => {
            setLoading(false);
          });
      });
    }else{
      form.validateFields().then(() => {
        const data = form.getFieldsValue();
        api.organization
          .createLeader({
            departmentId: props.node.id,
            teacherId: data.teacherId,
            position: data.position,
          })
          .then((res) => {
            message.success('设置成功');
            setVisible(false);
            props.onOk?.();
          })
          .catch(() => {
            setLoading(false);
          });
      });
    }
    
  };
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
    setTeachers([]);
  };
  const onSearch = (value: string) => {
    api.organization
      .getTeachersByName({
        params: {
          name: value,
          departmentId: props.node?props.node.id:0,
        },
      })
      .then((res) => {
        setTeachers(res);
      });
  };

  useEffect(()=>{
    console.log("----------admin---------",admin,visible)
    if(admin){
      form.setFieldsValue({
        position:'主任/管理员'
      });
      setTitle("部门主任/管理员")
    }else{
      form.setFieldsValue({
        position:''
      });
      setTitle("部门其他领导")
    }
  
  },[admin,form,visible]);

  return (
    <Modal
      title={`设置${title}`}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={handleCancel}
      confirmLoading={loading}>
      <Form preserve={false} form={form} initialValues={{}} {...constant.form.layout}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item name='teacherId' label={title} rules={[{ required: true }]} hasFeedback>
          <Select
            showSearch
            showArrow
            onSearch={onSearch}
            onDropdownVisibleChange={(open) => open && onSearch('')}
            placeholder='请输入'
            filterOption={false}>
            {teachers.map((t) => (
              <Select.Option value={t.id}>
                <div>
                  <div>
                    <span style={{ fontSize: 13 }}>{t.name}</span>
                    <span style={{ fontSize: 12, color: '#909499' }}>({t.phone})</span>
                  </div>
                  <div style={{ color: '#616266', fontSize: 12 }}>{t.departmentName}</div>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name='position'
          label='职位'
          hasFeedback
          rules={[
            { required: true },
            // { pattern: constant.pattern.cn_en_number, message: '仅支持中英文、数字' },
          ]}>
          <Input maxLength={5} placeholder='请输入' disabled={admin} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
