import React, { useState } from 'react';
import { Modal, Form, Input, Select, message, Button } from 'antd';
import api from 'src/api';
import constant from 'src/constant';
import GT from 'types';
import UploadFiles from 'src/components/UploadFiles';
import { UploadOutlined } from '@ant-design/icons';

export default function BatchUploadAvatarModal(
  props: GT.Modal.Props & { type: 'teacher' | 'student' | 'prestudent' | 'service' },
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('批量导入');
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
        p = api.teacher.importFace({
          fileId: data.fileList[0].id || data.fileList[0].response.id,
        });
      } else if (props.type === 'service') {
        p = api.service.importFace({fileId: data.fileList[0].id || data.fileList[0].response.id,});
      } else {
        p = api.student.importFace({
          type: props.type === 'student' ? 1 : 2,
          fileId: data.fileList[0].id || data.fileList[0].response.id,
        });
      }

      p.then(() => {
        setLoading(false);
        setVisible(false);
        props.onOk?.();
        Modal.info({
          title:
            '照片正在导入系统并同步到设备，期间需花费20~60分钟，请稍后在“查看导入记录”中查看导入结果。！',
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

  const normFile = (e: any, file: any) => {
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
        <div style={{ fontSize: 13, color: '#616266' }}>
          <p>1.导入人员正面免冠照，导入前建议确认照片对应的人员信息是否存在；</p>
          <p>2.支持导入300MB以内的ZIP文件，建议文件中包含照片数量在1500张以内；</p>
          <p>3.照片命名规则为：姓名_证件号码.jpg，需露出眉毛和眼睛；</p>
          <p>4.单张照片文件大小20KB~190KB 。</p>
        </div>
        <Form.Item
          name='fileList'
          getValueFromEvent={normFile}
          valuePropName='fileList'
          validateFirst
          rules={[
            { required: true, message: '请上传文件' },
            {
              validator: (rule, val: any[]) => {
                if (val?.every((item) => item.status === 'done')) {
                  return Promise.resolve();
                }
                return Promise.reject('文件上传中');
              },
            },
          ]}>
          <UploadFiles
            limit={1}
            upload={{
              listType: undefined,
              accept: 'application/zip,application/x-zip-compressed',
            }}
            max={300 * 1024}>
            <Button icon={<UploadOutlined />} type='primary' ghost>
              上传文件
            </Button>
          </UploadFiles>
        </Form.Item>
      </Form>
    </Modal>
  );
}

BatchUploadAvatarModal.defaultProps = {
  type: 'teacher',
};
