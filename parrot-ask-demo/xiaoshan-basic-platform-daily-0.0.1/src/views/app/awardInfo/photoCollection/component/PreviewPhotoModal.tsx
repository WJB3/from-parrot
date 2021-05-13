import React, { useState, useEffect } from "react";
import { Form, Modal, Input, message, Radio, Image, Button } from "antd";
import constant from "src/constant";
import useDownload from "src/hook/useDownload";
import GT from "types";
import api from "src/api";

// 预览照片审核
export default function PreviewPhotoModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("预览");
  const { download } = useDownload();

  // 通过/拒绝 0,1
  const [examResult, setExamResult] = useState<number>();
  const [educationResult, setEducationResult] = useState<number>();
  const [canEditExamReason, setCanEditExamReason] = useState(false);
  const [canEditEduReason, setCanEditEduReason] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<any>();
  const [studentModel, setStudentModel] = useState<GT.Model.CollectionRecord>();
  const fillRecordIds = (model: GT.Model.CollectionRecord) => {
    console.log("传入了参数", model);
    setStudentModel({ ...model });
  };

  useEffect(() => {
    if (studentModel?.graduationPhotoStatus !== undefined) {
      studentModel.graduationPhotoStatus > -1 &&
        setEducationResult(studentModel.graduationPhotoStatus);
      setCanEditEduReason(
        studentModel.graduationPhotoStatus == 0 ||
          studentModel.graduationPhotoStatus == -1
      );
      console.log("设置毕业审批状态", studentModel.graduationPhotoStatus);
      studentModel.graduationPhotoStatus > -1 &&
        form.setFieldsValue({
          graduationPhotoStatus: studentModel.graduationPhotoStatus,
        });
      studentModel.graduationPhotoStatus === 1 &&
        form.setFieldsValue({
          graduationRejectReason: studentModel.graduationRejectReason,
        });
    }
    if (studentModel?.studyPhotoStatus !== undefined) {
      studentModel.studyPhotoStatus > -1 &&
        setExamResult(studentModel.studyPhotoStatus);
      setCanEditExamReason(
        studentModel.studyPhotoStatus == 0 ||
          studentModel.studyPhotoStatus == -1
      );
      console.log("设置考试状态", studentModel.studyPhotoStatus);
      studentModel.studyPhotoStatus > -1 &&
        form.setFieldsValue({
          studyPhotoStatus: studentModel.studyPhotoStatus,
        });
      studentModel.studyPhotoStatus === 1 &&
        form.setFieldsValue({
          studyRejectReason: studentModel.studyRejectReason,
        });
    }
  }, [studentModel]);

  props.onRef({
    setVisible,
    setTitle,
    form: form,
    fillRecordIds,
  });

  const renderTotalStatus = () => {
    // 渲染采集状态
    // 采集状态 -2:未提交 -1:待审核 0:已通过 1:已拒绝
    // 渲染tips 审核状态 待审核 已通过 已拒绝 -1 0 1
    let color = ["#FF8948", "#3CC251", "#FE4F54"];
    let background = ["#FF894826", "#3CC25126", "#FE4F5426"];
    let titles = ["待审核", "已通过", "已拒绝"];

    let textColor = color[0];
    let backColor = background[0];
    let statusTitle = "待审核";

    textColor =
      color[
        studentModel?.status !== undefined
          ? studentModel.status > -2
            ? studentModel.status + 1
            : 0
          : 0
      ];
    backColor =
      background[
        studentModel?.status !== undefined
          ? studentModel.status > -2
            ? studentModel.status + 1
            : 0
          : 0
      ];
    statusTitle =
      titles[
        studentModel?.status !== undefined
          ? studentModel.status > -2
            ? studentModel.status + 1
            : 0
          : 0
      ];

    return (
      <div
        style={{
          height: "30px",
          lineHeight: "30px",
          verticalAlign: "middle",
          width: "70px",
          position: "absolute",
          fontSize: "13px",
          top: "12px",
          left: "65px",
          borderRadius: "3px",
          textAlign: "center",
          color: textColor,
          backgroundColor: backColor,
        }}
      >
        {statusTitle}
      </div>
    );
  };

  const renderStatus = (isGraducation: boolean) => {
    let color = ["#FF8948", "#3CC251", "#FE4F54"];
    let background = ["#FF894826", "#3CC25126", "#FE4F5426"];
    let titles = ["待审核", "已通过", "已拒绝"];

    let textColor = color[0];
    let backColor = background[0];
    let statusTitle = "待审核";
    if (isGraducation) {
      // 返回毕业照
      textColor =
        color[
          studentModel?.graduationPhotoStatus !== undefined
            ? studentModel.graduationPhotoStatus + 1
            : 0
        ];
      backColor =
        background[
          studentModel?.graduationPhotoStatus !== undefined
            ? studentModel.graduationPhotoStatus + 1
            : 0
        ];
      statusTitle =
        titles[
          studentModel?.graduationPhotoStatus !== undefined
            ? studentModel.graduationPhotoStatus + 1
            : 0
        ];
    } else {
      // 返回学考
      textColor =
        color[
          studentModel?.studyPhotoStatus !== undefined
            ? studentModel.studyPhotoStatus + 1
            : 0
        ];
      backColor =
        background[
          studentModel?.studyPhotoStatus !== undefined
            ? studentModel.studyPhotoStatus + 1
            : 0
        ];
      statusTitle =
        titles[
          studentModel?.studyPhotoStatus !== undefined
            ? studentModel.studyPhotoStatus + 1
            : 0
        ];
    }
    return (
      <div
        style={{
          height: "30px",
          lineHeight: "30px",
          verticalAlign: "middle",
          width: "70px",
          marginTop: "20px",
          textAlign: "center",
          backgroundColor: backColor,
          color: textColor,
          fontSize: "13px",
        }}
      >
        {statusTitle}
      </div>
    );
  };

  const handleOk = () => {
    form.validateFields().then(() => {
      setLoading(true);
      let data = form.getFieldsValue();
      console.log(data);
      // 审核数据
      api.collection
        .approvalSinglePhoto({
          id: studentModel?.id,
          ...data,
        })
        .then(() => {
          form.resetFields();
          setExamResult(undefined);
          setEducationResult(undefined);
          setVisible(false);
          setLoading(false);
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
    setExamResult(undefined);
    setEducationResult(undefined);
  };

  const onChangeButton = (value: number) => {
    if (value === 0) {
      // 变为通过
      setCanEditExamReason(true);
      form.resetFields(["studyRejectReason"]);
    }
    setExamResult(value);
  };

  return (
    <div>
      <Modal
        title={title}
        visible={visible}
        width={"694px"}
        onOk={handleOk}
        onCancel={handleCancel}
        afterClose={handleCancel}
        confirmLoading={loading}
      >
        {renderTotalStatus()}
        <div>
          <div
            style={{
              top: "20px",
              height: "70px",
              background: "rgba(87, 129, 242, 0.1)",
              border: "1px solid #ffffff",
              borderRadius: "6px",
            }}
          >
            <div style={{ marginLeft: "17px", marginTop: "10px" }}>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#303133",
                  fontFamily: "PingFang SC",
                }}
              >
                {studentModel?.name}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#333333",
                  fontFamily: "PingFang SC Regular",
                }}
              >
                &nbsp;&nbsp;&nbsp;{studentModel?.className}班
              </span>
            </div>
            <div
              style={{
                marginLeft: "17px",
                marginTop: "4px",
                fontSize: "14px",
                color: "#333333",
                fontFamily: "PingFang SC Regular",
              }}
            >
              {studentModel?.idNo}
            </div>
          </div>
          {/* form */}
          <Form
            preserve={false}
            form={form}
            {...{
              labelCol: { span: 6 },
              wrapperCol: { span: 24 },
            }}
            layout={"vertical"}
          >
            {/* 内部代码 */}
            <div
              style={{
                marginTop: "20px",
                height: "271px",
                background: "rgba(249, 249, 250, 1)",
                border: "1px solid #C6C8CC",
                borderRadius: "6px",
                display: "flex",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* 照片和下载按钮 */}
                <Image
                  style={{ marginTop: "20px", marginLeft: "20px" }}
                  className="preview_Image_collection"
                  width={114}
                  height={160}
                  src={studentModel?.studyPhotoUrl}
                />
                <div
                  style={{
                    marginBottom: "10px",
                    marginTop: "8px",
                    marginLeft: "15px",
                  }}
                >
                  高考学考照片
                </div>
                <Button
                  style={{ width: "100px", marginLeft: "15px" }}
                  type="primary"
                  size="small"
                  ghost
                  onClick={() => {
                    // 下载学考
                    if (studentModel?.studyPhotoUrl) {
                      download({
                        url: studentModel.studyPhotoUrl,
                        fileName: studentModel.idNo + ".png",
                      });
                    }
                  }}
                >
                  下载学考照
                </Button>
              </div>
              <div style={{ marginLeft: "60px", marginTop: "20px" }}>
                <Form.Item
                  label="审批结果"
                  name="studyPhotoStatus"
                  rules={[{ required: true, message: "请选择审批结果" }]}
                >
                  <Radio.Group
                    style={{ display: "flex", flexDirection: "column" }}
                    value={examResult}
                  >
                    <Radio
                      value={0}
                      style={{ marginTop: "3px", marginBottom: "10px" }}
                      onChange={() => onChangeButton(0)}
                    >
                      通过
                    </Radio>
                    )
                    <Radio value={1} onChange={() => onChangeButton(1)}>
                      拒绝
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name="studyRejectReason"
                  style={{ marginBottom: 10 }}
                  rules={[
                    {
                      required: examResult === 1,
                      whitespace: true,
                      message: "请填写拒绝原因",
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder="请填写拒绝原因(必填)"
                    style={{
                      marginTop: "-10px",
                      width: "350px",
                      maxHeight: "140px",
                      height: "70px",
                      visibility: examResult === 1 ? "visible" : "hidden",
                    }}
                    disabled={!canEditExamReason}
                    maxLength={200}
                  ></Input.TextArea>
                </Form.Item>
              </div>
              {renderStatus(false)}
            </div>
            {/* 第二个FormItem */}
            <div
              style={{
                marginTop: "20px",
                height: "271px",
                background: "rgba(249, 249, 250, 1)",
                border: "1px solid #C6C8CC",
                borderRadius: "6px",
                display: "flex",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* 照片和下载按钮 */}
                <Image
                  style={{ marginTop: "20px", marginLeft: "20px" }}
                  className="preview_Image_collection"
                  width={114}
                  height={160}
                  src={studentModel?.graduationPhotoUrl}
                />
                <div
                  style={{
                    marginBottom: "10px",
                    marginTop: "8px",
                    marginLeft: "15px",
                  }}
                >
                  毕业证照片
                </div>
                <Button
                  style={{ width: "100px", marginLeft: "15px" }}
                  type="primary"
                  size="small"
                  ghost
                  onClick={() => {
                    //
                    if (studentModel?.graduationPhotoUrl) {
                      download({
                        url: studentModel.graduationPhotoUrl,
                        fileName: studentModel.idNo + ".png",
                      });
                    }
                  }}
                >
                  下载毕业证照
                </Button>
              </div>
              <div style={{ marginLeft: "60px", marginTop: "20px" }}>
                <Form.Item
                  label="审批结果"
                  name="graduationPhotoStatus"
                  rules={[{ required: true, message: "请选择审批结果" }]}
                >
                  <Radio.Group
                    style={{ display: "flex", flexDirection: "column" }}
                    value={educationResult}
                  >
                    <Radio
                      value={0}
                      style={{ marginTop: "3px", marginBottom: "10px" }}
                      onChange={() => {
                        setEducationResult(0);
                        setCanEditEduReason(true);
                        form.resetFields(["graduationRejectReason"]);
                      }}
                    >
                      通过
                    </Radio>
                    )
                    <Radio
                      value={1}
                      onChange={() => {
                        setEducationResult(1);
                      }}
                    >
                      拒绝
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name="graduationRejectReason"
                  style={{ marginBottom: 10 }}
                  rules={[
                    {
                      required: educationResult === 1,
                      whitespace: true,
                      message: "请填写拒绝原因",
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder="请填写拒绝原因(必填)"
                    style={{
                      marginTop: "-10px",
                      width: "350px",
                      maxHeight: "140px",
                      height: "70px",
                      visibility: educationResult === 1 ? "visible" : "hidden",
                    }}
                    disabled={!canEditEduReason}
                    maxLength={200}
                  ></Input.TextArea>
                </Form.Item>
              </div>
              {renderStatus(true)}
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
