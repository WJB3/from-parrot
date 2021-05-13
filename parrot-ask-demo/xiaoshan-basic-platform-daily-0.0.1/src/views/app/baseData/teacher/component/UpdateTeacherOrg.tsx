import React, { useState } from 'react';
import { Modal, Form, Input, message, TreeSelect } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';
import { TreeNode } from 'antd/lib/tree-select';

export default function UpdateTeacherOrgModal(
  props: GT.Modal.Props & { orgTree: GT.Model.Organization[]; node?: GT.Model.Organization },
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('加入部门');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<GT.DTO.CreateTeacherDto>();
  const [formData, setFormData] = useState<GT.DTO.CreateTeacherDto>();

  props.onRef({
    setVisible,
    setTitle,
    form: form,
  });
  const handleOk = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      setLoading(true);
      api.teacher
        .update(data)
        .then(() => {
          setVisible(false);
          message.success('编辑成功');
          props.onOk?.();
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
  const renderTreeNode = (data: GT.Model.Organization[]) => {
    return data.map((item) => (
      <TreeNode
        value={item.id}
        title={item.name}
        selectable={item.type === 2}
        disabled={item.type === 1}>
        {item.departments && renderTreeNode(item.departments)}
      </TreeNode>
    ));
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
        initialValues={{ departmentIds: props.node ? [props.node?.id] : [] }}
        {...constant.form.layout}
        onValuesChange={onValuesChange}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item
          name='name'
          label='姓名'
          hidden={true}
          hasFeedback
          rules={[{ required: true }, { whitespace: true }]}>
          <Input maxLength={20} placeholder='请输入' />
        </Form.Item>

        <Form.Item
          name='phone'
          hidden={true}
          label='手机号码'
          hasFeedback
          rules={[
            { required: true },
            { pattern: constant.pattern.phone, message: '请输入正确的手机号码' },
          ]}>
          <Input maxLength={20} placeholder={'请输入'} />
        </Form.Item>
        <Form.Item
          name='employeeNo'
          label='职工号'
          hidden={true}
          hasFeedback
          rules={[{ pattern: constant.pattern.natural_int, message: '仅支持数字' }]}>
          <Input maxLength={20} placeholder={'请输入'} />
        </Form.Item>
        <Form.Item
          name='icCardNo'
          label='IC卡号'
          hidden={true}
          hasFeedback
          rules={[
            { required: true },
            { pattern: constant.pattern.natural_int, message: '仅支持数字' },
          ]}>
          <Input maxLength={20} placeholder={'请输入'} />
        </Form.Item>
        <Form.Item label='证件号码' required hidden={true}>
          <Input.Group compact>
            <Form.Item
              name='idType'
              hidden={true}
              label='证件类型'
              noStyle
              rules={[{ required: true }]}></Form.Item>
            <Form.Item
              hasFeedback
              dependencies={['idType']}
              name='idNo'
              hidden={true}
              label='证件号码'
              noStyle
              rules={[{ required: true }]}>
              <Input style={{ width: '50%' }} maxLength={18} />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item
          name='gender'
          hidden={true}
          label='性别'
          rules={[{ required: true }]}></Form.Item>
        <Form.Item name='budgetedPost' label='编制' hidden={true}></Form.Item>
        <Form.Item name='departmentIds' label='部门' rules={[{ required: true }]}>
          <TreeSelect
            showSearch
            treeNodeFilterProp={'title'}
            placeholder='请输入'
            multiple
            disabled={!!props.node}>
            {renderTreeNode(props.orgTree || [])}
          </TreeSelect>
        </Form.Item>
      </Form>
    </Modal>
  );
}
