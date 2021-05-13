import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Select, Checkbox, Row } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import { PushTemplate } from 'types/model/platform';

const {Option} = Select;
const { TextArea } = Input;

export default function CreatePushModal(props: GT.Modal.Props & { node?: GT.Model.Menu[]}) {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('添加推送事项');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm<GT.DTO.CreatePushItemParmas>();
    const [formData, setFormData] = useState<GT.DTO.CreatePushItemParmas>();
    const [pushTemplate1, setPushTemplate1] = useState<PushTemplate>({pushType: 1, openState: false, content: ''});
    const [pushTemplate2, setPushTemplate2] = useState<PushTemplate>({pushType: 2, openState: false, content: ''});
    const [pushTemplate3, setPushTemplate3] = useState<PushTemplate>({pushType: 3, openState: false, content: ''});
    const [pushTemplate4, setPushTemplate4] = useState<PushTemplate>({pushType: 4, openState: false, content: ''});

    props.onRef({
      setVisible,
      setTitle,
      form: form,
      setPushTemplate1,
      setPushTemplate2,
      setPushTemplate3,
      setPushTemplate4,
    });
    const handleOk = () => {
      form.validateFields().then(() => {
        const data = form.getFieldsValue();
        // let templates: PushTemplate[] = [pushTemplate1, pushTemplate2, pushTemplate3].filter((e) => e.openState);
        let templates: PushTemplate[] = [pushTemplate1, pushTemplate4, pushTemplate2, pushTemplate3];
        data['templates'] = templates
        setLoading(true);
        if (data.id) {
          api.platform
            .update(data.id, data)
            .then(() => {
              setVisible(false);
              message.success('编辑成功');
              resetPushItem();
              props.onOk?.();
            })
            .catch(() => {
              setLoading(false);
            });
        } else {
          api.platform
            .create(data)
            .then(() => {
              setVisible(false);
              message.success('新增成功');
              resetPushItem();
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
      resetPushItem();
    };
    const onValuesChange = (val: any, all: any) => {
      setFormData(all);
    };

    const resetPushItem = () => {
      setPushTemplate1({content:'', pushType: 1, openState: false});
      setPushTemplate2({content:'', pushType: 2, openState: false});
      setPushTemplate3({content:'', pushType: 3, openState: false});
      setPushTemplate4({content:'', pushType: 4, openState: false});
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
          {...constant.form.layout}
          onValuesChange={onValuesChange}>
          <Form.Item name='id' hidden={true}></Form.Item>
          <Form.Item
            name='applicationId'
            label='应用名称'
            hasFeedback
            rules={[{ required: true }]}>
              <Select placeholder='请选择'>
                {props.node?.map((app) => (
                  <Select.Option value={app.id} key={app.id}> {app.zhName}</Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name='code'
            label='事项编码'
            hasFeedback
            rules={[{ required: true }, { whitespace: true }]}>
            <Input maxLength={50} placeholder={'请输入'}/>
          </Form.Item>

          <Form.Item
            name='name'
            label='推送事项'
            hasFeedback
            rules={[{ required: true }, { whitespace: true }]}>
            <Input maxLength={50} placeholder={'请输入'} />
          </Form.Item>

          <Form.Item
            name='detail'
            label='推送描述'
            hasFeedback
            rules={[{ required: true }, { whitespace: true }]}>
            <TextArea rows={4} maxLength={200} placeholder={'请输入'} />
          </Form.Item>
  
          <Form.Item name='templates' label='消息模板' rules={[{ required: true, message: '请选择推送方式' }]}>
            <Checkbox.Group>
              <Row>
                <Checkbox value='pushTemplate1' onChange={(e) => {
                  setPushTemplate1({content: pushTemplate1.content, pushType: pushTemplate1.pushType, openState:  e.target.checked})
                }}>微信小程序消息模板</Checkbox>
              </Row>
              <p style={{color: 'red', marginBottom: 0}}>注：微信小程序模板须在微信公众号官方平台审核通过才能生效</p>
              <Row>
                <TextArea id='wx' rows={4} maxLength={200} placeholder={'请填写微信小程序消息模板'} 
                value={pushTemplate1.content}
                onChange={(e) => setPushTemplate1({content: e.target.value, pushType: pushTemplate1.pushType, openState: pushTemplate1.openState})} />
              </Row>
              <Row>
                <Checkbox value='pushTemplate4' onChange={(e) => {
                  setPushTemplate4({content: pushTemplate4.content, pushType: pushTemplate4.pushType, openState:  e.target.checked})
                }}>微信公众号消息模板</Checkbox>
              </Row>
              <Row>
                <TextArea id='wxc' rows={4} maxLength={200} placeholder={'请填写微信公众号消息模板'} 
                value={pushTemplate4.content}
                onChange={(e) => setPushTemplate4({content: e.target.value, pushType: pushTemplate4.pushType, openState: pushTemplate4.openState})} />
              </Row>
              <Row>
                <Checkbox value='pushTemplate2' onChange={(e) => {
                  setPushTemplate2({content: pushTemplate2.content, pushType: pushTemplate2.pushType, openState:  e.target.checked})
                }}>短信消息模板</Checkbox>
              </Row>
              <Row>
                <TextArea id='sms' rows={4} maxLength={200} placeholder={'请填写短信消息模板'} 
                value={pushTemplate2.content}
                onChange={(e) => setPushTemplate2({content: e.target.value, pushType: pushTemplate2.pushType, openState: pushTemplate2.openState})} />
              </Row>
              <Row>
                <Checkbox value='pushTemplate3' onChange={(e) => {
                  setPushTemplate3({content: pushTemplate3.content, pushType: pushTemplate3.pushType, openState:  e.target.checked, title: pushTemplate3.title})
                }}>站内消息模板</Checkbox>
              </Row>
              <Row>
                <Input maxLength={50} placeholder={'请填写信息标题'} value={pushTemplate3.title} style={{marginBottom: 10}}
                onChange={(e) => setPushTemplate3({content: pushTemplate3.content, pushType: pushTemplate3.pushType, openState: pushTemplate3.openState, title: e.target.value})}></Input>
                <TextArea id='message' rows={4} maxLength={200} placeholder={'请填写站内消息模板'} 
                value={pushTemplate3.content}
                onChange={(e) => setPushTemplate3({content: e.target.value, pushType: pushTemplate3.pushType, openState: pushTemplate3.openState, title: pushTemplate3.title})} />                
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name='extra'
            label='其他参数'
            hasFeedback>
              <TextArea autoSize={{minRows: 1, maxRows: 6}} maxLength={200} placeholder={'请输入'} />
          </Form.Item>

        </Form>
      </Modal>
    );
}