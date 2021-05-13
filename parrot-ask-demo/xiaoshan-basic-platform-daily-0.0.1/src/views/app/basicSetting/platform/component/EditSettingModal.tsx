import React, { useState } from 'react';
import { Modal, Form, Input, message, Checkbox, Row, Tooltip, Radio } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import { QuestionCircleOutlined } from '@ant-design/icons';

export default function EditSettingModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('推送设置');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<GT.DTO.EditPushItemParmas>();
  const [formData, setFormData] = useState<GT.DTO.EditPushItemParmas>();
  // 是否有推送方式
  const [template, setTemplate] = useState(false);
  // 推送方式类型
  const [templates, setTemplates] = useState<GT.Model.PushTemplate[]>([]);
  // 各个推送方式打开
  const [bools, setBools] = useState([false, false, false, false, false])

  props.onRef({
    setVisible,
    setTitle,
    form: form,
    setTemplate,
    setTemplates,
    setBools,
  });

  const handleOk = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      setLoading(true);
      let body: {id?: number, openState: boolean}[] = [];
      for (let item of templates) {
        body.push({id: item.id, openState: bools[item.pushType]});
      }
      api.platform.edit(data['id'], body)
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

  const onChnageTemplates = (pushType: number) => {
    bools[pushType] = !bools[pushType];
  };

  const closeAll = ()=> {
    setBools([false, false, false, false, false]);
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
        {...constant.form.layout}
        onValuesChange={onValuesChange}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item
          name='applicationName'
          label='应用名称'>
          <Input bordered={false} placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='name'
          label='推送事项'>
          <Input bordered={false} placeholder={'请输入'} />
        </Form.Item>
        <Form.Item
          name='detail'
          label='推送描述'>
          <Input bordered={false} placeholder={'请输入'} />
        </Form.Item>
        <Form.Item
          name='openState'
          label='是否推送'
          hasFeedback
          rules={[{ required: true, message: '请选择是否推送' }]}>
          <Radio.Group onChange={(e) => {
            setTemplate(e.target.value == 1); 
            if (e.target.value == 0) {
              closeAll();
            }
            }}>
            {[[1,"是"], [0, "否"]].map(([val, label]) => {
              return <Radio value={val}>{label}</Radio>;
            })}
          </Radio.Group>
        </Form.Item>

        {template ?         
        <Form.Item name='templates' label='推送方式' rules={[{ required: true, message: '请选择推送方式' }]}>
          <Checkbox.Group>
            { templates.map((model)=> {
              if (model.pushType == 1) {
                return (
                  <Row>
                    <Checkbox value="pushTemplate1" onChange={() => onChnageTemplates(1)}>微信小程序推送</Checkbox>
                    <Tooltip
                    placement='right'
                    title={'微信小程序模板须在微信公众号官方平台审核通过才能生效！'}>
                      <QuestionCircleOutlined style={{ color: '#5781F2' }} />
                    </Tooltip>
                </Row>
                );
              } else if (model.pushType == 4) {
                return (
                  <Row>
                    <Checkbox value="pushTemplate4" onChange={() => onChnageTemplates(4)}>微信公众号推送</Checkbox>
                    <Tooltip
                    placement='right'
                    title={'微信公众号模板须在微信公众号官方平台审核通过才能生效！'}>
                      <QuestionCircleOutlined style={{ color: '#5781F2' }} />
                    </Tooltip>
                </Row>
                );
              } else if (model.pushType == 2) {
                return (
                  <Row>
                    <Checkbox value="pushTemplate2" onChange={() => onChnageTemplates(2)}>短信消息推送</Checkbox>
                    <Tooltip
                    placement='right'
                    title={'短信推送将产生费用，请谨慎选择！'}>
                      <QuestionCircleOutlined style={{ color: '#5781F2' }} />
                    </Tooltip>
                </Row>
                );
              } else {
                return (
                  <Row>
                    <Checkbox value="pushTemplate3" onChange={() => onChnageTemplates(3)}>站内消息推送</Checkbox>
                  </Row>
                );
              }
            })}

          </Checkbox.Group>
        </Form.Item> : null }

      </Form>
    </Modal>
  );
}
