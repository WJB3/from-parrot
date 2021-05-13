import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Input,
  Row,
  Button,
  Space,
  Select,
  Tabs,
  Drawer,
  message,
} from "antd";
import { PaginatedParams } from "ahooks/lib/useAntdTable";
import { useAntdTable } from "ahooks";

import GT from "types";
import { ColumnType } from "antd/es/table/interface";
import appStyle from "src/App.style";
import api from "src/api";
import constant from "src/constant";
import OneLineText from "src/components/OneLineText";
import useMoment from "src/hook/useMoment";
import useSocket from "src/hook/useSocket";
import { useHistory } from "react-router-dom";

import TeacherReportApproval from "../../reportInfo/teacherReport/component/TeacherReportApproval";
import AwardAuditDetail from "src/views/app/awardInfo/student/AwardAuditDetail";
import LeaveDetail from 'src/views/app/students/leave/component/LeaveDetail';

export default function TaskList(props: { countChange: () => void }) {
  const [form] = Form.useForm<GT.DTO.SearchTaskDto>();
  const history = useHistory();
  const [rows, setRows] = useState<GT.Model.Task[]>([]);
  const [resultState, setResultState] = useState(0);
  const { datetime_m } = useMoment();
  const { listen } = useSocket();
  const [tableLoading, setTableLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    return listen({
      type: 2,
      handler: () => {
        reset();
      },
    });
  }, []);
  const getTableData = (
    { current, pageSize: size }: PaginatedParams[0],
    formData: any
  ) => {
    setTableLoading(true);
    return api.task.getPage({
      ...formData,
      resultState: resultState,
      current,
      size,
    }).finally(() => {
      setTableLoading(false);
    });
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const { submit, reset } = search;

  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<GT.Model.Task>();
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
    setCurrent(undefined);
  };

  const onShow = (record: GT.Model.Task) => {
    setCurrent(record);
    showDrawer();
    // if (record.relatedType == 1) {
    //   // 学生填报
    //   history.push(`/app/345/356/approvalDetail/${record.relatedId}`)
    // } else {
    //   // 教师填报
    //   //  history.push(`/app/345/356/teacherReport?recordId=${record.relatedId}&roleType=2`)
    // }
  };
  const onCallback = (value: string) => {
    setResultState(Number(value));
    setRows([]);
    submit();
  };

  const awardback = (type: number) => {
    onClose();
    if (type != 2) {
      submit();
      props.countChange();
    }
  };

  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.Task[]) => {
    setRows(selectedRows);
  };
  const showApproval = () => {
      setLoading(true);
      const parmas = rows.map((e) => {return {"content": "同意", "id": e.id, "resultState": 1}})
      api.task.process(parmas).then(() => {
        setRows([]);
        message.success('审批成功');
        submit();
        props.countChange();
      }).finally(() => {
        setLoading(false);
      });
  };

  const columns: ColumnType<GT.Model.Task>[] = [
    {
      title: "待办内容",
      dataIndex: "toDoContent",
      render: (value) => <OneLineText maxWidth={'100%'}>{value}</OneLineText>,
      align: "center",
    },
    {
      title: "申请人",
      dataIndex: "applicantName",
      align: "center",
    },
    {
      title: "待办类型",
      dataIndex: "relatedType",
      render: (value) => {
        return <span>【{constant.relatedType.type.get(value)}】</span>;
      },
      align: "center",
    },
    {
      title: "发起时间",
      dataIndex: "createdTime",
      render: (value) => datetime_m(value),
      align: "center",
    },
    {
      title: "状态",
      dataIndex: "state",
      render: (value) => {
        const colors = ["#FF8948", "#9065F6", "#3CC251", "#FE4F54"];
        return (
          <span style={{ color: colors[value + 1] }}>
            {constant.taskState.type.get(value)}
          </span>
        );
      },
      align: "center",
    },
    {
      title: "操作",
      fixed: "right",
      align: "center",
      width: 250,
      render: (text, record) => (
        <Space>
          <Button type="link" onClick={() => onShow(record)}>
            查看
          </Button>
        </Space>
      ),
    },
  ];
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  const approvalNode = (record: GT.Model.Task) => {
    switch (record.relatedType) {
      case 1:
        return (
          <AwardAuditDetail
          recordId={record.relatedId}
          onOk={(e) => awardback(e)}
          onRef={(ref) => console.log(ref)}
        />
        );
      case 2:
        return (
          <TeacherReportApproval
          recordId={current!.relatedId}
          roleType={"2"}
          onCancel={onClose}
          onOk={() => awardback(1)}
        />
        );
      case 3:
          return (<LeaveDetail recordId={record.relatedId} onRef={(ref) => console.log(ref)}
          onCancel={onClose} onOk={() => awardback(1)}></LeaveDetail>)
    }
    return <div></div>
  };

  return (
    <div>
      <Form form={form} className="search_form">
        <Row>
          <Row className="search_form_items">
            <Form.Item label="待办内容" name="toDoContent">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="申请人" name="applicantName">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="待办类型" name="type">
              <Select placeholder="请选择">
                {[...constant.taskType.type.entries()].map(([value, label]) => (
                  <Select.Option value={value} key={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
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

      <p style={{ marginBottom: 0, marginTop: -10, display: "flex" }}>
          <Tabs
            defaultActiveKey="0"
            onChange={onCallback}
            className="tabs_no_line tabs_line_width"
          >
            {[...constant.resultState.type.entries()].map(([value, label]) => (
              <Tabs.TabPane key={value} tab={label} forceRender></Tabs.TabPane>
            ))}
          </Tabs>
          {resultState == 0 &&           
          <Button type='primary' loading={loading} ghost disabled={rows.length <= 0 } style={{marginTop: 10, marginLeft: 10}} onClick={showApproval}>
            批量审批通过
          </Button>}
      </p>

      <Table
        style={appStyle.table}
        columns={columns}
        rowKey="id"
        {...tableProps}
        loading={tableLoading}
        rowSelection={ resultState == 0 ? {
          type: 'checkbox',
          onChange,
          fixed: true,
          selectedRowKeys: rows.map((item) => item.id),
        } : undefined}
        size="middle"
        scroll={{ scrollToFirstRowOnChange: true, x: 1400 }}
      />

      {current != undefined && (
        <Drawer
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
          width={741}
        >
          {approvalNode(current!)}
        </Drawer>
      )}
    </div>
  );
}
