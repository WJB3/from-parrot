import { useDebounceFn, useInterval, useRequest } from "ahooks";
import { Row, Col, Image, Tooltip, Space, Button, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import api from "src/api";
import IconFont from "src/components/IconFont";
import { RouteComponentProps } from "react-router-dom";
import qs from "qs";
export default function BindWechat(props: RouteComponentProps) {
  const [invalidFlag, setInvalidFlag] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [wechatName, setWeChatName] = useState("");
  const [bindFlag, setBindFlag] = useState(false);

  //二维码有效期十分钟，倒计时9分钟
  const { run: timeOut, cancel: timeOutCancel } = useDebounceFn(
    () => {
      setInvalidFlag(true);
      setInterval(undefined);
    },
    { wait: 1000 * 60 * 9 }
  );

  const [interval, setInterval] = useState<number>();
  //轮询请求扫码状态
  useInterval(
    () => {
      api.base
        .getQrCodeState(
          qs.parse(qrCodeUrl.split("?")[1]).ticket?.toString(),
          undefined
        )
        .then((value) => {
          if (value === 1) {
            //1为该微信号未绑定，结束轮询，绑定微信
            setInterval(undefined);
            api.base
              .bindWechat(qs.parse(qrCodeUrl.split("?")[1]).ticket?.toString())
              .then((value) => {
                timeOutCancel();
                setWeChatName(value);
                setBindFlag(true);
              })
              .catch(() => {
                setInterval(3000);
              });
          } else if (value === 2) {
            //2为该微信号已经绑定，取消轮询，刷新二维码
            setInterval(undefined);
            getQrCode();
            message.error("该微信号已经绑定其他账号");
          }
          console.log(value);
        });
    },
    interval,
    { immediate: true }
  );

  useEffect(() => {
    getQrCode();
  }, []);

  //获取二维码
  const getQrCode = () => {
    api.base.getPublicQrCode().then((value) => {
      setInvalidFlag(false);
      setQrCodeUrl(value);
      timeOut();
      //开启轮询
      setInterval(3000);
    });
  };

  return (
    <div
      style={{
        width: 1200,
        margin: "0 auto",
        marginTop: 20,
        background: "#fff",
        borderRadius: 5,
        height: 400,
        padding: 10,
      }}
    >
      <Row>
        <Col flex="auto">
          <b>个人设置-绑定微信</b>
        </Col>
        <Col flex="80px">
          <Button
            onClick={() => {
              props.history.goBack();
            }}
          >
            返回
          </Button>
        </Col>
      </Row>
      <div
        hidden={bindFlag}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <IconFont style={{ fontSize: 180, marginTop: 45 }} type="iconerweima" />
        <img
          hidden={qrCodeUrl.length == 0}
          src={qrCodeUrl}
          width={150}
          height={150}
          style={{ marginTop: -165 }}
        />
        <div
          hidden={!invalidFlag}
          style={{
            width: 150,
            height: 150,
            marginTop: -150,
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
          style={{
            textAlign: "center",
            fontSize: 14,
            color: "#616266",
            fontFamily: "PingFang SC",
            marginTop: 35,
          }}
        >
          请使用微信“扫一扫”，关注公众号以绑定
        </div>
      </div>
      <div
        hidden={!bindFlag}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "PingFang SC",
            fontSize: 16,
            color: "#303133",
            fontWeight: "bold",
            justifyContent: "center",
            marginTop: 120,
          }}
        >
          <IconFont
            type="icongreen"
            style={{ fontSize: 18, marginTop: "auto" }}
          />
          已成功绑定微信账号：{wechatName}
        </div>
        <p
          style={{
            fontFamily: "PingFang SC",
            fontSize: 14,
            fontWeight: 400,
            color: "#616266",
            marginTop: 5,
          }}
        >
          您现在可以使用微信扫码登录和接收消息通知
        </p>
        <Button
          type="primary"
          ghost
          onClick={() => {
            props.history.goBack();
          }}
        >
          返回个人设置
        </Button>
      </div>
      
    </div>
  );
}
