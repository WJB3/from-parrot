import React, { useState } from 'react';
import { Modal } from 'antd';
import ReactJson from 'react-json-view';

import GT from 'types';

export default function JsonModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('详情');
  const [json, setJSON] = useState({});
  props.onRef({
    setVisible,
    setTitle,
    setJSON,
  });
  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      title={title}
      visible={visible}
      footer={false}
      onCancel={handleCancel}
      closable
      afterClose={handleCancel}
      bodyStyle={{ padding: 0 }}>
      <ReactJson
        src={json}
        theme='monokai'
        indentWidth={4}
        style={{ padding: 10 }}
        name={false}
        displayDataTypes={false}
      />
    </Modal>
  );
}
