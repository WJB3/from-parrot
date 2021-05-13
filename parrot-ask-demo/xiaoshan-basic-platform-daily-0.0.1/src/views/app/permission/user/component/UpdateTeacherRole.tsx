import React, { useState } from 'react';
import { Modal, Form, message, Checkbox, Tag, Space, Input } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import { useRequest } from 'ahooks';

export default function UpdateTeacherRoleModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('分配角色');
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const { data: roles } = useRequest(api.user.getTeacherRolesOptions);
  const [form] = Form.useForm<{ id: number; roleIds: number[] }>();
  const [formData, setFormData] = useState<{ id: number; roleIds: number[] }>();
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
      api.user
        .updateTeacherRoles(data.id, data.roleIds)
        .then(() => {
          setVisible(false);
          message.success('分配成功');
          props.onOk && props.onOk();
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };
  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    setLoading(false);
  };
  const onValuesChange = (val: any, all: any) => {
    setFormData(all);
  };
  const roleMap = new Map<number, GT.Model.Role>();
  roles?.forEach((item) => {
    roleMap.set(item.id, item);
  });
  const onClose = (i: number) => {
    const roleIds = formData?.roleIds || [];
    roleIds?.splice(i, 1);
    if (formData) {
      setFormData({
        id: formData.id,
        roleIds,
      });
      form.setFieldsValue({
        ...formData,
        roleIds,
      });
    }
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
        initialValues={{ state: 0 }}
        {...constant.form.layout}
        onValuesChange={onValuesChange}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <p style={{ fontSize: 13, color: '#909499' }}>
          已选择对象{formData?.roleIds?.length || 0}个
        </p>
        <p>
          <Space style={{ flexWrap: 'wrap' }}>
            {formData?.roleIds.map((id, index) => (
              <Tag
                closable
                color='#EDEEEF'
                onClose={() => onClose(index)}
                style={{ color: '#303133', lineHeight: '30px', marginBottom: 10 }}
                visible
                closeIcon={
                  <CloseCircleFilled
                    style={{
                      color: 'red',
                      fontSize: 14,
                    }}
                  />
                }>
                {roleMap.get(id)?.zhName}
              </Tag>
            ))}
          </Space>
        </p>
        <p>
          <Input.Search
            placeholder='请输入角色名称'
            onSearch={(val) => setKeyword(val)}></Input.Search>
        </p>
        <Form.Item name='roleIds'>
          <Checkbox.Group>
            {roles?.map((role) => (
              <p style={{ display: role.zhName.includes(keyword) ? 'block' : 'none' }}>
                <Checkbox value={role.id}>{role.zhName}</Checkbox>
              </p>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
