import React, { useEffect, useRef, useState } from "react";
import { Button, Form, message, Modal, Input, Space } from "antd";
import GT from "types";
import constant from "src/constant";

export default function CustomAwardLevelModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("获奖等级名称");
  const [customName, setCustomName] = useState<string>("");

  const [listName, setListName] = useState();
  const [itemName, setItemName] = useState();
  const [index, setIndex] = useState(0);
  const [form] = Form.useForm<any>();

  props.onRef({
    setVisible,
    setTitle,
    setListName,
    setItemName,
    setIndex,
  });

  const handleOk = () => {
    // 把自定义的值传出
    const isEmpty = constant.pattern.isEmpty.test(customName);
    // if (customName === "" || isEmpty) {
    //   message.warning("请输入有效名称");
    // } else {}
    form.validateFields().then(() => {
      setVisible(false);
      setLoading(false);
      props.onOk &&
        props.onOk({
          name: customName,
          listName: listName,
          itemName: itemName,
          index: index,
        });
        form.resetFields();
    });
  };

  const handleCancel = () => {
    // 重置数据
    setCustomName("");
    setVisible(false);
    setLoading(false);
    if (customName === "") {
      props.onOk &&
        props.onOk({ listName: listName, itemName: itemName, index: index });
    }
    form.resetFields();
  };

  const onValueChange = (e: any) => {
    setCustomName(e.target.value);
  };

  return (
    <div>
      <Modal
        title="获奖等级名称"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        afterClose={handleCancel}
        confirmLoading={loading}
      >
        {/* 添加form表单去展示 */}
        <Form
          preserve={false}
          form={form}
          initialValues={{}}
          // {...constant.form.layout}
        >
          <Form.Item label="" 
            name="awardName" 
            rules={[{ required: true, whitespace: true, message: "请输入有效名称" }]}>
            <Input
              placeholder="请填写自定义获奖等级名称"
              value={customName}
              maxLength={20}
              onChange={onValueChange}
            ></Input>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
