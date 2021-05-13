import { Row, Col, Steps } from "antd";
import { Node, CarbonCopy } from "types/dto/award";
import IconFont from "src/components/IconFont";
import React, { useState } from "react";
import OneLineText from "src/components/OneLineText";

/**
 *
 * @param state 任务当前状态
 * @param sponsorName 发起人姓名
 * @param sponsorTime 任务发起时间
 * @param nodes 审批节点列表
 * @param copies 抄送人列表
 * @param itemMaxWidth 审批人信息最大宽度
 * @param active 当前节点是否活跃, 用于处理多节点审批
 */
export default function ApprovalProcess(props: {
  state?: number;
  sponsorName?: string;
  sponsorTime?: String;
  nodes?: Node[];
  copies?: CarbonCopy[];
  contentWidth?: number;
  itemMaxWidth?: number;
  active?: boolean;
}) {
  const { Step } = Steps;
  var { state, sponsorName, sponsorTime, nodes, copies, contentWidth, itemMaxWidth, active } = {
    ...props,
  };
  nodes = getShowNodes(nodes);

  /**
   *过滤掉审核驳回节点之后掉节点
   * @param _nodes
   */
  function getShowNodes(_nodes?: Node[]): Node[] {
    var nodesToShow: Node[] = [];
    if (_nodes) {
      for (var _i = 0; _i < _nodes?.length; _i++) {
        nodesToShow.push(_nodes[_i]);
        if (_nodes[_i].resultState === 2) {
          return nodesToShow;
        }
      }
    }
    return nodesToShow;
  }

  const stepStyle = {
    width: contentWidth,
    background: "#DFE1E64D",
    borderRadius: 3,
    fontSize: 13,
    color: "#303133",
  };

  function nodeStep(nodes?: Node[]) {
    return nodes?.map((node) => {
      switch (node.signType) {
        //单人审批
        case 0:
          return (
            <Step
              description="&nbsp;"
              icon={
                node.resultState === 1 || node.resultState === 2 ? (
                  <IconFont type="iconbuzhouok"></IconFont>
                ) : (
                  <IconFont type="iconcaiji-wait"></IconFont>
                )
              }
              title={
                <div style={stepStyle}>
                  <Row>
                    <Col
                      flex="50px"
                      style={{ color: "#616266FF", marginLeft: 10 }}
                    >
                      审批人
                    </Col>
                    <Col
                      flex="auto"
                      style={{
                        color: "#303133FF",
                        marginLeft: 10,
                        display: "flex",
                        overflow: "hidden",
                      }}
                    >
                      <OneLineText maxWidth={itemMaxWidth}>
                        {node.approvers?.reduce((names, item, index) => {
                          if (index === 0) {
                            names = item.approverName;
                          } else {
                            names = names + "、" + item.approverName;
                          }
                          return names;
                        }, "")}
                        {node.resultState === 0 ? (
                          <span style={{ color: "#FF8948" }}>(审批中)</span> 
                        ) : null}
                        {node.resultState === 1 ? (
                          <span style={{ color: "#3CC251" }}>(审批通过)</span>
                        ) : null}
                        {node.resultState === 2 ? (
                          <span style={{ color: "#FE4F54" }}>(已驳回)</span>
                        ) : null}
                      </OneLineText>
                    </Col>
                    {/* 审批流程结束展示审批时间 */}
                    {node.resultState > 0 ? (
                      <Col flex="130px" style={{ color: "#909499FF" }}>
                        {node.updatedTime}
                      </Col>
                    ) : null}
                  </Row>
                  {/* 审批通过或驳回时，如果审批内容不为空，展示 */}
                  {(node.resultState === 1 || node.resultState === 2) &&
                  node.approvers?.[0].content ? (
                    <Row
                      style={{
                        overflow: "hidden",
                        flexWrap: "nowrap",
                      }}
                    >
                      <Col
                        flex="50px"
                        style={{ color: "#616266FF", marginLeft: 10 }}
                      ></Col>
                      <Col
                        flex="auto"
                        style={{
                          color: "#303133FF",
                          marginLeft: 10,
                          display: "flex",
                          overflow: "hidden",
                        }}
                      >
                        <OneLineText>
                          {'"' + node.approvers?.[0].content + '"'}
                        </OneLineText>
                      </Col>
                      <Col flex="130px" style={{ color: "#909499FF" }}></Col>
                    </Row>
                  ) : null}
                </div>
              }
            ></Step>
          );
        //或签审批
        case 1:
          return (
            <Step
              description="&nbsp;"
              icon={
                node.resultState === 1 || node.resultState === 2 ? (
                  <IconFont type="iconbuzhouok"></IconFont>
                ) : (
                  <IconFont type="iconcaiji-wait"></IconFont>
                )
              }
              title={
                <div style={stepStyle}>
                  <Row
                    style={{
                      overflow: "hidden",
                      flexWrap: "nowrap",
                    }}
                  >
                    <Col
                      flex="50px"
                      style={{ color: "#616266FF", marginLeft: 10 }}
                    >
                      审批人
                    </Col>
                    <Col
                      flex="auto"
                      style={{
                        color: "#303133FF",
                        marginLeft: 10,
                        display: "flex",
                        overflow: "hidden",
                      }}
                    >
                      {/* 除了审批结束流程，要显示所有审批人 */}
                      {node.resultState !== 1 && node.resultState !== 2 ? (
                        <OneLineText maxWidth={itemMaxWidth}>
                          {node.approvers?.reduce((names, item, index) => {
                            if (index === 0) {
                              names = item.approverName;
                            } else {
                              names = names + "、" + item.approverName;
                            }
                            return names;
                          }, "")}
                          {node.resultState === 0 ? (
                            <span style={{ color: "#FF8948" }}>(或签中)</span>
                          ) : null}
                        </OneLineText>
                      ) : null}

                      {/* 审批结束只显示审批人*/}
                      {node.resultState === 1 || node.resultState === 2 ? (
                        <OneLineText maxWidth={itemMaxWidth}>
                          {/* (或签 找出第一个审批人即可) */}
                          {
                            node.approvers?.find(
                              (ele) =>
                                ele.resultState === 1 || ele.resultState === 2
                            )?.approverName
                          }
                          {node.resultState === 1 ? (
                            <span style={{ color: "#3CC251" }}>(审批通过)</span>
                          ) : null}
                          {node.resultState === 2 ? (
                            <span style={{ color: "#FE4F54" }}>(已驳回)</span>
                          ) : null}
                        </OneLineText>
                      ) : null}
                    </Col>
                    <Col flex="130px" style={{ color: "#909499FF" }}>
                      {node.resultState === 1 || node.resultState === 2
                        ? node.updatedTime
                        : ""}
                    </Col>
                  </Row>
                  {/* 审批通过或驳回时，如果审批内容不为空，展示 */}
                  {(node.resultState === 1 || node.resultState === 2) &&
                  node.approvers?.[0].content ? (
                    <Row
                      style={{
                        overflow: "hidden",
                        flexWrap: "nowrap",
                      }}
                    >
                      <Col
                        flex="50px"
                        style={{ color: "#616266FF", marginLeft: 10 }}
                      ></Col>
                      <Col
                        flex="auto"
                        style={{
                          color: "#303133FF",
                          marginLeft: 10,
                          display: "flex",
                          overflow: "hidden",
                        }}
                      >
                        <OneLineText>
                          {'"' + node.approvers?.[0].content + '"'}
                        </OneLineText>
                      </Col>
                      <Col flex="130px" style={{ color: "#909499FF" }}></Col>
                    </Row>
                  ) : null}
                </div>
              }
            ></Step>
          );
        //会签审批
        case 2:
          return getAllAproverStep(node);
      }
    });
  }

  //获取会签审批节点
  function getAllAproverStep(node: Node) {
    //如果该节点为堵塞节点（即还没轮到该节点审批），把所有审批人的名字展示到一个step中即可（不展示时间）
    if (node.resultState === -1) {
      return (
        <Step
          description="&nbsp;"
          icon={<IconFont type="iconcaiji-wait"></IconFont>}
          title={
            <div style={stepStyle}>
              <Row
                style={{
                  overflow: "hidden",
                  flexWrap: "nowrap",
                }}
              >
                <Col flex="50px" style={{ color: "#616266FF", marginLeft: 10 }}>
                  审批人
                </Col>
                <Col
                  flex="auto"
                  style={{
                    color: "#303133FF",
                    marginLeft: 10,
                    display: "flex",
                    overflow: "hidden",
                  }}
                >
                  {/**展示所有审批人 */}
                  <OneLineText>
                    {node.approvers?.reduce((names, item, index) => {
                      if (index === 0) {
                        names = item.approverName;
                      } else {
                        names = names + "、" + item.approverName;
                      }
                      return names;
                    }, "")}
                  </OneLineText>
                </Col>
                <Col flex="130px" style={{ color: "#909499FF" }}></Col>
              </Row>
            </div>
          }
        ></Step>
      );
    } //如果该节点审批状态为通过，遍历所有审批人，生成对应step
    else if (node.resultState === 1) {
      return node.approvers.map((approver, index) => {
        return (
          <Step
            description="&nbsp;"
            icon={<IconFont type="iconbuzhouok"></IconFont>}
            title={
              <div style={stepStyle}>
                <Row
                  style={{
                    overflow: "hidden",
                    flexWrap: "nowrap",
                  }}
                >
                  <Col
                    flex="50px"
                    style={{ color: "#616266FF", marginLeft: 10 }}
                  >
                    审批人
                  </Col>
                  <Col
                    flex="auto"
                    style={{
                      color: "#303133FF",
                      marginLeft: 10,
                      display: "flex",
                      overflow: "hidden",
                    }}
                  >
                    <OneLineText maxWidth={itemMaxWidth}>
                      {/**显示审批人名称 */}
                      {approver.approverName}
                      <span style={{ color: "#3CC251" }}>(审批通过)</span>
                    </OneLineText>
                  </Col>
                  <Col flex="130px" style={{ color: "#909499FF" }}>
                    {approver.updatedTime}
                  </Col>
                </Row>
                {/* 如果审批内容不为空，展示 */}
                {approver.content ? (
                  <Row
                    style={{
                      overflow: "hidden",
                      flexWrap: "nowrap",
                    }}
                  >
                    <Col
                      flex="50px"
                      style={{ color: "#616266FF", marginLeft: 10 }}
                    ></Col>
                    <Col
                      flex="auto"
                      style={{
                        color: "#303133FF",
                        marginLeft: 10,
                        display: "flex",
                        overflow: "hidden",
                      }}
                    >
                      <OneLineText>{'"' + approver.content + '"'}</OneLineText>
                    </Col>
                    <Col flex="130px" style={{ color: "#909499FF" }}></Col>
                  </Row>
                ) : null}
              </div>
            }
          ></Step>
        );
      });
    } //如果该审批节点为驳回,把通过的节点和驳回的人返回
    else if (node.resultState === 2) {
      return node.approvers.map((approver, index) => {
        if (approver.resultState === 1) {
          return (
            <Step
              description="&nbsp;"
              icon={<IconFont type="iconbuzhouok"></IconFont>}
              title={
                <div style={stepStyle}>
                  <Row
                    style={{
                      overflow: "hidden",
                      flexWrap: "nowrap",
                    }}
                  >
                    <Col
                      flex="50px"
                      style={{ color: "#616266FF", marginLeft: 10 }}
                    >
                      审批人
                    </Col>
                    <Col
                      flex="auto"
                      style={{
                        color: "#303133FF",
                        marginLeft: 10,
                        display: "flex",
                        overflow: "hidden",
                      }}
                    >
                      <OneLineText maxWidth={itemMaxWidth}>
                        {/**显示审批人名称 */}
                        {approver.approverName}
                        <span style={{ color: "#3CC251" }}>(审批通过)</span>
                      </OneLineText>
                    </Col>
                    <Col flex="130px" style={{ color: "#909499FF" }}>
                      {approver.updatedTime}
                    </Col>
                  </Row>
                  {/* 如果审批内容不为空，展示 */}
                  {approver.content ? (
                    <Row
                      style={{
                        overflow: "hidden",
                        flexWrap: "nowrap",
                      }}
                    >
                      <Col
                        flex="50px"
                        style={{ color: "#616266FF", marginLeft: 10 }}
                      ></Col>
                      <Col
                        flex="auto"
                        style={{
                          color: "#303133FF",
                          marginLeft: 10,
                          display: "flex",
                          overflow: "hidden",
                        }}
                      >
                        <OneLineText>
                          {'"' + approver.content + '"'}
                        </OneLineText>
                      </Col>
                      <Col flex="130px" style={{ color: "#909499FF" }}></Col>
                    </Row>
                  ) : null}
                </div>
              }
            ></Step>
          );
        } else if (approver.resultState === 2) {
          return (
            <Step
              description="&nbsp;"
              icon={<IconFont type="iconbuzhouok"></IconFont>}
              title={
                <div style={stepStyle}>
                  <Row
                    style={{
                      overflow: "hidden",
                      flexWrap: "nowrap",
                    }}
                  >
                    <Col
                      flex="50px"
                      style={{ color: "#616266FF", marginLeft: 10 }}
                    >
                      审批人
                    </Col>
                    <Col
                      flex="auto"
                      style={{
                        color: "#303133FF",
                        marginLeft: 10,
                        display: "flex",
                        overflow: "hidden",
                      }}
                    >
                      {/* 审批结束只显示审批人*/}
                      <OneLineText maxWidth={itemMaxWidth}>
                        {/**显示审批人名称 */}
                        {approver.approverName}
                        <span style={{ color: "#FE4F54" }}>(已驳回)</span>
                      </OneLineText>
                    </Col>
                    <Col flex="130px" style={{ color: "#909499FF" }}>
                      {approver.updatedTime}
                    </Col>
                  </Row>
                  {/* 如果审批内容不为空，展示 */}
                  {approver.content !== undefined ? (
                    <Row
                      style={{
                        overflow: "hidden",
                        flexWrap: "nowrap",
                      }}
                    >
                      <Col
                        flex="50px"
                        style={{ color: "#616266FF", marginLeft: 10 }}
                      ></Col>
                      <Col
                        flex="auto"
                        style={{
                          color: "#303133FF",
                          marginLeft: 10,
                          display: "flex",
                          overflow: "hidden",
                        }}
                      >
                        <OneLineText>
                          {'"' + approver.content + '"'}
                        </OneLineText>
                      </Col>
                      <Col flex="130px" style={{ color: "#909499FF" }}></Col>
                    </Row>
                  ) : null}
                </div>
              }
            ></Step>
          );
        }
      });
    } //如果该审批节点为活跃中,把审批通过人的名字单独step返回，再将所有未审批人的名字放入一个step返回
    else if (node.resultState === 0) {
      let steps: any[] = [];
      //遍历数组
      for (var _i = 0; _i < node.approvers.length; _i++) {
        //将审批通过的approver放入数组中
        if (node.approvers[_i].resultState === 1) {
          steps.push(
            <Step
              description="&nbsp;"
              icon={<IconFont type="iconbuzhouok"></IconFont>}
              title={
                <div style={stepStyle}>
                  <Row
                    style={{
                      overflow: "hidden",
                      flexWrap: "nowrap",
                    }}
                  >
                    <Col
                      flex="50px"
                      style={{ color: "#616266FF", marginLeft: 10 }}
                    >
                      审批人
                    </Col>
                    <Col
                      flex="auto"
                      style={{
                        color: "#303133FF",
                        marginLeft: 10,
                        display: "flex",
                        overflow: "hidden",
                      }}
                    >
                      <OneLineText maxWidth={itemMaxWidth}>
                        {/**显示审批人名称 */}
                        {node.approvers[_i].approverName}
                        <span style={{ color: "#3CC251" }}>(审批通过)</span>
                      </OneLineText>
                    </Col>
                    <Col flex="130px" style={{ color: "#909499FF" }}>
                      {node.approvers[_i].updatedTime}
                    </Col>
                  </Row>
                  {/* 如果审批内容不为空，展示 */}
                  {node.approvers[_i].content !== undefined ? (
                    <Row
                      style={{
                        overflow: "hidden",
                        flexWrap: "nowrap",
                      }}
                    >
                      <Col
                        flex="50px"
                        style={{ color: "#616266FF", marginLeft: 10 }}
                      ></Col>
                      <Col
                        flex="auto"
                        style={{
                          color: "#303133FF",
                          marginLeft: 10,
                          display: "flex",
                          overflow: "hidden",
                        }}
                      >
                        <OneLineText>
                          {'"' + node.approvers[_i].content + '"'}
                        </OneLineText>
                      </Col>
                      <Col flex="130px" style={{ color: "#909499FF" }}></Col>
                    </Row>
                  ) : null}
                </div>
              }
            ></Step>
          );
        } else if (node.approvers[_i].resultState === 0) {
          steps.push(
            <Step
              description="&nbsp;"
              icon={<IconFont type="iconcaiji-wait"></IconFont>}
              title={
                <div style={stepStyle}>
                  <Row
                    style={{
                      overflow: "hidden",
                      flexWrap: "nowrap",
                    }}
                  >
                    <Col
                      flex="50px"
                      style={{ color: "#616266FF", marginLeft: 10 }}
                    >
                      审批人
                    </Col>
                    <Col
                      flex="auto"
                      style={{
                        color: "#303133FF",
                        marginLeft: 10,
                        display: "flex",
                        overflow: "hidden",
                      }}
                    >
                      <OneLineText maxWidth={itemMaxWidth}>
                        {/**显示所有未审批人名称 */}
                        {node.approvers?.reduce((names, item, index) => {
                          if (item.resultState === 0) {
                            if (names === "") {
                              names = item.approverName;
                            } else {
                              names = names + "、" + item.approverName;
                            }
                          }
                          return names;
                        }, "")}
                        <span style={{ color: "#FF8948" }}>(会签中)</span>
                      </OneLineText>
                    </Col>
                    <Col flex="130px" style={{ color: "#909499FF" }}></Col>
                  </Row>
                </div>
              }
            ></Step>
          );
          return steps;
        }
      }
    }
  }

  return (
    <Steps direction="vertical" style={{ marginTop: 20 }} current={Infinity}>
      <Step
        description="&nbsp;"
        icon={<IconFont type="iconbuzhouok"></IconFont>}
        title={
          <div style={stepStyle}>
            <Row>
              <Col flex="50px" style={{ color: "#616266FF", marginLeft: 10 }}>
                发起人
              </Col>
              <Col
                flex="auto"
                style={{
                  color: "#303133FF",
                  marginLeft: 10,
                  display: "flex",
                  overflow: "hidden",
                }}
              >
                <OneLineText maxWidth={itemMaxWidth}>
                  {sponsorName}
                </OneLineText>
              </Col>
              <Col flex="130px" style={{ color: "#909499FF" }}>
                {sponsorTime}
              </Col>
            </Row>
          </div>
        }
      ></Step>
      {nodeStep(nodes)}
      {state !== 2 && copies ? (
        <Step
          description="&nbsp;"
          icon={
            state === 1 ? (
              <IconFont type="iconbuzhouok"></IconFont>
            ) : (
              <IconFont type="iconcaiji-wait"></IconFont>
            )
          }
          title={
            <div style={stepStyle}>
              <Row
                style={{
                  overflow: "hidden",
                  flexWrap: "nowrap",
                }}
              >
                <Col flex="50px" style={{ color: "#616266FF", marginLeft: 10 }}>
                  抄送人
                </Col>
                <Col
                  flex="auto"
                  style={{
                    color: "#303133FF",
                    marginLeft: 10,
                    display: "flex",
                    overflow: "hidden",
                  }}
                >
                  <OneLineText maxWidth={itemMaxWidth}>
                    {copies?.reduce((names, item, index) => {
                      if (index === 0) {
                        names = item.targetName;
                      } else {
                        names = names + "、" + item.targetName;
                      }
                      return names;
                    }, "")}
                  </OneLineText>
                </Col>
                <Col flex="130px" style={{ color: "#909499FF" }}>
                  {state === 1 ? nodes?.[nodes?.length - 1].updatedTime : ""}
                </Col>
              </Row>
            </div>
          }
        ></Step>
      ) : null}
    </Steps>
  );
}
