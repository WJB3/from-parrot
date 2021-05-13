import React, { useState } from 'react';
import { Modal, Form, Input, message, TreeSelect, Select } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';
import { TreeNode } from 'antd/lib/tree-select';

const {Option} = Select;

export default function CreateServiceModal(props: GT.Modal.Props & { orgTree: GT.Model.Organization[]; node?: GT.Model.Organization; companyList: GT.Model.Company[];},) {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('新增服务人员');
    const [loading, setLoading] = useState(false);
    const { renderSelect, renderRadio } = useDictionary();
    const [form] = Form.useForm<GT.DTO.CreateServiceDto>();
    const [formData, setFormData] = useState<GT.DTO.CreateServiceDto>();
  
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
          api.service
            .update({
              ...data,
              companyId: data.companyId || null,
            })
            .then(() => {
              setVisible(false);
              message.success('编辑成功');
              props.onOk?.();
            })
            .catch(() => {
              setLoading(false);
            });
        } else {
          api.service
            .create(data)
            .then(() => {
              setVisible(false);
              message.success('新增成功');
              props.onOk?.();
            })
            .catch(() => {
              setLoading(false);
            });
        }
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
    const onIdNoValidator = (rule: any, value: any) => {
      const idType = form.getFieldValue('idType');
      if (idType === 0 && !constant.pattern.idNo.test(value)) {
        return Promise.reject(rule.message);
      }
      return Promise.resolve();
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

    const renderTreeCompany = (data: GT.Model.Company[]) => {
      return data.map( (item) => (
        <Option value={item.id} key={item.id}>{item.name}</Option>
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
          initialValues={{ departmentIds: props.node ? [props.node?.id] : [], idType: 0 }}
          {...constant.form.layout}
          onValuesChange={onValuesChange}>
          <Form.Item name='id' hidden={true}></Form.Item>
          <Form.Item
            name='name'
            label='姓名'
            hasFeedback
            rules={[{ required: true }, { whitespace: true }]}>
            <Input maxLength={20} placeholder='请输入' />
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
                <Input style={{ width: '60%' }} maxLength={18} placeholder='请输入' />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item
            name='phone'
            label='手机号码'
            hasFeedback
            rules={[
              { pattern: constant.pattern.phone, message: '请输入正确的手机号码' },
            ]}>
            <Input maxLength={20} placeholder={'请输入'} />
          </Form.Item>

          <Form.Item
            name='icCardNo'
            label='IC卡号'
            hasFeedback
            rules={[{ pattern: constant.pattern.natural_int, message: '仅支持数字' }]}>
            <Input maxLength={20} placeholder={'请输入'} />
          </Form.Item>
  
          <Form.Item name='gender' label='性别'>
            {renderRadio('gender')}
          </Form.Item>

          <Form.Item name='companyId' label='所属公司'>
            <Select
              placeholder={'请选择'}
              getPopupContainer={(node) => {
                if (node?.parentElement) {
                  return node.parentElement;
                }
                return document.body;
              }}
              allowClear>
            {renderTreeCompany(props.companyList || [])}
            </Select>
          </Form.Item>

          <Form.Item name='departmentIds' label='服务部门'>
            <TreeSelect
              showSearch
              treeDefaultExpandAll
              treeNodeFilterProp={'title'}
              placeholder='请输入'
              multiple
              allowClear
              disabled={!!props.node}>
              {renderTreeNode(props.orgTree || [])}
            </TreeSelect>
          </Form.Item>

        </Form>
      </Modal>
    );
}