import React, {useEffect} from 'react'
import constant from 'src/constant';
import GT from 'types';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import useAntdTable, { PaginatedParams } from "ahooks/lib/useAntdTable";
import api from "src/api";
import { Table, Modal, Space, Button} from 'antd';
import useDictionary from 'src/hook/useDictionary';
import { useHistory } from 'react-router-dom';
import OneLineText from 'src/components/OneLineText';
import qs from 'qs'

// 填报数据列表
export default function ReportStudentList(props: {taskId?: number, recordId?: number, needRefresh: boolean}) {
  const { renderText, renderSelect } = useDictionary();
  const history = useHistory();

  // useeffect
  useEffect(() => {
    // console.log(props.needRefresh);
    if (props.needRefresh) {
      refresh();
    }
  },[props.needRefresh]);


  const onEdit = (render: GT.Model.ReporAwardDetailModel) => {
    // 编辑数据 页面跳转 path获取数据
    console.log(history);
    history.push(`/app/345/editDetail/${render.id}?taskName=${qs.parse(history.location.search.substr(1)).taskName}`)
  }

  const renderApprovalState = (state: number) => {
    let color = '';
    switch (state) {
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
        {renderText('taskApprovalStatus', state)}
      </div>
    );
  };

  const getTableData = (
    { current, pageSize: size }: PaginatedParams[0]) =>
    api.award.getMyAwardReportList({
      current,
      size,
      taskId:props.taskId,
    });

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    
  });

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  // 列表数据
  const columns: ColumnType<GT.Model.ReporAwardDetailModel>[] = [
    {
      title: '序号',
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
    },
    {
      title: '获奖学生',
      dataIndex: 'studentNames',
      align: 'center',
      width: 240,
      render: (val) => <OneLineText maxWidth={240}>{val}</OneLineText>,
    },
    {
      title: '竞赛名称',
      dataIndex: 'contestName',
      align: 'center',
      render: (val) => <OneLineText maxWidth={160}>{val}</OneLineText>,
    },
    {
      title: '竞赛类型',
      dataIndex: 'contestType',
      render: (value) => renderText('contestType', value),
      align: 'center',
    },
    {
      title: '竞赛级别',
      dataIndex: 'contestLevel',
      render: (value) => renderText('stuContestLevel', value),
      align: 'center',
    },
    {
      title: '获奖等级',
      dataIndex: 'awardLevelName',
      align: 'center',
    },
    {
      title: '获奖类型',
      dataIndex: 'type',
      render: (value) => renderText('awardType', value),
      align: 'center',
    },
    {
      title: '审批状态',
      dataIndex: 'state',
      render: (value) => renderApprovalState(value),
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) =>
        <Space>
          <Button type='link' onClick={() => onEdit(record)}>
            查看
          </Button>
        </Space>
    },
  ];
  return (
    <div>
      <Table style={appStyle.table}
      columns={columns}
      rowKey='id'
      {...tableProps}
      size='small'/>
    </div>
  )
}
