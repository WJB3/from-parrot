import React, { useRef, useState, useEffect, CSSProperties } from "react";
import GT from "types";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Space,
  Popover,
  Select,
  Table,
  Badge,
} from "antd";
import { useGlobalState, ActionType } from "src/store";
import appStyle from "src/App.style";
import constant from "src/constant";
import PrivateComponent from "src/components/PrivateComponent";
import { RouteComponentProps } from "react-router-dom";
import api from "src/api";
import useDictionary from "src/hook/useDictionary";
import { ColumnsType } from "antd/es/table";
import PreviewPhotoModal from "./component/PreviewPhotoModal";
import useDownload from "src/hook/useDownload";
import useAntdTable, { PaginatedParams } from "ahooks/lib/useAntdTable";
import DownloadPhotoModal from "./component/DownloadPhotoModal";

export default function CollectionRecord(
  props: RouteComponentProps<{ id: any; name: any; enrollYear: any }>
) {
  const [form] = Form.useForm();
  const { renderText, renderSelect } = useDictionary();
  const [exportLoading, setExportLoading] = useState(false);
  const [examLoading, setEaxmLoading] = useState(false);
  const [graduationLoading, setGraduationLoading] = useState(false);

  const [classes, setClasses] = useState<GT.Model.ClassBean[]>();
  const previewModal = useRef<GT.Modal.Ref>();
  const { download } = useDownload();
  const [peopleNumber, setPeopleNumber] = useState<GT.Model.PeopleNumber>();
  const downloadModal = useRef<GT.Modal.Ref>();

  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: "汇总记录" }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);

  const getTableData = (
    { current, pageSize: size }: PaginatedParams[0],
    formData: any
  ) =>
    api.collection.getCollectionRecord({
      ...formData,
      taskId: props.match.params.id,
      current,
      size,
    });
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });

  const { submit, reset } = search;

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  useEffect(() => {
    api.collection.getPeopleNumber(props.match.params.id).then((value) => {
      setPeopleNumber(value);
    });
  }, [tableProps.pagination.current]);

  const getClasses = (open: boolean) => {
    const param = {
      current: -1,
      size: -1,
      enrollmentYear: props.match.params.enrollYear,
      sectionId: 1,
    };
    api.collection.getClasses(param).then((value) => {
      setClasses(value.list);
    });
  };

  const statusText = (status: number) => {
    let color = "";
    let text = "";
    switch (status) {
      case -2:
        text = "未提交";
        color = "#A3A9B9";
        break;
      case -1:
        text = "待审核";
        color = "#FF8948";
        break;
      case 0:
        text = "已通过";
        color = "#3CC251";
        break;
      case 1:
        text = "已拒绝";
        color = "#FE4F54";
        break;
      default:
        break;
    }
    return <div style={{ color: color, textAlign: "center" }}>{text}</div>;
  };

  const columns: ColumnsType<GT.Model.CollectionRecord> = [
    {
      title: "序号",
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
      align: "center",
    },
    {
      title: "班级",
      dataIndex: "className",
      align: "center",
    },
    {
      title: "姓名",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "IC卡号",
      dataIndex: "icCardNo",
      align: "center",
    },
    {
      title: "身份证号",
      dataIndex: "idNo",
      align: "center",
    },
    {
      title: "采集状态",
      dataIndex: "status",
      align: "center",
      render: (val) => {
        return statusText(val);
      },
    },
    {
      title: "提交时间",
      dataIndex: "publishTime",
      align: "center",
      render: (val) => (val ? val : "--"),
    },
    {
      title: "操作",
      align: "center",
      fixed: "right",
      render: (text, record) =>
        record.status == -2 ? (
          <div>--</div>
        ) : (
          <Space>
            <PrivateComponent id={[477, 478, 479]}>
              <PrivateComponent id={477}>
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    // 查看预览  传入数据
                    previewModal.current?.setVisible(true);
                    previewModal.current?.fillRecordIds(record);
                  }}
                >
                  预览
                </Button>
              </PrivateComponent>
              <PrivateComponent id={478}>
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    if (record.studyPhotoUrl) {
                      download({
                        url: record.studyPhotoUrl,
                        fileName: record.idNo + ".png",
                      });
                    }
                  }}
                >
                  下载学考照
                </Button>
              </PrivateComponent>
              <PrivateComponent id={479}>
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    if (record.graduationPhotoUrl) {
                      download({
                        url: record.graduationPhotoUrl,
                        fileName: record.idNo + ".png",
                      });
                    }
                  }}
                >
                  下载毕业证照
                </Button>
              </PrivateComponent>
            </PrivateComponent>
          </Space>
        ),
    },
  ];

  // 导出汇总表
  const exportSearchRecord = () => {
    const searchParams = form.getFieldsValue();
    setExportLoading(true);
    api.collection
      .exportSummary({
        ...searchParams,
        taskId: props.match.params.id,
        current: -1,
        size: -1,
      })
      .then((res) => {
        download(res).finally(() => setExportLoading(false));
      })
      .catch(() => {
        setExportLoading(false);
      });
  };

  const downloadFun = (data: Map<string, any>) => {
    console.log(data);
    if (data.get("type") == 1) {
      setEaxmLoading(true);
    } else {
      setGraduationLoading(true);
    }
    api.collection
      .exportPhoto({
        classIds: data.get("ids"),
        className: data.get("name"),
        taskId: props.match.params.id,
        type: data.get("type"),
      })
      .then((res) => {
        download(res).finally(() => {
          if (data.get("type") == 1) {
            setEaxmLoading(false);
          } else {
            setGraduationLoading(false);
          }
        });
      })
      .catch(() => {
        if (data.get("type") == 1) {
          setEaxmLoading(false);
        } else {
          setGraduationLoading(false);
        }
      });
  };

  const borderClass: CSSProperties = {
    height: 80,
    borderRadius: 6,
    textAlign: "center",
    color: "#fff",
    paddingTop: 15,
  };

  const titleClass: CSSProperties = {
    fontSize: 13,
    fontFamily: "PingFang SC",
  };

  const countClass: CSSProperties = {
    fontSize: 20,
    fontFamily: "Arial-BoldMT",
  };

  return (
    <div>
      <div
        style={{
          color: "#303133",
          fontSize: 16,
          fontWeight: 400,
          fontFamily: "PingFang SC",
        }}
      >
        <b>{props.match.params.name}-汇总记录</b>
      </div>
      <Row style={{ marginTop: 10 }}>
        <Col flex={1}>
          <div style={{ ...borderClass, background: "#9065F6" }}>
            <div style={{ ...titleClass }}>未提交人数</div>
            <div style={{ ...countClass }}>
              {peopleNumber?.uncommittedNum.toString()}
            </div>
          </div>
        </Col>
        <Col flex={1} style={{ marginLeft: "14px" }}>
          <div style={{ ...borderClass, background: "#3DC369" }}>
            <div style={{ ...titleClass }}> 审核通过人数</div>
            <div style={{ ...countClass }}>
              {peopleNumber?.passNum.toString()}
            </div>
          </div>
        </Col>
        <Col flex={1} style={{ marginLeft: "14px" }}>
          <div style={{ ...borderClass, background: "#FF8948" }}>
            <div style={{ ...titleClass }}>待审核人数</div>
            <div style={{ ...countClass }}>
              {peopleNumber?.checkPendingNum.toString()}
            </div>
          </div>
        </Col>
        <Col flex={1} style={{ marginLeft: "14px" }}>
          <div style={{ ...borderClass, background: "#FE4F54" }}>
            <div style={{ ...titleClass }}>审核不通过人数</div>
            <div style={{ ...countClass }}>
              {peopleNumber?.notApprovedNum.toString()}
            </div>
          </div>
        </Col>
        <Col flex={1} style={{ marginLeft: "14px" }}>
          <div style={{ ...borderClass, background: "#5781F2" }}>
            <div style={{ ...titleClass }}>学生总人数</div>
            <div style={{ ...countClass }}>{peopleNumber?.num.toString()}</div>
          </div>
        </Col>
      </Row>

      <Form form={form} style={{ marginTop: 30 }} className="search_form">
        <Row>
          <Row className="search_form_items">
            <Form.Item label="关键词" name="keyWord">
              <Input placeholder="请输入学生姓名/IC卡号/身份证号" />
            </Form.Item>
            <Form.Item label="班级" name="classId">
              <Select
                placeholder="请选择"
                allowClear={true}
                onDropdownVisibleChange={getClasses}
              >
                {classes?.map((classBean) => (
                  <Select.Option value={classBean.id}>
                    {classBean.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="采集状态" name="status">
              {renderSelect("gatherStatus")}
            </Form.Item>
          </Row>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={submit}>
                查询
              </Button>
              <Button onClick={reset}>重置</Button>
            </Space>
          </Form.Item>
        </Row>
      </Form>
      <PrivateComponent id={[474, 475, 476]}>
        <p>
          <Space>
            <PrivateComponent id={474}>
              <Button
                type="primary"
                ghost
                onClick={exportSearchRecord}
                loading={exportLoading}
              >
                导出汇总表
              </Button>
            </PrivateComponent>
            <PrivateComponent id={475}>
              <Popover
                placement="bottom"
                content={
                  <div>
                    <div>
                      <Button
                        type="link"
                        ghost
                        loading={examLoading}
                        onClick={() => {
                          downloadModal.current?.setTitle("下载学考照片");
                          downloadModal.current?.setType(1);
                          downloadModal.current?.setEnrollmentYear(
                            props.match.params.enrollYear
                          );
                          downloadModal.current?.setVisible(true);
                        }}
                      >
                        下载学考照片
                      </Button>
                    </div>
                    <div>
                      <Button
                        type="link"
                        ghost
                        loading={graduationLoading}
                        onClick={() => {
                          downloadModal.current?.setTitle("下载毕业证照片");
                          downloadModal.current?.setType(2);
                          downloadModal.current?.setEnrollmentYear(
                            props.match.params.enrollYear
                          );
                          downloadModal.current?.setVisible(true);
                        }}
                      >
                        下载毕业证照片
                      </Button>
                    </div>
                  </div>
                }
                trigger="click"
              >
                <Button type="primary" ghost>
                  批量下载照片
                </Button>
              </Popover>
            </PrivateComponent>

            <PrivateComponent id={476}>
              <Badge
                style={{ width: "10px", height: "10px" }}
                dot
                count={peopleNumber?.checkPendingNum ?? 0}
              >
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    props.history.push(
                      `/app/311/468/previewAll?taskId=${props.match.params.id}&pageTab=1&name=${props.match.params.name}`
                    );
                  }}
                >
                  预览审核
                </Button>
              </Badge>
            </PrivateComponent>
          </Space>
        </p>
      </PrivateComponent>
      <Table
        style={appStyle.table}
        columns={columns}
        rowKey="id"
        {...tableProps}
        size="small"
        scroll={{ scrollToFirstRowOnChange: true }}
      />
      <PreviewPhotoModal
        onRef={(ref) => (previewModal.current = ref)}
        onOk={() => {
          // 回调
          refresh();
          api.collection
            .getPeopleNumber(props.match.params.id)
            .then((value) => {
              setPeopleNumber(value);
            });
        }}
      />
      <DownloadPhotoModal
        onRef={(ref) => (downloadModal.current = ref)}
        onOk={downloadFun}
      />
    </div>
  );
}
