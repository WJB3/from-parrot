import React, { useState } from "react";
import { Form, Modal, Input, message, Select } from "antd";
import constant from "src/constant";
import GT from "types";
import api from "src/api";
import { useMap } from "ahooks";

const { TextArea } = Input;

// 批量审批照片拒绝
export default function DownloadPhotoModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [classes, setClasses] = useState<GT.Model.ClassBean[]>([]);
  const [enrollmentYear, setEnrollmentYear] = useState<number>(0);
  const [form] = Form.useForm();
  const [map, { get, set, setAll }] = useMap<string, any>(new Map());

  // 1是学考照 2是毕业照
  const [type, setType] = useState(1);

  props.onRef({
    setVisible,
    setTitle,
    setType,
    setEnrollmentYear,
  });

  const getClasses = (open: boolean) => {
    const param = {
      current: -1,
      size: -1,
      enrollmentYear: enrollmentYear,
      sectionId: 1,
    };
    api.collection.getClasses(param).then((value) => {
      setClasses(value.list);
    });
  };

  const handleOk = () => {
    form.validateFields().then(() => {
      const ids = form.getFieldValue("ids");
      map.set("ids", ids);
      map.set("type", type);
      //获取选中的第一个班级的名字
      map.set(
        "name",
        classes[
          classes?.findIndex((value) => {
            return value.id == ids[0];
          })
        ].name
      );
      props.onOk?.(map);
      setVisible(false);
    });
  };

  const handleCancel = () => {
    setVisible(false);
    form.setFieldsValue({ ids: [] });
  };

  return (
    <div>
      <Modal
        title={title}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        afterClose={handleCancel}
      >
        <Form form={form} layout="horizontal">
          <Form.Item
            label="请选择班级"
            name="ids"
            rules={[{ required: true, message: "请选择至少一个班级" }]}
          >
            <Select
              placeholder="请选择"
              allowClear={true}
              style={{ width: "100%" }}
              mode="multiple"
              onDropdownVisibleChange={getClasses}
            >
              {classes?.map((classBean) => (
                <Select.Option value={classBean.id}>
                  {classBean.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
