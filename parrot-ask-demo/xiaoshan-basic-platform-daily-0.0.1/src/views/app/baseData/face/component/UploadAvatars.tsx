import React, { useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import UploadFiles from 'src/components/UploadFiles';

export default function UploadAvatarModal(
  props: GT.Modal.Props & { type: 'teacher' | 'student' | 'prestudent' | 'user' | 'service' },
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('上传');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<any>();
  props.onRef({
    setVisible,
    setTitle,
    form: form,
  });
  const handleOk = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      setLoading(true);
      let p: Promise<any>;
      if (props.type === 'teacher') {
        p = api.teacher.updateFace(data.id, {
          fileId: data.fileList[0].id || data.fileList[0].response.id,
        });
      } else if (props.type === 'student') {
        p = api.student.updateFace(data.id, {
          fileId: data.fileList[0].id || data.fileList[0].response.id,
          type: 1,
        });
      } else if (props.type === 'user') {
        p = api.user.updateAvatar({
          fileId: data.fileList[0].id || data.fileList[0].response.id,
        });
      } else if (props.type === 'prestudent') {
        p = api.student.updateFace(data.id, {
          fileId: data.fileList[0].id || data.fileList[0].response.id,
          type: 2,
        });
      } else {
        p = api.service.updateFace(data.id, {fileId: data.fileList[0].id || data.fileList[0].response.id,});
      }
      p.then(() => {
        setLoading(false);
        setVisible(false);
        props.onOk?.();
        Modal.info({
          title: '已成功上传，请10分钟后，查看本次下发结果！',
          content:
            '若本次下发结果为“失败”，请及时重新上传；若本次下发结果为“成功”，可以通过识别人脸进出校园。',
        });
      }).catch(() => {
        setLoading(false);
      });
    });
  };
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };

  const normFile = (e: any) => {
    return e;
  };
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={handleCancel}
      confirmLoading={loading}>
      <Form preserve={false} form={form} initialValues={{}} {...constant.form.layout}>
        <Form.Item name='id' hidden={true}></Form.Item>
        <Form.Item
          name='fileList'
          label='照片'
          rules={[{ required: true }]}
          hasFeedback
          getValueFromEvent={normFile}
          valuePropName='fileList'>
          <UploadFiles
            limit={1}
            crop={false}
            min={20}
            max={190}
            upload={{ accept: 'image/jpeg,image/jpg' }}></UploadFiles>
        </Form.Item>
        <Form.Item label='上传须知' hasFeedback>
          <div style={{ color: '#616266', fontSize: 13 }}>
            <p>1.上传正面免冠照</p>
            <p>2.照片需露出眉毛和眼睛，清晰可辨认；</p>
            <p>3.照片文件大小20KB~190KB，jpg或jpeg格式。</p>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

UploadAvatarModal.defaultProps = {
  type: 'teacher',
};
