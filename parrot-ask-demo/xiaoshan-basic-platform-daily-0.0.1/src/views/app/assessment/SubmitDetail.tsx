import React, { useRef, useState, useEffect } from "react";
import { Row, Button, Col, message, Spin } from "antd";
import GT from "types";
import IconFont from "src/components/IconFont";
import api from "src/api";
import { ActionType, useGlobalState } from "src/store";
import ImportExcelModal from "src/components/importModal";

import { RouteComponentProps } from "react-router-dom";

export default function SubmitDetail(
  props: RouteComponentProps<{ id: string }>
) {
  const [detail, setDetail] = useState<GT.Model.SubmitDetail>();
  const importModal = useRef<GT.Modal.Ref>();
  const [loadingFlag, setLoadingFlag] = useState<boolean>(true);

  useEffect(() => {
    setLoadingFlag(true);
    getDetail();
  }, []);

  function getDetail() {
    
    api.assessment
      .getSubmitDetail(Number(props.match.params.id))
      .then((value) => {
        setLoadingFlag(false);
        setDetail(value);
      }).catch((e) => {
        setLoadingFlag(false);
        props.history.goBack();
      });
  }

  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: "提交详情" }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);

  function check(item: GT.Model.DetailItem) {
    props.history.push(
      `${props.location.pathname}/submitResultDetail/${props.match.params.id}/${item.id}/${item.name}`
    );
  }

  function submit(item: GT.Model.DetailItem) {
    if (detail?.progressState === 1) {
      importModal.current?.setItemId(item.id);
      importModal.current?.setTaskId(detail?.id);
      importModal.current?.setTitle(`提交考核-${item.name}`);
      importModal.current?.setVisible(true);
    } else {
      message.error("任务已结束，操作失败");
    }
  }

  //当前任务状态
  const renderState = (state?: number) => {
    let text, color, background;
    switch (state) {
      case 0:
        text = "待开始";
        color = "#9065F6";
        background = "#9065F633";
        break;
      case 1:
        text = "进行中";
        color = "#FF8948";
        background = "#FF894833";
        break;
      case 2:
        text = "已结束";
        color = "#AEB0B4";
        background = "#AEB0B433";
        break;
    }
    return (
      <span
        style={{
          color,
          background,
          height: 20,
          width: 52,
          fontWeight: "normal",
          fontSize: 12,
          lineHeight: "16px",
          borderRadius: 10,
          textAlign: "center",
          justifyContent: "center",
          paddingTop: 2,
          marginLeft: 10,
        }}
      >
        {text}
      </span>
    );
  };

  function getScoreText(item: GT.Model.DetailItem): string {
    if (item.type === 1) {
      if (!item.limited) {
        return `共${item.totalScore}分，由${item.assessmentOrg}考核`;
      } else {
        return `最多不超过${item.totalScore}分，由${item.assessmentOrg}考核`;
      }
    } else if (item.type === 2) {
      return `±${item.totalScore}分`;
    } else {
      return "";
    }
  }

  function TemplateList() {
    return (
      <Row>
        {detail?.items?.map((item, index) => {
          return (
            <Col flex="180px" style={{ margin: " 30px 20px 0px 0px" }}>
              <div
                style={{
                  width: 180,
                  height: 200,
                  background: "#E4E7F099",
                  borderRadius: "10px",
                }}
              >
                <Row>
                  <Col
                    flex="105px"
                    style={{
                      fontSize: 40,
                      fontFamily: "Avenir LT Std",
                      fontWeight: "bold",
                      color: "#CBD1E5",
                      margin: "0px 0px 0px 15px",
                    }}
                  >
                    0{index + 1}
                  </Col>
                  {item.committed ? (
                    <Col flex="60px" style={{ margin: "-2px -2px -2px 2px" }}>
                      <IconFont
                        type="iconzu435"
                        style={{ fontSize: 60 }}
                      ></IconFont>
                    </Col>
                  ) : (
                    <Col flex="60px" style={{ margin: "-2px -2px -2px 2px" }}>
                      <IconFont
                        type="iconzu434"
                        style={{ fontSize: 60 }}
                      ></IconFont>
                    </Col>
                  )}
                </Row>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 0,
                    fontSize: 16,
                    fontFamily: "PingFang SC",
                    fontWeight: "bold",
                    color: "#303133",
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    fontSize: 13,
                    fontFamily: "PingFang SC",
                    fontWeight: "normal",
                    color: "#84878C",
                    padding: "0px 11px",
                  }}
                >
                  {getScoreText(item)}
                </div>
                {item.committed ? (
                  <div
                    style={{
                      textAlign: "center",
                      position: "absolute",
                      bottom: "20px",
                      width: 180,
                    }}
                  >
                    <Button
                      type="primary"
                      ghost
                      size="middle"
                      onClick={() => {
                        check(item);
                      }}
                    >
                      点击查看
                    </Button>
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      position: "absolute",
                      bottom: "20px",
                      width: 180,
                    }}
                  >
                    <Button
                      type="primary"
                      size="middle"
                      onClick={() => {
                        submit(item);
                      }}
                    >
                      点击提交
                    </Button>
                  </div>
                )}
              </div>
            </Col>
          );
        })}
      </Row>
    );
  }

  return loadingFlag ? (
    <Row justify="center">
      <Spin
        style={{ marginTop: "30vh" }}
        spinning={loadingFlag}
        size="large"
      ></Spin>
    </Row>
  ) : (
    <div style={{ paddingLeft: 5 }}>
      <div
        style={{
          fontSize: 20,
          fontFamily: "PingFang SC",
          fontWeight: "bold",
          color: "#303133",
          alignItems: "center",
          display: "flex",
        }}
      >
        {detail?.name}
        {renderState(detail?.progressState)}
      </div>
      <div
        style={{
          border: "1px solid #E4E7F0",
          borderRadius: "5px",
          padding: 12,
          marginTop: "10px",
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontFamily: "PingFang SC",
            fontWeight: "bold",
            color: "#303133",
          }}
        >
          <IconFont type="iconjuxing340" style={{ fontSize: 16 }} />
          {detail?.templateName}
        </div>
        <div
          style={{
            fontSize: 13,
            fontFamily: "PingFang SC",
            color: "#616266",
            fontWeight: "initial",
            wordWrap: "break-word",
          }}
        >
          {detail?.taskRemark}
        </div>
      </div>
      <TemplateList />
      <ImportExcelModal
        type="assessment"
        onRef={(ref) => (importModal.current = ref)}
        onOk={getDetail}
      />
    </div>
  );
}
