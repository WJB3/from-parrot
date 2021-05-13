/*
 * @Author: xuhansong
 * @Date: 2020-08-27 15:45:15
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-10-21 11:38:42
 * 登录页面
 */
import React, { useRef, useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Spin,
  Layout,
  Row,
  message,
  Col,
  Modal,
} from "antd";
import * as style from "./style";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { useGlobalState, ActionType } from "src/store";
import { RouteComponentProps } from "react-router-dom";
import api from "src/api";
import { token } from "src/utils";
import qs from "qs";

import GT from "types";
import VerifyCode from "src/components/VerifyCode";
import { FormInstance } from "antd/lib/form";
import IconFont from "src/components/IconFont";
import { useDebounceFn, useInterval } from "ahooks";
const { Content } = Layout;

export default function Login(props: RouteComponentProps) {
  const [, dispatch] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  //登录模式 false（账号密码登录）true（扫码登录）
  const [qrCodeModeFlag, setQrCodeModeFlag] = useState(false);
  //是否扫码
  const [scanFlag, setScanFlag] = useState(false);
  //二维码是否过期
  const [invalidFlag, setInvalidFlag] = useState(false);
  //微信公众号二维码url
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const formRef = useRef<FormInstance<any> | null>();
  //公众号二维码false，微信授权登录二维码true
  const [wxFlag, setWxFlag] = useState(false);
  const [count, setCount] = useState(
    Number(localStorage.getItem("login_count")) || 0
  );
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };
  const tailLayout = {
    wrapperCol: { offset: 0, span: 24 },
  };

  useEffect(() => {
    if (token.getLastLoginMode()) {
      //账号密码登陆 “0” 二维码登陆“1”
      setQrCodeModeFlag(token.getLastLoginMode() === "1");
    }
  }, []);

  const [interval, setInterval] = useState<number>();
  //轮询请求扫码状态（公众号登录）
  useInterval(
    () => {
      if (qrCodeModeFlag) {
        api.base
          .getQrCodeState(
            qs.parse(qrCodeUrl.split("?")[1]).ticket?.toString(),
            undefined
          )
          .then((value) => {
            if (value === 1) {
              Modal.warning({
                title: "该微信尚未绑定",
                content: "请使用账号密码登录后，绑定微信，再尝试扫码登录",
                okText: "我知道了",
                okButtonProps: { type: "ghost" },
                onOk: () => setQrCodeModeFlag(false),
              });
              setInterval(undefined);
            } else if (value === 2) {
              setInterval(undefined);
              api.base
                .login(
                  {
                    grant_type: "wx_ticket",
                    wx_ticket: qs
                      .parse(qrCodeUrl.split("?")[1])
                      .ticket?.toString(),
                  },
                  {
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                  }
                )
                .then((res) => {
                  if (
                    res.user_info.roles.includes("ROLE_admin") ||
                    res.user_info.roles.includes("ROLE_teacher_default") ||
                    res.user_info.roles.includes("ROLE_service") ||
                    res.user_info.roles.includes("ROLE_system_admin")
                  ) {
                    token.setQrLogined("1");
                    token.setLastLoginMode("1")
                    dispatch({ type: ActionType.LOGINSUCCESS, payload: res });
                    props.history.push("/workspace");
                    localStorage.setItem("login_count", "");
                  } else {
                    message.error("当前微信未绑定");
                    getQrCode();
                  }
                })
                .catch(() => {
                  getQrCode();
                });
            }
          });
      }
    },
    interval,
    { immediate: true }
  );

  //二维码有效期十分钟，倒计时9分钟
  const { run: timeOut, cancel: cancelTimeOut } = useDebounceFn(
    () => {
      setInvalidFlag(true);
    },
    { wait: 1000 * 60 * 9 }
  );

  //授权登陆
  useEffect(() => {
    if (qs.parse(props.location.search.substr(1)).code) {
      api.base
        .login(
          {
            grant_type: "wx_web_code",
            wx_web_code: qs
              .parse(props.location.search.substr(1))
              .code?.toString(),
          },
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then((res) => {
          if (
            res.user_info.roles.includes("ROLE_admin") ||
            res.user_info.roles.includes("ROLE_teacher_default") ||
            res.user_info.roles.includes("ROLE_service") ||
            res.user_info.roles.includes("ROLE_system_admin")
          ) {
            token.setQrLogined("1");
            token.setLastLoginMode("1")
            dispatch({ type: ActionType.LOGINSUCCESS, payload: res });
            props.history.push("/workspace");
            localStorage.setItem("login_count", "");
          } else {
            props.history.replace("login");
            message.error("当前微信未绑定");
            Modal.warning({
              title: "该微信尚未绑定",
              content: "请使用账号密码登录后，绑定微信，再尝试扫码登录",
              okText: "我知道了",
              okButtonProps: { type: "ghost" },
              onOk: () => setQrCodeModeFlag(false),
            });
          }
        })
        .catch(() => {
          props.history.replace("login");
          Modal.warning({
            title: "该微信尚未绑定",
            content: "请使用账号密码登录后，绑定微信，再尝试扫码登录",
            okText: "我知道了",
            okButtonProps: { type: "ghost" },
            onOk: () => setQrCodeModeFlag(false),
          });
        });
    }
  }, [props.location.search]);

  useEffect(() => {
    getQrCode();
  }, []);

  useEffect(() => {
    if (qrCodeModeFlag) {
      getQrCode();
    } else {
      setInterval(undefined);
      cancelTimeOut();
    }
  }, [qrCodeModeFlag]);

  //获取二维码
  const getQrCode = () => {
    //是否扫码登录过，登录过显示授权码，未登录过显示公众号二维码
    if (token.getQrLogined()) {
      setWxFlag(true);
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src = "https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js";
      const wxElement = document.body.appendChild(s);
      wxElement.onload = function () {
        var obj = new (window as any).WxLogin({
          id: "qrCode", // 需要显示的容器id
          appid: "wx177d1eb06be526e7", // 公众号appid
          scope: "snsapi_login", // 网页默认即可
          //redirect_uri: "http%3a%2f%2flocalhost%2f%23%2flogin", // 授权成功后回调的url(本地)
          redirect_uri: (window as any).BaseApp.baseURL
          ? "https%3a%2f%2fplatform.xshs.cn%2f%23%2flogin"
          : "https%3a%2f%2fplatform.xshs.cn%2ftest%2findex.html%23%2flogin", // 授权成功后回调的url
          state: "STATE", // 可设置为简单的随机数加session用来校验
          style: "black", // 提供"black"、"white"可选。二维码的样式
          href: "https://zs.xshs.cn:8288/css/qrcode.css", // 外部css（查看二维码的dom结构，根据类名进行样式覆盖）文件url，需要https
        });
      };
    } else {
      setWxFlag(false);
      api.base.getPublicQrCode().then((value) => {
        setInvalidFlag(false);
        setQrCodeUrl(value);
        timeOut();
        //开启轮询
        setInterval(3000);
      });
    }
  };

  const onFinish = (value: GT.DTO.LoginDTO) => {
    setLoading(true);
    const fail = () => {
      setCount(count + 1);
      formRef.current?.setFieldsValue({
        ...formRef.current?.getFieldsValue(),
        verifyCode: "",
      });
      formRef.current?.validateFields();
      localStorage.setItem("login_count", (count + 1).toString());
      setLoading(false);
    };
    api.base
      .login(
        { ...value },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      )
      .then((res) => {
        if (
          res.user_info.roles.includes("ROLE_admin") ||
          res.user_info.roles.includes("ROLE_teacher_default") ||
          res.user_info.roles.includes("ROLE_service") ||
          res.user_info.roles.includes("ROLE_system_admin")
        ) {
          dispatch({ type: ActionType.LOGINSUCCESS, payload: res });
          setLoading(false);
          
          props.history.push("/workspace");
          localStorage.setItem("login_count", "");
        } else {
          fail();
          message.error("用户名或密码错误");
        }
      })
      .catch(() => {
        fail();
      });
  };
  const onCodeChange = (rule: any, val: any) => {
    if (count >= 2) {
      if (val?.length === 4) {
        return new Promise<void>((resolve, reject) => {
          api.base.checkVerifyImage({ code: val }).then((res) => {
            if (res) {
              resolve();
            } else {
              reject("验证码错误");
            }
          });
        });
      } else {
        return Promise.reject("请输入验证码");
      }
    } else {
      return Promise.resolve();
    }
  };

  return (
    <Layout style={style.layout}>
      <Content>
        <div style={style.container}>
          <Spin spinning={loading} size="large">
            <p style={style.logo}>
              <img
                src="//gt-fe.oss-cn-beijing.aliyuncs.com/img/3e4e7710ecef11ea83bb39c31e54a3c4.png"
                width={230}
                height={44}
              />
              <span style={style.title}>智慧校园平台</span>
            </p>
            <div>
              <Row style={{ marginTop: 37, marginBottom: 28 }}>
                <Col flex="auto"></Col>
                <Col flex="100px">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <a
                      style={qrCodeModeFlag ? style.choose : style.unChoose}
                      onClick={() => {
                        setQrCodeModeFlag(true);
                        setInvalidFlag(false);
                      }}
                    >
                      扫码登录
                    </a>
                    {qrCodeModeFlag ? (
                      <span
                        style={{
                          width: 30,
                          height: 4,
                          background: "#5781F2",
                          borderRadius: 2,
                          marginTop: 4,
                        }}
                      />
                    ) : null}
                  </div>
                </Col>
                <Col flex="120px" offset={1}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <a
                      style={!qrCodeModeFlag ? style.choose : style.unChoose}
                      onClick={() => setQrCodeModeFlag(false)}
                    >
                      账号密码登录
                    </a>
                    {!qrCodeModeFlag ? (
                      <span
                        style={{
                          width: 30,
                          height: 4,
                          background: "#5781F2",
                          borderRadius: 2,
                          marginTop: 4,
                        }}
                      />
                    ) : null}
                  </div>
                </Col>
                <Col flex="auto"></Col>
              </Row>
            </div>
            <Form
              hidden={qrCodeModeFlag}
              {...layout}
              ref={(ref) => (formRef.current = ref)}
              name="basic"
              initialValues={{ grant_type: "password" }}
              onFinish={onFinish}
            >
              <Form.Item label="" name="grant_type" hidden={true}>
                <Input placeholder="请输入登录账号" />
              </Form.Item>
              <Form.Item
                label=""
                name="username"
                hasFeedback
                rules={[{ required: true, message: "请输入登录账号" }]}
              >
                <Input
                  prefix={
                    <IconFont
                      type="iconlogin-user"
                      style={{ fontSize: 15 }}
                    ></IconFont>
                  }
                  placeholder="请输入登录手机号"
                  style={{ height: 34 }}
                />
              </Form.Item>

              <Form.Item
                label=""
                name="password"
                hasFeedback
                extra={
                  count < 2 ? (
                    <Row justify="end">
                      <Button
                        type="link"
                        href="#/account/password/forget"
                        style={{ marginRight: -15 }}
                      >
                        忘记密码？
                      </Button>
                    </Row>
                  ) : null
                }
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password
                  placeholder="请输入登录密码"
                  prefix={
                    <IconFont
                      type="iconlogin-lock"
                      style={{ fontSize: 15 }}
                    ></IconFont>
                  }
                  style={{ height: 34 }}
                />
              </Form.Item>
              <Form.Item
                label=""
                hidden={count < 2}
                name="verifyCode"
                extra={
                  count < 2 ? null : (
                    <Row justify="end">
                      <Button
                        type="link"
                        href="#/account/password/forget"
                        style={{ marginRight: -15 }}
                      >
                        忘记密码？
                      </Button>
                    </Row>
                  )
                }
                rules={[{ validator: onCodeChange }]}
                hasFeedback
              >
                <Input
                  placeholder="请输入验证码"
                  key={count}
                  prefix={
                    <SafetyCertificateOutlined
                      style={{ color: "#B1B3B2" }}
                    ></SafetyCertificateOutlined>
                  }
                  suffix={<VerifyCode></VerifyCode>}
                  maxLength={4}
                ></Input>
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%", fontSize: 16, height: 34 }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>

            <div hidden={!qrCodeModeFlag}>
              <div
                hidden={!wxFlag}
                id="qrCode"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: 280,
                }}
              ></div>
              <div
                hidden={wxFlag}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img src={qrCodeUrl} width={180} height={180} />
                <div
                  hidden={!invalidFlag}
                  style={{
                    width: 180,
                    height: 180,
                    marginTop: -180,
                    background: "#ffffffe6",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      fontFamily: "PingFang SC",
                      color: "#303133",
                      marginTop: 57,
                    }}
                  >
                    当前二维码已过期
                  </p>
                  <Button
                    type="primary"
                    style={{ fontSize: 14 }}
                    onClick={() => {
                      getQrCode();
                    }}
                  >
                    刷新
                  </Button>
                </div>
                <div
                  hidden={scanFlag}
                  style={{
                    textAlign: "center",
                    fontSize: 14,
                    color: "#616266",
                    fontFamily: "PingFang SC",
                    marginTop: 20,
                  }}
                >
                  请使用微信扫一扫，关注公众号，<br/>
                  登录萧山中学智慧校园平台
                </div>
                <div
                  hidden={!scanFlag}
                  style={{
                    fontSize: 16,
                    fontFamily: "PingFang SC",
                    color: "#303133",
                    fontWeight: "bold",
                    marginTop: 10,
                  }}
                >
                  <IconFont
                    type="icongreen"
                    style={{ fontSize: 18, marginRight: 2, marginTop: 2 }}
                  />
                  扫描成功
                </div>
                <div
                  hidden={!scanFlag}
                  style={{
                    textAlign: "center",
                    fontSize: 14,
                    color: "#616266",
                    fontFamily: "PingFang SC",
                    marginTop: 3,
                  }}
                >
                  请在微信中点击确认即可登录
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </Content>
    </Layout>
  );
}
