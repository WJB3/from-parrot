import { useRequest } from "ahooks";
import {
  Row,
  Image,
  Tooltip,
  Space,
  Button,
  message,
  Col,
  Form,
  Input,
} from "antd";
import React, { useRef, useState } from "react";
import { useForm } from "antd/lib/form/Form";
import api from "src/api";
import { QuestionCircleOutlined } from "@ant-design/icons";
import UploadAvatarModal from "../app/baseData/face/component/UploadAvatars";
import GT from "types";
import useDictionary from "src/hook/useDictionary";
import UpdatePasswordModal from "./component/UpdatePassword";
import UpdatePhoneModal from "./component/UpdatePhone";
import { ActionType, useGlobalState } from "src/store";
import { token } from "src/utils";
import { Store } from "antd/lib/form/interface";
import IconFont from "src/components/IconFont";
import { RouteComponentProps } from "react-router-dom";
import UpdateConfirmModal from "../app/reportInfo/teacherReport/component/UpdateConfirmModal";
import constant from "src/constant";
export default function AccountSetting(props: RouteComponentProps) {
  const { data, refresh } = useRequest(api.user.getTeacherMe, {
    onSuccess: (data: GT.Model.TeacherFace, params: any[]) => {
      form.setFieldsValue({
        employeeNo: data.employeeNo,
        icCardNo: data.icCardNo,
      });
    },
  });
  const avatarModal = useRef<GT.Modal.Ref>();
  const pwdModal = useRef<GT.Modal.Ref>();
  const phoneModal = useRef<GT.Modal.Ref>();
  const { renderText } = useDictionary();
  const unbindModal = useRef<GT.Modal.Ref>();
  const [editFlag, setEditFlag] = useState(false);
  const [form] = useForm();
  const colors: Store = {
    0: "#3CC251",
    1: "#FE4F54",
  };
  return (
    <div
      style={{
        width: 1200,
        margin: "0 auto",
        marginTop: 20,
        background: "#fff",
        borderRadius: 5,
        padding: 10,
      }}
    >
      <Row>
        <Col flex="auto">
          <b>个人设置</b>
        </Col>
        <Col flex="80px">
          {editFlag ? (
            <Button
              type="primary"
              ghost
              onClick={() => {
                form.validateFields().then(() => {
                  api.user
                    .updateNumbers({
                      employeeNo: form.getFieldValue("employeeNo"),
                      icCardNo: form.getFieldValue("icCardNo"),
                    })
                    .then((value) => {
                      refresh();
                      setEditFlag(false);
                    });
                });
              }}
            >
              完成
            </Button>
          ) : (
            <Button
              onClick={() => {
                setEditFlag(true);
              }}
            >
              编辑
            </Button>
          )}
        </Col>
      </Row>
      <Row justify="center">
        <div>
          <p>
            {data?.url ? (
              <Image width={150} src={data?.url} />
            ) : (
              <Image
                preview={false}
                width={150}
                onClick={() => {
                  avatarModal.current?.setTitle("更换照片");
                  avatarModal.current?.setVisible(true);
                  avatarModal.current?.form?.setFieldsValue({ id: data?.id });
                }}
                src={
                  "http://gt-fe.oss-cn-beijing.aliyuncs.com/img/734b80d01cd211eb83bb39c31e54a3c4.png"
                }
              />
            )}
          </p>
          {data?.fileId ? (
            <p style={{ textAlign: "center", fontSize: 13, color: "#909499" }}>
              <Row align="middle">
                <span style={{ color: "#303133" }}>本次下发结果：</span>
                <span
                  style={{ color: colors[data.passResult], marginRight: 5 }}
                >
                  {renderText("passResult", data.passResult)}
                </span>
                <Tooltip
                  placement="top"
                  title={
                    "照片将作为通行校园的人脸识别依据，请务必上传正面免冠照片，清晰可辨认，如通行状态为失败，请及时更换。"
                  }
                >
                  <QuestionCircleOutlined />
                </Tooltip>
              </Row>
            </p>
          ) : null}
        </div>
        <div style={{ marginLeft: 50 }}>
          <p>
            <b style={{ fontFamily: "PingFang SC", fontSize: 16 }}>
              {data?.name}，您好
            </b>
          </p>
          <Form preserve={false} form={form} layout="horizontal">
            <Form.Item
              hidden={!editFlag}
              label="工号"
              name="employeeNo"
              rules={[
                {
                  pattern: constant.pattern.natural_int,
                  message: "仅支持数字",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input
                maxLength={20}
                allowClear={true}
                placeholder="请输入"
                style={{ width: 160, marginLeft: 12 }}
              />
            </Form.Item>
            <Form.Item
              hidden={!editFlag}
              label="IC卡号"
              name="icCardNo"
              rules={[
                {
                  pattern: constant.pattern.natural_int,
                  message: "仅支持数字",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input
                maxLength={20}
                allowClear={true}
                placeholder="请输入"
                style={{ width: 160 }}
              />
            </Form.Item>
            <div hidden={editFlag} style={{ marginBottom: 5 }}>
              工号：{data?.employeeNo}
            </div>
            <div hidden={editFlag} style={{ marginBottom: 5 }}>
              IC卡号：{data?.icCardNo}
            </div>
          </Form>
          <div style={{ marginBottom: 5 }}>部门：{data?.departmentName}</div>
          <div style={{ marginBottom: 5 }}>
            手机号：{data?.phone}
            <Tooltip
              placement="top"
              title={
                "手机号既是登录账号，也是接收校园通知短信的号码，如有变更，请及时修改。"
              }
            >
              <QuestionCircleOutlined style={{ color: "#5781F2" }} />
            </Tooltip>
          </div>
          {data?.nickname ? (
            <div style={{ marginBottom: 5 }}>
              微信设置：
              <span style={{ color: "#4E85FC" }}>{data.nickname}</span>
              <Tooltip
                placement="top"
                title={"可使用微信扫码登录和接收消息通知"}
              >
                <QuestionCircleOutlined style={{ color: "#5781F2" }} />
              </Tooltip>
            </div>
          ) : (
            <div style={{ marginBottom: 5 }}>微信设置：未绑定</div>
          )}
          <p style={{ marginTop: 20 }}>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  phoneModal.current?.setVisible(true);
                  phoneModal.current?.form?.setFieldsValue({
                    oldPhone: data?.phone,
                  });
                }}
              >
                修改手机号
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  pwdModal.current?.setVisible(true);
                }}
              >
                修改登录密码
              </Button>
              <Button
                type="primary"
                ghost
                onClick={() => {
                  avatarModal.current?.setTitle("更换照片");
                  avatarModal.current?.setVisible(true);
                  avatarModal.current?.form?.setFieldsValue({ id: data?.id });
                }}
              >
                更换照片
              </Button>
              {data?.nickname ? (
                <Button
                  icon={<IconFont type="iconwechat-red-copy" />}
                  danger
                  onClick={() => {
                    unbindModal.current?.setTitle("提示");
                    unbindModal.current?.setContent("确定解除微信绑定吗?");
                    unbindModal.current?.setVisible(true);
                  }}
                >
                  解绑微信
                </Button>
              ) : (
                <Button
                  icon={<IconFont type="iconwechat" />}
                  onClick={() => props.history.push("/account/bindwechat")}
                >
                  绑定微信
                </Button>
              )}
            </Space>
          </p>
        </div>
      </Row>
      <UploadAvatarModal
        type="user"
        onRef={(ref) => (avatarModal.current = ref)}
        onOk={refresh}
      ></UploadAvatarModal>
      <UpdatePasswordModal
        onRef={(ref) => (pwdModal.current = ref)}
        onOk={() => {
          token.remove();
          window.location.reload();
        }}
      ></UpdatePasswordModal>
      <UpdatePhoneModal
        onRef={(ref) => (phoneModal.current = ref)}
        onOk={refresh}
      ></UpdatePhoneModal>
      <UpdateConfirmModal
        onRef={(ref) => {
          unbindModal.current = ref;
        }}
        onOk={() => {
          api.base.unbindWeChat().then(() => {
            message.info("已成功解绑微信");
            refresh();
          });
        }}
      />
    </div>
  );
}
