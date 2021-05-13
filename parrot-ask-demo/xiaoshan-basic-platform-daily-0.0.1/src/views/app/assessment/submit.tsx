import React from 'react';
import { Table, Form, Input, Row, Button, Space, DatePicker } from 'antd';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable } from 'ahooks';

import GT from 'types';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import api from 'src/api';
import constant from 'src/constant';
import { RouteComponentProps } from 'react-router-dom';
import PrivateComponent from 'src/components/PrivateComponent';
import OneLineText from 'src/components/OneLineText';

export default function SubmitList(props: RouteComponentProps) {
  const [form] = Form.useForm<GT.DTO.SearchTaskParams>();

  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    if (formData.year) {
      formData.year = form.getFieldValue("year").format("yyyy");
    }
    return api.assessment.getPage({...formData, current, size });
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });

  const { submit, reset } = search;
  const onShow = (record: GT.Model.MentTask) => {
    console.log(record)
    props.history.push(`${props.location.pathname}/detail/${record.id}`);
  };

  const columns: ColumnType<GT.Model.MentTask>[] = [
    {
      title: '序号',
      render: (text, record, index) => index + 1,
      align: 'center',
      width: 100,
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      align: 'center',
      render: (text) => <OneLineText>{text}</OneLineText>,
      width: 300,
    },
    {
      title: '考评年份',
      dataIndex: 'year',
      align: 'center',
      width: 100,
    },
    {
      title: '提交时间',
      dataIndex: 'startTime',
      align: 'center',
      render: (value, model) => model.startTime + " ~ " + model.endTime,
      width: 300,
    },
    {
      title: '任务状态',
      dataIndex: 'progressState',
      render: (text, model) => {
        const colors = ['#FF8948', '#9065F6', '#909499'];
        return <span style={{ color: colors[model.progressState] }}>{constant.progressState.type.get(text)}</span>;
      } ,
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 200,
      render: (text, record) => (
        <Space>
          { record.progressState == 0 ? "--" : 
                      <Button
                      type='link'
                      onClick={() => onShow(record)}>
                      提交详情
                    </Button>}
        </Space>
      ),
    },
  ];
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  return (
    <div>
      <Form form={form} className='search_form'>
        <Row>
          <Row className='search_form_items'>

            <Form.Item label='任务名称' name='name'>
              <Input placeholder='请输入' />
            </Form.Item>

            <Form.Item label='考评年份' name='year'>
              <DatePicker picker="year" placeholder="请选择" />
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
      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        size='middle'
        // scroll={{ scrollToFirstRowOnChange: true, x: 1400 }}
      />
    </div>
  );
}
