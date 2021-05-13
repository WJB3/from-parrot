import { Button, Form, message, Modal, Input, Space } from "antd";
import GT from "types";
import React, { useEffect, useRef, useState } from "react";

export default function UpdateConfirmModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("再次提交");
  const [content, setContent] = useState(
    "确认要再次提交填报内容吗？"
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
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <p>{content}</p>
    </Modal>
  );
}
