import React, { useRef, useState } from 'react';
import { Table, Form, Input, Row, Button, Space, Select, Modal, message, DatePicker } from 'antd';
import PrivateComponent from 'src/components/PrivateComponent';
import useDictionary from 'src/hook/useDictionary';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { ColumnsType } from 'antd/es/table';
import appStyle from 'src/App.style';
import constant from 'src/constant';
import api from 'src/api';
import GT, { Model } from 'types';
import ReceivePersonModal from '../student/component/ReceivePerson';
import { RouteComponentProps } from 'react-router-dom';
import moment from 'moment';
import OneLineText from 'src/components/OneLineText';

export default function TeacherAwardListPage(props: RouteComponentProps) {
  const [form] = Form.useForm();
  const modal = useRef<GT.Modal.Ref>();
  const [taskId, setTaskId] = useState<number>();

  // 任务类型 学生竞赛
  const taskType = { type: 2 };
  // const { renderText } = useDictionary();

  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    let times = form.getFieldValue('year');
    if (times !== undefined && times !== null) {
      const year = times.format('YYYY').toString();
      formData.year = year;
    }
    return api.award.getPage({
      ...formData,
      ...taskType,
      current,
      size,
    });
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const { submit, reset } = search;

tableProps.pagination = {
  ...tableProps.pagination,
  ...constant.pagination,
};

// 修改接收人 表中表
const onReceive = (record: GT.Model.AwardTaskModel) => {
  modal.current?.setTitle('接收对象详情');
  modal.current?.setVisible(true);
  const taskIsOver = (record.status !== 2)
  modal.current?.setCanDelete(taskIsOver);
  setTaskId(record.id)
};

  const onDelete = (record: GT.Model.AwardTaskModel) => {
    Modal.confirm({
      title: '删除后将清空该任务所有已提交的填报记录，确认删除该任务吗？',
      onOk() {
        api.award.delete(record.id).then(() => {
          message.success('删除成功');
          search.reset();
        });
      },
    });
  };

  // 跳转任务编辑
  const editTaskDetail = (record: GT.Model.AwardTaskModel) => {
    console.log('编辑');
    props.history.push(`${props.location.pathname}/publishnewtask?type=2&id=${record.id}&isEdit=${true}`);
  };

  const columns: ColumnsType<GT.Model.AwardTaskModel> = [
    {
      title: '序号',
      render: (text, record, index) => index + 1,
      fixed: true,
      width: 55,
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      align: 'center',
      render: (val) => <OneLineText maxWidth={160}>{val}</OneLineText>,
    },
    {
      title: '填报年份',
      dataIndex: 'year',
      align: 'center',
    },
    {
      title: '接收对象',
      dataIndex: 'num',
      align: 'center',
      render: (val, record) => (
        <PrivateComponent id={392}>
          <Button size='small' type='link' onClick={() => onReceive(record)}>
            {record.num + '人'}
          </Button>
        </PrivateComponent>
      ),
    },
    {
      title: '填报时间',
      dataIndex: 'durationTime',
      render: (val, record) => <div>{record.startTime + '~' + record.endTime}</div>,
      align: 'center',
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      render: (state: 0 | 1 | 2) => {
        const colors = {
          0: '#FF8948',
          1: '#9065F6',
          2: '#909499',
        };
        return <span style={{ color: colors[state] }}>{constant.award.state.get(state)}</span>;
      },
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <Space>
          <PrivateComponent id={391}>
            <Button
              size='small'
              type='link'
              onClick={() =>
                props.history.push(`${props.location.pathname}/teacherrecord/${record.id}/${record.year}年度${record.name}-汇总记录`)
              }>
              汇总
            </Button>
          </PrivateComponent>
          <PrivateComponent id={392}>
            <Button size='small' type='link' onClick={() => editTaskDetail(record)}>
              编辑
            </Button>
          </PrivateComponent>
          <PrivateComponent id={393}>
            <Button
              size='small'
              type='link'
              danger
              disabled={record.status === 3}
              onClick={() => onDelete(record)}>
              删除
            </Button>
          </PrivateComponent>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form form={form} className='search_form'>
        <Row>
          <Row className='search_form_items'>
            <Form.Item label='填报年份' name='year'>
              <DatePicker picker='year' format='yyyy' />
            </Form.Item>
            <Form.Item label='任务名称' name='name'>
              <Input placeholder='请输入' />
            </Form.Item>
            <Form.Item label='当前状态' name='status' style={{ width: 270 }}>
              <Select placeholder='请选择'>
                {[...constant.award.state.entries()].map(([value, label]) => (
                  <Select.Option value={value} key={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Row>
          <Form.Item>
            <Space>
              <Button type='primary' onClick={submit}>
                查询
              </Button>
              <Button onClick={reset}>重置</Button>
            </Space>
          </Form.Item>
        </Row>
      </Form>
      <PrivateComponent id={[390, 394]}>
        <p>
          <Space>
            <PrivateComponent id={390}>
              <Button
                type='primary'
                ghost
                onClick={() => {
                  props.history.push(`${props.location.pathname}/publishnewtask?type=2`);
                }}>
                发布新任务
              </Button>
            </PrivateComponent>
            <PrivateComponent id={394}>
              <Button
                type='primary'
                ghost
                onClick={() => props.history.push(`${props.location.pathname}/workflow/2`)}>
                审批设置
              </Button>
            </PrivateComponent>
          </Space>
        </p>
      </PrivateComponent>
      <Table style={appStyle.table} columns={columns} rowKey='id' {...tableProps} size='small' />
      <ReceivePersonModal
        taskId={taskId}
        onRef={(ref) => (modal.current = ref)}
        onOk={() => {
          refresh();
        }}
      />
    </div>
  );
}
