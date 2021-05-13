import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  Input,
  Row,
  Button,
  Space,
  Select,
  Modal,
  message,
  Col,
  Divider,
} from "antd";
import PrivateComponent from "src/components/PrivateComponent";
import useDictionary from "src/hook/useDictionary";
import useAntdTable, { PaginatedParams } from "ahooks/lib/useAntdTable";
import { ColumnsType } from "antd/es/table";
import appStyle from "src/App.style";
import constant from "src/constant";
import api from "src/api";
import GT from "types";
import useDownload from "src/hook/useDownload";
import { RouteComponentProps, useRouteMatch } from "react-router-dom";
import OneLineText from "src/components/OneLineText";
import { ActionType, useGlobalState } from "src/store";

// 汇总记录列表页面
export default function RecordListPage(
  props: RouteComponentProps<{ id: any; name: any }>
) {
  const [form] = Form.useForm();
  const { renderText, renderSelect } = useDictionary();
  const [exportLoading, setExportLoading] = useState(false);
  const { download } = useDownload();

  const getTableData = (
    { current, pageSize: size }: PaginatedParams[0],
    formData: any
  ) =>
    api.award.getSummary({
      ...formData,
      taskId: props.match.params.id,
      current,
      size,
    });

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

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });

  const { submit, reset } = search;

  // 导出汇总表
  const exportSearchRecord = () => {
    const searchParams = form.getFieldsValue();
    setExportLoading(true);
    api.award
      .exportSummary({
        ...searchParams,
        taskId: props.match.params.id,
      })
      .then((res) => {
        download(res).finally(() => setExportLoading(false));
      })
      .catch(() => {
        setExportLoading(false);
      });
  };

  // 导出年鉴记录
  const exportYearBook = () => {
    api.award.exportYearBook(props.match.params.id).then(download);
  };

  // 删除记录
  const onDelete = (record: GT.Model.TearchSummary) => {
    Modal.confirm({
      title:
        "删除后当前填报记录会被清除，填报对象可以重新发起提交，确认删除吗？",
      onOk: () => {
        api.award.deleteSummary(record.id).then(() => {
          message.success("删除成功");
          submit();
        });
      },
    });
  };

  const renderApprovalState = (state: number) => {
    let color = "";
    switch (state) {
      case -2:
        color = "#FE4F54";
        break;
      case -1:
        color = "#FF8948";
        break;
      case 0:
        color = "#9065F6";
        break;
      case 1:
        color = "#3CC251";
        break;
      case 2:
        color = "#FE4F54";
        break;
      default:
        break;
    }
    return (
      <div style={{ color: color, textAlign: "center" }}>
        {renderText("taskApprovalStatus", state)}
      </div>
    );
  };

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  const columns: ColumnsType<GT.Model.TearchSummary> = [
    // {
    //   title: '序号',
    //   render: (text, record, index) => index + 1,
    //   fixed: true,
    //   width: 55,
    // },
    {
      title: "教师姓名",
      dataIndex: "teacherName",
      align: "center",
    },
    {
      title: "IC卡号",
      dataIndex: "icCardNo",
      align: "center",
    },
    {
      title: "教研组",
      dataIndex: "groupId",
      align: "center",
      render: (val) => renderText("researchGroup", val),
    },
    {
      title: "提交状态",
      dataIndex: "status",
      align: "center",
      render: (val) => (val == 2 ? "已提交" : "未提交"),
    },
    {
      title: "考核提交数量",
      dataIndex: "submitNum",
      align: "center",
    },
    {
      title: "加分荣誉数量",
      dataIndex: "itemNum",
      align: "center",
    },
    {
      title: "审批状态",
      dataIndex: "state",
      render: (value) =>
        value == undefined ? (
          <div style={{ color: "#FF8948", textAlign: "center" }}>{"— —"}</div>
        ) : (
          renderApprovalState(value)
        ),
      align: "center",
    },
    {
      title: "操作",
      align: "center",
      fixed: "right",
      render: (text, record) =>
        record.status == 2 && (
          <Space>
            <PrivateComponent id={[399, 400]}>
              <PrivateComponent id={399}>
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    props.history.push(
                      `/app/311/313/teacherReport?recordId=${record.id}&roleType=3`
                    );
                  }}
                >
                  查看
                </Button>
              </PrivateComponent>
              <PrivateComponent id={400}>
                <Button
                  size="small"
                  type="link"
                  danger
                  onClick={() => onDelete(record)}
                >
                  删除
                </Button>
              </PrivateComponent>
            </PrivateComponent>
          </Space>
        ),
    },
  ];

  return (
    <div>
      <div
        style={{
          color: "#303133",
          fontSize: 16,
          fontWeight: 400,
          fontFamily: "PingFang SC",
          opacity: 1,
        }}
      >
        <b>{props.match.params.name}</b>
      </div>
      <div
        style={{
          marginTop: 10,
          marginBottom: 20,
          background: "#DFE1E6",
          height: "1px",
        }}
      ></div>
      <Form form={form} className="search_form">
        <Row>
          <Row className="search_form_items">
            <Form.Item label="教师姓名" name="name">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="IC卡号" name="icCardNo">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="教研组" name="groupId">
              {renderSelect("researchGroup")}
            </Form.Item>
            <Form.Item label="提交状态" name="status">
              <Select placeholder={"请选择"} allowClear={true}>
                {[
                  [1, "未提交"],
                  [2, "已提交"],
                ].map(([val, label]) => {
                  return (
                    <Select.Option value={val} key={val}>
                      {label}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item label="审批状态" name="state">
              {renderSelect("taskApprovalStatus")}
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
      <PrivateComponent id={[397, 398]}>
        <p>
          <Space>
            <PrivateComponent id={397}>
              <Button
                type="primary"
                ghost
                onClick={exportSearchRecord}
                loading={exportLoading}
              >
                导出汇总表
              </Button>
            </PrivateComponent>
            <PrivateComponent id={398}>
              <Button type="primary" ghost onClick={exportYearBook}>
                导出年鉴记录
              </Button>
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
    </div>
  );
}
