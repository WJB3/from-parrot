import React, {useState} from "react";
import { Table, Form, Input, Row, Button, Space, Select } from "antd";
import PrivateComponent from "src/components/PrivateComponent";
import useAntdTable, { PaginatedParams } from "ahooks/lib/useAntdTable";
import { ColumnsType } from "antd/es/table";
import appStyle from "src/App.style";
import constant from "src/constant";
import api from "src/api";
import GT, { Model } from "types";
import { useGlobalState } from "src/store";
import { RouteComponentProps } from "react-router-dom";
import useDictionary from 'src/hook/useDictionary';
import { render } from "bizcharts/lib/g-components";
import OneLineText from 'src/components/OneLineText';

// 填报列表页面
export default function ReportAwardListPage(props: RouteComponentProps) {
  const [form] = Form.useForm();
  const [state] = useGlobalState();
  const { renderText, renderSelect } = useDictionary();

  const getTableData = (
    { current, pageSize: size }: PaginatedParams[0],
    formData: any
  ) =>
    api.award.getAwardReportPage({
      ...formData,
      current,
      size,
    });

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const { submit, reset } = search;

  const onSubmit = (record: GT.Model.ReportListModel) => {
    // 提交还是编辑 区分老师还是学生
    if (record.type == 1) {
      // 区分是跳转填报还是记录
      let jumpState = 0;
      if (!record.taskState) {
        jumpState = 1;
      } else if (record.state === 1 || record.state === 2) {
        jumpState = 1;
      }
      props.history.push(
        `${props.location.pathname}/reportDetail/${record.taskId}?taskName=${record.title}&pageTab=${jumpState}`
      );
    } else if (record.type == 2) {
      props.history.push(
        `${props.location.pathname}/teacherReport?taskId=${record.taskId}&roleType=1&taskName=${record.title}`
      );
    }
  };

  const renderOperation = (render: GT.Model.ReportListModel) => {
    // 根据数据来判断按钮 未开始任务 按钮无法点击
    const operation = (render.status === 0);
    // 任务已结束 并且 未提交过记录
    const Show = (render.status === 2 && render.state === -2);
    let text = '立即填报';
    if (Show) {
      text = '--';
    } else if (!render.taskState) {
      // 存在多条记录状态
      text = '填报记录';
    } else if (render.state === 1 || render.state === 2) {
      // 已驳回/已通过 填报记录
      text = '填报记录'
    }
    return  (
        <PrivateComponent id={405}> 
        <Button
        size="small"
        type="link"
        disabled={operation || Show}
        onClick={() => onSubmit(render)}
        >
        {text}
      </Button>
      </PrivateComponent> 
    )  
  }

  const renderApprovalState = (record: GT.Model.ReportListModel) => {
    let color = '';
    switch (record.state) {
      case -2:
        color = '#FE4F54';
        break;
      case -1:
        color = '#FF8948';
        break;
      case 0:
        color = '#9065F6';
        break;
      case 1:
        color = '#3CC251';
        break;
      case 2:
        color = '#FE4F54';
        break;
      default:
        break;
    }
    return (
      <div style={{ color: color, 
         textAlign: "center"}}> 
        {record.taskState ? renderText('submitStatus', record.state) : '--'}
      </div>
    );
  };

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  const columns: ColumnsType<GT.Model.ReportListModel> = [
    {
      title: "序号",
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
      align: "center",
    },
    {
      title: "填报任务名称",
      dataIndex: "name",
      render: (val) => <OneLineText maxWidth={280}>{val}</OneLineText>,
      align: "center",
    },
    {
      title: "填报时间",
      dataIndex: "durationTime",
      render: (val, record) => (
        <div>{record.startTime + "~" + record.endTime}</div>
      ),
      align: "center",
    },
    {
      title: "任务状态",
      dataIndex: "status",
      render: (state: 0 | 1 | 2) => {
        const colors = {
          0: "#FF8948",
          1: "#9065F6",
          2: "#909499",
        };
        return (
          <span style={{ color: colors[state] }}>
            {constant.award.state.get(state)}
          </span>
        );
      },
      align: "center",
    },
    {
      title: "审批状态",
      dataIndex: "state",
      render: (value, record) => renderApprovalState(record),
      align: "center",
    },
    {
      title: "操作",
      align: "center",
      fixed: "right",
      render: (text, record) => (
        <Space>
          {renderOperation(record)}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form form={form} className="search_form" style={{marginTop: '10px', marginBottom: '10px'}}>
        <Row>
          <Row className="search_form_items">
            <Form.Item label="任务名称" name="name">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="审批状态" name="state">
              {renderSelect('submitStatus')}
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
      <Table
        style={appStyle.table}
        columns={columns}
        rowKey="id"
        {...tableProps}
        size="middle"
      />
    </div>
  );
}
