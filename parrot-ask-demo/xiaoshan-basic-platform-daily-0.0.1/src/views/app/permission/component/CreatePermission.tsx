import React, { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Radio, message, TreeSelect, Upload } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import UploadFiles from 'src/components/UploadFiles';
import { TreeNode } from 'antd/lib/tree-select';
const { Option } = Select;

export default function CreatePermissionModal(
  props: GT.Modal.Props & { treeData: GT.Model.Menu[] },
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('新增子节点');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<GT.DTO.CreatePermissionDto | GT.Model.Menu>();
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
        api.permission
          .update({
            ...data,
            iconUrl: data.iconUrl?.[0]?.url || data.iconUrl?.[0]?.response.url,
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
        api.permission
          .create({
            ...data,
            iconUrl: data.iconUrl?.[0]?.url || data.iconUrl?.[0]?.response.url,
          })
          .then(() => {
            setVisible(false);
            message.success('新增子节点成功');
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
    form.resetFields();
    setLoading(false);
  };
  const normFile = (e: any) => {
    return e;
  };
  const renderTreeNode = (data: GT.Model.Menu[]) => {
    return data.map((item) => (
      <TreeNode value={item.id} title={item.zhName}>
        {item.permissions && renderTreeNode(item.permissions)}
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
      <Form preserve={false} form={form} {...constant.form.layout} initialValues={{ iconUrl: [] }}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item name='parentId' label='父节点'>
          <TreeSelect
            showSearch
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder='请选择'
            allowClear
            treeNodeFilterProp='title'
            treeDefaultExpandedKeys={props.treeData.map((item) => item.id)}>
            {renderTreeNode(props.treeData)}
          </TreeSelect>
        </Form.Item>

        <Form.Item
          name='name'
          label='英文名'
          hasFeedback
          rules={[
            { required: true },
            { pattern: constant.pattern.en_name, message: '仅支持英文和下划线' },
          ]}>
          <Input maxLength={30} />
        </Form.Item>
        <Form.Item
          name='zhName'
          label='中文名'
          hasFeedback
          rules={[
            { required: true },
            { pattern: constant.pattern.cn_en_number, message: '仅支持中英文、数字' },
          ]}>
          <Input maxLength={30} />
        </Form.Item>
        <Form.Item label='请求路径' name='path'>
          <Input placeholder='请输入' maxLength={200} />
        </Form.Item>
        <Form.Item label='菜单图标' name='navBarIconUrl'>
          <Input placeholder='请输入' maxLength={30} />
        </Form.Item>
        <Form.Item
          label='应用图标'
          name='iconUrl'
          valuePropName='fileList'
          getValueFromEvent={normFile}>
          <UploadFiles
            limit={1}
            upload={{ accept: 'image/jpeg,image/jpg,image/png' }}></UploadFiles>
        </Form.Item>
        <Form.Item name='sort' label='排序值' rules={[{ required: true }]}>
          <InputNumber min={0} step={1} precision={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
