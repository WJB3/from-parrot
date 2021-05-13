import React from 'react';
import { Table, } from 'antd';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable } from 'ahooks';

import GT from 'types';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import api from 'src/api';
import constant from 'src/constant';
import useDictionary from 'src/hook/useDictionary';
import moment from 'moment';

export default function LeaveDetailList(props: {recordId: number}) {
  const { renderText } = useDictionary();

  const getTableData = ({ current, pageSize: size }: PaginatedParams[0]) => api.leave.getDetailPage(props.recordId, {current, size});

  const { tableProps, search, refresh } = useAntdTable(getTableData, {});
  const { submit, reset } = search;

  const columns: ColumnType<GT.Model.Leave>[] = [
    {
      title: '学生姓名',
      dataIndex: 'studentName',
      align: 'center',
    },
    {
      title: '班级',
      dataIndex: 'className',
      align: 'center',
    },
    {
      title: '住校情况',
      dataIndex: 'studentType',
      render: (value) => renderText('studentLivingCondition', value),
      align: 'center',
    },
    {
      title: '请假类型',
      dataIndex: 'leaveType',
      render: (text) => renderText('leaveType', text),
      align: 'center',
    },
    {
      title: '请假时间',
      dataIndex: 'startTime',
      render: (text, model) => model.leaveType == 2 ? <p style={{whiteSpace: 'pre-line', textAlign: 'center', marginBottom: 0}}>{moment(model.startTime).format("YYYY-MM-DD") + " 至\n" + moment(model.endTime).format("YYYY-MM-DD")}</p> : <p style={{whiteSpace: 'pre-line', textAlign: 'center', marginBottom: 0}}>{model.isCycle ? moment(model.startTime).format("YYYY-MM-DD") + " 至\n" + moment(model.endTime).format("YYYY-MM-DD") : moment(model.startTime).format("YYYY-MM-DD HH:mm") + " 至\n" + moment(model.endTime).format("YYYY-MM-DD HH:mm")}</p>,
      align: 'center',
    },
    {
      title: '周期请假',
      dataIndex: 'isCycle',
      render: (text) => text == false ? '否' : '是',
      align: 'center',
    },
    {
      title: '重复日期',
      dataIndex: 'repeatDate',
      render: (text, model) => text != undefined ? (model.leaveType == 2 ? text : (<p style={{marginBottom: 2, whiteSpace: 'pre-line',}}>{text + "\n"  + model.repeatStart + "--" + model.repeatEnd}</p>)) : '',
      align: 'center',
    },
    {
      title: '回校住宿类型',
      dataIndex: 'goBed',
      render: (text) => renderText('goBed', text),
      align: 'center',
    },
    {
      title: '审批编号',
      dataIndex: 'serialNumber',
      align: 'center',
    },
    {
      title: '审批人',
      dataIndex: 'approvalName',
      align: 'center',
    },
    {
      title: '销假日期',
      dataIndex: 'clearDate',
      align: 'center',
    },
    {
      title: '返校时间',
      dataIndex: 'cancelDate',
      align: 'center',
    },
    {
      title: '销假经办人',
      dataIndex: 'cancelPerson',
      align: 'center',
    },
  ];
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  return (
    <div>
      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='timeId'
        {...tableProps}
        size='middle'
        scroll={{ scrollToFirstRowOnChange: true, x: 1400 }}
      />
    </div>
  );
}
