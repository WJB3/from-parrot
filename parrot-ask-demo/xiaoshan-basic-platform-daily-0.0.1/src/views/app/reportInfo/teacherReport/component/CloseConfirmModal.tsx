import { Button, Form, message, Modal, Input, Space } from "antd";
import GT from "types";
import React, { useEffect, useRef, useState } from "react";

export default function CloseConfirmModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("提示");
  const [content, setContent] = useState(
    "离开当前页面不会保存修改内容，确定离开吗？"
  );

  props.onRef({
    setVisible,
    setTitle,
    setContent,
  });

  const handleOk = () => {
    setVisible(false);
    props.onOk && props.onOk();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      title={title}
      centered
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <p>{content}</p>
    </Modal>
  );
}
