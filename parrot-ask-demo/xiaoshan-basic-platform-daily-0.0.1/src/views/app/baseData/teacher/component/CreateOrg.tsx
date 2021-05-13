import React, { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, message, TreeSelect } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import { TreeNode } from 'antd/lib/tree-select';
import { useRequest } from 'ahooks';
const { Option } = Select;

export default function CreateOrgModal(
  props: GT.Modal.Props & { orgTree: GT.Model.Organization[] },
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增部门');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [disabled, setDisabled] = useState<boolean>(false);
  const [form] = Form.useForm<GT.DTO.CreateOrganizationDto>();
  const { data: orgList } = useRequest(() =>
    api.organization.getPage({
      params: {
        current: -1,
        size: -1,
        type: 1,
        defaultState: 0,
      },
    }),
  );
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
      if (data.id) {
        api.organization
          .update(data)
          .then(() => {
            message.success('编辑成功');
            props.onOk && props.onOk();
            setVisible(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        api.organization
          .create(data)
          .then(() => {
            message.success('新增成功');
            props.onOk && props.onOk();
            setVisible(false);
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
    setFormData({});
  };
  const onValuesChange = (val: any, all: any) => {
    setFormData(all);
  };
  const renderTreeNode = (data: GT.Model.Organization[]) => {
    return data.map((item) => <TreeNode value={item.id} title={item.name}></TreeNode>);
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
        initialValues={{}}
        onValuesChange={onValuesChange}
        {...constant.form.layout}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item
          name='name'
          label='部门名称'
          hasFeedback
          rules={[
            { required: true },
            { pattern: constant.pattern.cn_en_number, message: '仅支持中英文、数字' },
          ]}>
          <Input maxLength={10} placeholder='请输入' />
        </Form.Item>

        <Form.Item
          name='type'
          label='部门类型'
          extra={'注：部门组是多个部门的合集，人员只能添加到部门中'}
          rules={[{ required: true, message: '请选择部门类型' }]}>
          <Select placeholder='请选择' disabled={formData.id || disabled}>
            <Option value={2}>部门</Option>
            <Option value={1}>部门组</Option>
          </Select>
        </Form.Item>
        {formData.type === 2 && (
          <Form.Item name='parentId' label='上级部门' extra={'注：若没有上级部门组，可以不选'}>
            <TreeSelect showSearch treeNodeFilterProp='title' disabled={disabled}>
              {renderTreeNode(orgList?.list || [])}
            </TreeSelect>
          </Form.Item>
        )}

        <Form.Item name='sort' label='部门序号' rules={[{ required: true }]}>
          <InputNumber min={0} step={1} precision={0} max={999} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
