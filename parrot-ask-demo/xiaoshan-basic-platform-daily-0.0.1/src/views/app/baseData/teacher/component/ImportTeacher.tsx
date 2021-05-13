import React, { useState } from 'react';
import { Modal, Select, Button } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import GT from 'types';
import SimpleSteps from 'src/components/SimpleSteps';
const { Option } = Select;

export default function ImportTeacherModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('批量导入');
  const [loading, setLoading] = useState(false);

  props.onRef({
    setVisible,
    setTitle,
  });
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
  };
  const steps = [
    {
      title: '第一步',
      desc:
        '点击下载Excel模板，并按照填表须知提示在Excel内录入教师信息（注：教师手机号不允许重复）。',
      content: (
        <Button type='primary' ghost icon={<DownloadOutlined />}>
          下载Excel模板
        </Button>
      ),
    },
    {
      title: '第二步',
      desc: '点击上传编辑好的Excel文件，建议单次导入数据不超过500条。',
      content: (
        <Button type='primary' ghost icon={<UploadOutlined />}>
          上传文件
        </Button>
      ),
    },
  ];
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleCancel}
      onCancel={handleCancel}
      afterClose={handleCancel}
      confirmLoading={loading}>
      <SimpleSteps datasource={steps}></SimpleSteps>
    </Modal>
  );
}
