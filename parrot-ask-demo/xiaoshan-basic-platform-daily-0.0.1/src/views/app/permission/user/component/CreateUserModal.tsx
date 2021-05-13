import React, { useRef, useState } from 'react';
import { Modal, Form, Input, message, Select, Button, Space } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import SelectOtherRoleModal from './SelectOtherRoleModal';

export default function CreateUserModal(props: GT.Modal.Props) {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('创建账号');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm<GT.DTO.CreateOtherDto>();
    const [formData, setFormData] = useState<GT.DTO.CreateOtherDto>();
    const [phone, setPhone] = useState<string>('');
  
    // 服务人员
    const [services, setServices] = useState<GT.Model.Service[]>();
    const getServices = (val: string) => {
        api.service
          .getPage({
            name: val,
            current: -1,
            size: -1,
            userState: false,
          })
          .then((res) => {
            setServices(res.list);
          });
      };

    // 角色
    const modal = useRef<GT.Modal.Ref>();

    props.onRef({
      setVisible,
      setTitle,
      form: form,
    });

    const handleOk = () => {
      form.validateFields().then(() => {
        const data = form.getFieldsValue();
        setLoading(true);
        api.user.createOthers({...formData!, phone: data.phone}).then(() => {
            setVisible(false);
            setFormData(undefined);
            message.success('新增成功');
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

    return (
        <div>
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
                {...constant.form.layout}
                onValuesChange={onValuesChange}>
                
                <Form.Item 
                    name='id'
                    label='选择服务人员'
                    hasFeedback
                    rules={[{required: true,}]}>
                    <Select
                    showSearch
                    showArrow
                    onSelect={(val, option) => {
                        const sp = val.toString().split(",");
                        if (sp.length == 2) {
                            const [serviceId, phone] = sp;
                            setFormData({id: Number(serviceId), phone: phone, roleIds: []});
                            setPhone(phone);
                            form.setFieldsValue({phone: phone});
                        } else {
                            const [serviceId] = sp;
                            setFormData({id: Number(serviceId), phone: '', roleIds: []});
                            form.setFieldsValue({phone: ''});
                            setPhone('');
                        }
                    }}
                    style={{ width: '100%' }}
                    onSearch={getServices}
                    getPopupContainer={() => document.body}
                    onDropdownVisibleChange={(open) => open && getServices('')}
                    placeholder='请输入'
                    filterOption={false}>
                        {services?.map((t) => (
                            <Select.Option value={t.phone ? `${t.id},${t.phone}`: t.id} title={t.name}>
                            <div>
                                <div>
                                <span style={{ fontSize: 13 }}>
                                    {t.name}{t.phone ? `(${t.phone})` : ''}
                                </span>
                                </div>
                                <div style={{ color: '#616266', fontSize: 12 }}>
                                {t.departmentName}
                                </div>
                            </div>
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                { 
                formData && <Form.Item
                    name='phone'
                    label='登录手机号'
                    hasFeedback
                    rules={[
                    {required: true},
                    { pattern: constant.pattern.phone, message: '请输入正确的手机号码' },
                    ]}>
                    <Input maxLength={20} placeholder={'请输入'} disabled={ phone.length > 0} />
                </Form.Item>}

                {
                    formData && <Form.Item
                    name='roleIds'
                    label='角色'>
                    <Space>
                    {
                    formData!.roleIds?.length ? (
                        <span style={{ fontSize: 13, color: '#616266' }}>
                        已选中<em style={{ color: '#5781F2' }}>{formData!.roleIds.length}</em>个
                        </span>
                    ) : null}
                    <Button
                        type='link'
                        onClick={() => {
                        modal.current?.setVisible(true);
                        modal.current?.form?.setFieldsValue({
                            id: formData!.id,
                            roleIds: formData.roleIds ? formData.roleIds: [],
                          });
                          modal.current?.setFormData({
                            id: formData!.id,
                            roleIds: formData.roleIds ? formData.roleIds: [],
                          });
                        }}>
                        选择
                    </Button>
                    </Space>
                    </Form.Item>
                }

                </Form>
            </Modal>
            <SelectOtherRoleModal
            onRef={(ref) => (modal.current = ref)}
            type={2}
            onOk={ (data) => {
                setFormData({id: formData!.id, phone: formData?.phone, roleIds: data});
                form.setFieldsValue({roleIds: data});
            }}></SelectOtherRoleModal>
        </div>
    );
}