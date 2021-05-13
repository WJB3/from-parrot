import React, { useState } from "react";
import { Button, Form, message, Modal, Radio, Input, Cascader, Select,} from "antd";
import constant from "src/constant";
import GT from "types";
import { useRequest } from "ahooks";
import api from "src/api";

export default function VerifyModal(props: GT.Modal.Props & {recordIds: number[], needCountersignature: boolean, student: GT.Model.Student, onCancel?: ()=>void}) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("请假审批");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<any>();
  // 1 通过 2 驳回
  const [pass, setPass] = useState<number>();
  // 是否有加签人，needCountersignature && pass = 1
  const [other, setOther] = useState(false);

  // 老师组织数据
  const { data = [] } = useRequest(
    () => api.section.getGradeLeaders({
      params: {
        enrollmentYear: props.student.enrollmentYear,
        sectionId: props.student.sectionId,
      },
    }),
    {
      refreshDeps: [props.student],
    },
  );
    
  props.onRef({
    setVisible,
    setTitle,
    form: form,
  });

  const handleOk = () => {
    form.validateFields().then(() => {
      setLoading(true);
      let data = form.getFieldsValue();
      if (data.result == 1) {
        data.remark = data.content1;
      } else {  
        data.remark = data.content2;
      }
      api.leave.approvalBatch({'recordIds': props.recordIds.join(","), ...data})
      .then(() => {
        setVisible(false);
        setLoading(false);
        message.info("审批成功");
        props.onOk && props.onOk();
      }).catch(()=> {
        setLoading(false);
      });
    });
  };

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    props.onCancel && props.onCancel();
  };

  const onChangeButton = (value: number) => {
    setPass(value);
    if (value == 1 && props.needCountersignature) {
      setOther(true);
    } else {
      setOther(false);
    }
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
          <Form.Item label="请假审批" name="result" rules={[{required: true}]}>
            <Radio.Group value={pass}>
              <Radio
                value={1}
                style={{ marginTop: "3px" }}
                onChange={() => onChangeButton(1)}
              >
                同意
              </Radio>

              <Form.Item
                name="content1"
                style={{marginBottom: 10}}
                rules={[
                  { whitespace: true, message: "请输入备注" },
                ]}
              >
                <Input
                  placeholder="备注"
                  style={{ marginTop: "10px", width: 350 }}
                  maxLength={50}
                  disabled={pass === 2}
                ></Input>
              </Form.Item>
            ) 
              <Radio
                value={2}
                onChange={() => onChangeButton(2)}
              >
                拒绝（<span style={{color: '#FE4F54'}}>*</span>如拒绝，请添加备注信息）
              </Radio>
              <Form.Item
                name="content2"
                style={{marginBottom: 10}}
                rules={[{ required: pass === 2, whitespace: true, message: "请输入备注" }]}
              >
                <Input.TextArea
                  placeholder="备注"
                  style={{ marginTop: "10px", width: 350 }}
                  disabled={pass === 1}
                  maxLength={50}
                ></Input.TextArea>
              </Form.Item>
            </Radio.Group>
          </Form.Item>
          {other == true ? <Form.Item label="审批人员" name="teacherIds" rules={[{ required: true }]}>
              <Select style={{ width: 350 }} allowClear>
                {data.map((e) => {
                    return <Select.Option value={e.teacherId} key={e.teacherId}>{e.name}</Select.Option>;
                  })}
              </Select>
              {/* <Cascader
              placeholder='请选择'
              options={options} style={{ width: 350 }} /> */}
            </Form.Item> : null }
        </Form>
      </Modal>
    </div>
  );
}