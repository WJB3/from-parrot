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
import PrivateComponent from 'src/components/PrivateComponent';
import OneLineText from 'src/components/OneLineText';

export default function TaskList(props: RouteComponentProps) {
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
    props.history.push(`${props.location.pathname}/accessResult/${record.id}/${record.year}年度${record.name}-考评结果`);
  };
  const onEdit = (record: GT.Model.MentTask) => {
    props.history.push(`${props.location.pathname}/detail/${record.id}`);
  };

  const onDelete = (record: GT.Model.MentTask) => {
    Modal.confirm({
      title: '提示',
      content: "删除后将清空该任务所有已提交的考核记录，确认删除该任务吗？",
      onOk: () => {
        api.assessment.delete(record.id).then(() => {
          message.success('删除成功');
          submit();
        });
      },
    }); 
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
      title: '结果发布',
      dataIndex: 'published',
      render: (text, model) => {
        if (text == undefined) {
          return "--"
        }
        return model.published ? <span style={{ color: "#3CC251"}}>已发布</span> : <span style={{color: "#FF8948"}}>未发布</span>;
      } ,
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 180,
      render: (text, record) => (
        <Space size={10}>
          <PrivateComponent id={411}>
            <Button
              type='link'
              disabled={record.progressState === 0}
              onClick={() => onShow(record)}
              style={{padding: 0}}>
              考评结果
            </Button>
          </PrivateComponent>
          <PrivateComponent id={412}>
            <Button type='link' onClick={() => onEdit(record)}
            style={{padding: 0}}>
              编辑
            </Button>
          </PrivateComponent>
          <PrivateComponent id={413}>
            <Button type='link' danger onClick={() => onDelete(record)}
            style={{padding: 0}}>
              删除
            </Button>
          </PrivateComponent>
        </Space>
      ),
    },
  ];
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  const onCreate = () => {
    props.history.push(`${props.location.pathname}/create`);
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

            <Form.Item label='任务状态' name='progressState'>
              <Select placeholder="请选择" allowClear>
                {[...constant.progressState.type.entries()].map(([value, label]) => (
                  <Select.Option value={value} key={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label='结果状态' name='published'>
              <Select placeholder="请选择" allowClear>
                {[[0, "未发布"], [1, "已发布"]].map(([value, label]) => (
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
      <PrivateComponent id={410}>
        <p>
          <Space>
              <Button type='primary' ghost onClick={onCreate}>
              发布新任务
              </Button>
          </Space>
        </p>
      </PrivateComponent>

      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        size='middle'
        scroll={{ scrollToFirstRowOnChange: true, x: 1400 }}
      />
    </div>
  );
}
