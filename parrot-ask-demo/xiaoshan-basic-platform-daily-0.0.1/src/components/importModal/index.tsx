import React, { useRef, useState } from "react";
import { Modal, Form, Button, message } from "antd";
import api from "src/api";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import GT from "types";
import UploadFiles from "src/components/UploadFiles";
import SimpleSteps from "../SimpleSteps";
import useDownload from "src/hook/useDownload";
import constant from "src/constant";
import ImportResultModal from "./Result";

export default function ImportExcelModal(
  props: GT.Modal.Props & {
    type:
      | "teacher"
      | "student"
      | "prestudent"
      | "building"
      | "parent"
      | "service"
      | "assessment";
    studentQuery?: GT.DTO.SearchStudentParams;
    buildingQuery?: any;
  }
) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("上传");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<any>();
  const resultModal = useRef<GT.Modal.Ref>();
  const { download } = useDownload();

  const [itemId, setItemId] = useState<number>(0);
  const [taskId, setTaskId] = useState<number>(0);

  props.onRef({
    setVisible,
    setTitle,
    setItemId,
    setTaskId,
    form: form,
  });
  const handleOk = () => {
    form.validateFields().then(() => {
      const data = form.getFieldsValue();
      setLoading(true);
      const d = new FormData();
      d.append("file", data.fileList[0].originFileObj);
      let p: Promise<any>;
      switch (props.type) {
        case "teacher":
          p = api.teacher.importExcel(d);
          break;
        case "student":
          p = api.student.importExcel(d, {
            params: props.studentQuery,
          });
          break;
        case "prestudent":
          p = api.student.importPreExcel(d, {
            params: props.studentQuery,
          });
          break;
        case "building":
          p = api.building.importRoomExcel(d, {
            params: props.buildingQuery,
          });
          break;
        case "parent":
          p = api.student.importParentExcel(d, {
            params: props.studentQuery,
          });
          break;
        case "service":
          p = api.service.importExcel(d);
          break;
        case "assessment":
          d.append("itemId", itemId.toString());
          d.append("taskId", taskId.toString());
          p = api.assessment.importAssessmentExcel(d);
          break;
        default:
          p = api.teacher.importExcel(d);
          break;
      }
      p.then((res) => {
        if (res.wrongData) {
          resultModal.current?.setData(res);
          resultModal.current?.setVisible(true);
        } else {
          message.success(`成功导入${res.correctData}条`);
        }
        props.onOk?.();
        setVisible(false);
      }).catch(() => {
        setLoading(false);
      });
    });
  };
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
  };
  const normFile = (e: any) => {
    return e;
  };
  const downloadTpl = () => {
    switch (props.type) {
      case "teacher":
        api.teacher.getExcelTpl().then(download);
        break;
      case "student":
        api.student.getExcelTpl().then(download);
        break;
      case "prestudent":
        api.student.getPreExcelTpl().then(download);
        break;
      case "building":
        api.building.getRoomExcelTpl().then(download);
        break;
      case "parent":
        api.student.getParentExcelTpl().then(download);
        break;
      case "service":
        api.service.getTemplate().then(download);
        break;
      case "assessment":
        api.assessment
          .getTemplate(itemId as number, taskId as number)
          .then(download);
        break;
      default:
        break;
    }
  };
  let firstDesc;
  switch (props.type) {
    case "teacher":
      firstDesc =
        "点击下载Excel模板，并按照填表须知提示在Excel内录入教师信息（注：教师手机号不允许重复）。";
      break;
    case "student":
      firstDesc =
        "点击下载Excel模板，并按照填表须知提示在Excel内录入学生信息（注：一个学生只能存在一个班级）。";
      break;
    case "prestudent":
      firstDesc =
        "点击下载Excel模板，并按照填表须知提示在Excel内录入学生信息（注：一个学生只能存在一个班级）。";
      break;
    case "building":
      firstDesc =
        "点击下载Excel模板，并按照填表须知提示在Excel内录入房间信息。";
      break;
    case "parent":
      firstDesc =
        "点击下载Excel模板，并按照填表须知提示在Excel内录入家长信息。";
      break;
    case "service":
      firstDesc =
        "点击下载Excel模板，并按照填表须知提示在Excel内录入服务人员信息（注：服务人员手机号不允许重复）。";
      break;
    case "assessment":
      firstDesc =
        "点击下载Excel模板，并按照填表须知提示在Excel内录入教师考核分数。";
      break;
    default:
      break;
  }
  const onFileValidator = (rule: any, val: any) => {
    const file = val?.[0];
    if (
      file?.type &&
      !"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel".includes(
        file?.type
      )
    ) {
      return Promise.reject("文件类型错误");
    }
    return Promise.resolve();
  };
  const steps = [
    {
      title: "第一步",
      desc: firstDesc,
      content: (
        <Button
          type="primary"
          ghost
          icon={<DownloadOutlined />}
          onClick={downloadTpl}
        >
          下载Excel模板
        </Button>
      ),
    },
    {
      title: "第二步",
      desc: "点击上传编辑好的Excel文件，建议单次导入数据不超过1500条。",
      content: (
        <Form.Item
          name="fileList"
          validateFirst
          rules={[
            { required: true, message: "请选择文件" },
            { validator: onFileValidator },
          ]}
          getValueFromEvent={normFile}
          valuePropName="fileList"
        >
          <UploadFiles
            limit={1}
            max={5 * 1024}
            upload={{
              accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.ms-excel,.xls,.xlsx",
              listType: undefined,
              beforeUpload: () => false,
            }}
          >
            <Button type="primary" ghost icon={<UploadOutlined />}>
              上传文件
            </Button>
          </UploadFiles>
        </Form.Item>
      ),
    },
  ];

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
          <SimpleSteps datasource={steps}></SimpleSteps>
        </Form>
      </Modal>
      <ImportResultModal
        type={props.type}
        onRef={(ref) => (resultModal.current = ref)}
        onOk={() => setVisible(true)}
      ></ImportResultModal>
    </div>
  );
}

ImportExcelModal.defaultProps = {
  type: "teacher",
};
