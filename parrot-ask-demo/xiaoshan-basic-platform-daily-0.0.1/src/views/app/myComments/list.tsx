import React from 'react';
import { Table, Form, Input, Row, Button, Space, Modal, message, Select, DatePicker } from 'antd';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable } from 'ahooks';

import GT from 'types';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import api from 'src/api';
import constant from 'src/constant';
import { RouteComponentProps } from 'react-router-dom';
import OneLineText from 'src/components/OneLineText';

export default function TaskList(props: RouteComponentProps) {
  const [form] = Form.useForm<GT.DTO.SearchTaskParams>();

  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    if (formData.year) {
      formData.year = form.getFieldValue("year").format("yyyy");
    }
    return api.assessment.getMyPage({...formData, current, size });
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });

  const { submit, reset } = search;
  const onShow = (record: GT.Model.MentTask) => {
    props.history.push(`${props.location.pathname}/ResultDetail/${record.id}`);
  };

  const columns: ColumnType<GT.Model.MentTask>[] = [
    {
      title: '序号',
      render: (text, record, index) => index + 1,
      align: 'center',
    },
    {
      title: '考评名称',
      dataIndex: 'name',
      align: 'center',
      render: (text) => <OneLineText>{text}</OneLineText>,
    },
    {
      title: '考评年份',
      dataIndex: 'year',
      align: 'center',
    },
    {
      title: '发布时间',
      dataIndex: 'publishedTime',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
          <Button
            type='link'
            onClick={() => onShow(record)}>
            考评详情
          </Button>
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

            <Form.Item label='考评名称' name='name'>
              <Input placeholder='请输入' />
            </Form.Item>

            <Form.Item label='考评年份' name='year'>
              <DatePicker picker="year" placeholder="请选择" />
              {/* <Select placeholder="请选择" allowClear>
                {constant.taskYear.map((e) => (
                  <Select.Option value={e} key={e}>
                    {e}
                  </Select.Option>
                ))}
              </Select> */}
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
      />
    </div>
  );
}
