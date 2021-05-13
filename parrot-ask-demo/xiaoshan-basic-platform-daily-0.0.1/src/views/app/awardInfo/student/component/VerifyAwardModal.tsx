import React, { useRef, useState } from "react";
import {
  Button,
  Form,
  message,
  Modal,
  Select,
  Space,
  Radio,
  Input,
} from "antd";
import constant from "src/constant";
import GT from "types";
import FormItem from "antd/lib/form/FormItem";

// 获奖填报审批
export default function VerifyAwardModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("审批");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<any>();
  // 1 通过 2 驳回
  const [pass, setPass] = useState(1);
  const [content, setContent] = useState<string>();

  //审核类型 1学生填报审核 2教师填报审核（教师没有审批通过对话框）
  const [verifyType, setVerifyType] = useState(1);

  const tailLayout = {
    wrapperCol: { offset: 6 },
  };

  props.onRef({
    setVisible,
    setTitle,
    form: form,
    setVerifyType,
  });

  const handleOk = () => {
    form.validateFields().then(() => {
      setVisible(false);
      setLoading(false);
      let content1 = form.getFieldValue("passContent");
      let content2 = form.getFieldValue("rejectContent");
      let data = { result: pass, content: pass === 1 ? content1 : content2 };
      // 是否需要清除内容
      props.onOk && props.onOk(data);
    });
  };

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
  };

  const onChangeButton = (value: number) => {
    setPass(value);
    form.resetFields(["passContent"]);
    form.resetFields(["rejectContent"]);
  };

  return (
    <div>
      <Modal
        title={title}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        afterClose={handleCancel}
        confirmLoading={loading}
      >
        <Form
          preserve={false}
          form={form}
          initialValues={{}}
          {...constant.form.layout}
        >
          <Form.Item label="审批结果" name="result">
            <Radio.Group value={pass} defaultValue={1}>
              <Radio
                value={1}
                style={{ marginTop: "3px" }}
                onChange={() => onChangeButton(1)}
              >
                审批通过
              </Radio>

              {verifyType === 1 ? (
                <Form.Item
                  name="passContent"
                  rules={[
                    { required: pass === 1, whitespace: true, message: "请输入审批通过内容" },
                  ]}
                >
                  <Input
                    placeholder="请填写获奖奖励"
                    maxLength={50}
                    style={{ marginTop: "10px", width: 350 }}
                    disabled={pass === 2}
                  ></Input>
                </Form.Item>
              ) : null}
              <br />
              <Radio
                value={2}
                onChange={() => onChangeButton(2)}
                style={{ paddingTop: "10px" }}
              >
                审批驳回
              </Radio>
              <Form.Item
                name="rejectContent"
                rules={[{ required: pass === 2, whitespace: true, message: "请输入驳回内容" }]}
              >
                <Input.TextArea
                  placeholder="请输入"
                  style={{ marginTop: "10px", width: 350 }}
                  disabled={pass === 1}
                  maxLength={200}
                ></Input.TextArea>
              </Form.Item>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
