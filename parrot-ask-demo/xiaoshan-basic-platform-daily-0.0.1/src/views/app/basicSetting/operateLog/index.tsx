import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { Button, Row, Table, Form, Space, Input, DatePicker, Select } from 'antd';
import { ColumnType } from 'antd/lib/table';
import React, { useRef } from 'react';
import api from 'src/api';
import appStyle from 'src/App.style';
import JsonModal from 'src/components/JsonModal';
import constant from 'src/constant';
import GT from 'types';
import useApp from 'src/hook/useApp';
import { useRequest } from 'ahooks';
export default function OperateLogPage() {
  const [form] = Form.useForm();
  const { getSubMenus } = useApp();
  const modal = useRef<GT.Modal.Ref>();
  const { data: apps } = useRequest(() => api.permission.getPermissions({ level: 2 }));
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    const { date, ...rest } = formData;
    const [startTime, endTime] = (date as moment.Moment[]) || [];
    return api.base.getOperateLogPage({
      params: {
        current,
        size,
        ...rest,
        startTime: startTime?.valueOf(),
        endTime: endTime?.valueOf(),
      },
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

  const columns: ColumnType<GT.Model.OperateLog>[] = [
    {
      title: '操作时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '操作人',
      align: 'center',
      dataIndex: 'username',
    },
    {
      title: '操作IP',
      align: 'center',
      dataIndex: 'ip',
    },
    {
      title: '操作应用',
      align: 'center',
      dataIndex: 'application',
    },
    {
      title: '操作位置',
      align: 'center',
      dataIndex: 'operationLocation',
    },
    {
      title: '操作类型',
      align: 'center',
      dataIndex: 'operationName',
    },
    {
      title: '详细数据',
      align: 'center',
      dataIndex: 'messageDetail',
      render: (jsonStr) => {
        return (
          <Button
            type='link'
            onClick={() => {
              modal.current?.setVisible(true);
              modal.current?.setJSON(JSON.parse(jsonStr || '{}'));
            }}>
            查看
          </Button>
        );
      },
    },
  ];
  return (
    <div>
      <Form form={form} className='search_form'>
        <Row>
          <Row className='search_form_items'>
            <Form.Item label='操作时间' name='date' style={{ width: 420 }}>
              <DatePicker.RangePicker showTime />
            </Form.Item>

            <Form.Item label='操作应用' name='application'>
              <Select placeholder='请选择' showSearch>
                <Select.Option value={'个人工作台'}> 个人工作台</Select.Option>
                {apps?.map((app) => (
                  <Select.Option value={app.zhName}> {app.zhName}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label='操作人' name='username'>
              <Input placeholder='请输入'></Input>
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
        scroll={{ scrollToFirstRowOnChange: true }}
      />
      <JsonModal onRef={(ref) => (modal.current = ref)}></JsonModal>
    </div>
  );
}
