import React, { useState } from "react";
import { Form, Modal, Input,} from "antd";
import constant from "src/constant";
import GT from "types";
import api from "src/api";

/// 批量审核拒绝
export default function RefusedModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("请假审批-拒绝");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<any>();
  const [ids, setIds] = useState<number[]>([]);
  const fillRecordIds = (ids: number[]) => {
    setIds(ids);
  };
    
  props.onRef({
    setVisible,
    setTitle,
    form: form,
    fillRecordIds,
  });

  const handleOk = () => {
    if (ids.length == 0) {
      return;
    }
    form.validateFields().then(() => {
      setLoading(true);
      let data = form.getFieldsValue();
      api.leave.approvalBatch({'recordIds': ids.join(","), ...data})
      .then(() => {
        setVisible(false);
        setLoading(false);
        props.onOk && props.onOk();
      }).catch(()=> {
        setLoading(false);
      });
    });
  };

  const handleCancel = () => {
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
        <Form
          preserve={false}
          form={form}
          initialValues={{result: 2}}
          {...constant.form.layout}
        >
          <Form.Item label="请假审批" name="result" hidden>
          </Form.Item>
           
          <Form.Item label="备注" name="remark" style={{marginBottom: 10}}
            rules={[{ required: true, whitespace: true, message: "请输入备注" }]}>
                <Input
                  placeholder="请输入备注"
                  maxLength={50}></Input>
            </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}