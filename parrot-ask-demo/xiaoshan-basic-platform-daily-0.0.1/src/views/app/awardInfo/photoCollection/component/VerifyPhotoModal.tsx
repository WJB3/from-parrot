import React, { useState } from "react";
import { Form, Modal, Input, message } from "antd";
import constant from "src/constant";
import GT from "types";
import api from "src/api";

const { TextArea } = Input;

// 批量审批照片拒绝
export default function VerifyPhotoModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("批量拒绝");
  // 1是学考照 2是毕业照
  const [type, setType] = useState<number>();

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<any>();
  const [ids, setIds] = useState<number[]>([]);
  const fillRecordIds = (ids: number[]) => {
    setIds(ids);
  };

  props.onRef({
    setVisible,
    setTitle,
    setType,
    form: form,
    fillRecordIds,
  });

  const handleOk = () => {
    if (ids.length == 0) {
      message.info(`请选择至少一项数据`);
      return;
    }
    form.validateFields().then(() => {
      setLoading(true);
      let data = form.getFieldsValue();
      console.log(ids, data);
      // 使用批量拒绝接口
      api.collection
        .approvalPhotos({
          recordIds: ids,
          ...data,
          approval: false,
          type: type,
        })
        .then(() => {
          setVisible(false);
          setLoading(false);
          message.success("批量拒绝成功");
          form.resetFields();
          props.onOk && props.onOk();
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
        <Form preserve={false} form={form} {...constant.form.layout}>
          <Form.Item
            name="rejectReason"
            label="拒绝原因"
            hasFeedback
            rules={[{ required: true }, { whitespace: true }]}
          >
            <TextArea
              rows={4}
              maxLength={200}
              placeholder={"请填写拒绝原因(必填)"}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
