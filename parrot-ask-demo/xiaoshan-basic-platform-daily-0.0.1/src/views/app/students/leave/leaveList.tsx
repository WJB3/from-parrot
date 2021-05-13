import React, { useState } from 'react';
import { Table, Form, Input, Row, Button, Space, DatePicker, Select, Cascader } from 'antd';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable, useRequest } from 'ahooks';

import GT from 'types';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import api from 'src/api';
import constant from 'src/constant';
import useMoment from 'src/hook/useMoment';
import useDownload from 'src/hook/useDownload';
import useDictionary from 'src/hook/useDictionary';
import { RouteComponentProps } from 'react-router-dom';
import moment from 'moment';

const { RangePicker } = DatePicker;
export default function LeaveList(props: RouteComponentProps) {
  const [form] = Form.useForm<GT.DTO.SearchLeaveListParmas>();
  const [exportLoading, setExportLoading] = useState(false);
  const { renderText, renderSelect } = useDictionary();
  const {date, datetime_m} = useMoment();
  const { download } = useDownload();

  // 学生组织数据
  const { data = [] } = useRequest(() => api.section.getTree({ all: false }));
  const handler = (list: any[]) => {
    return list.map((d) => {
      const r: any = {
        label: d.sectionName || d.gradeName || d.className,
        value: d.sectionId || d.enrollmentYear || d.classId,
      };
      if (d.nodes) {
        r.children = handler(d.nodes);
      }
      return r;
    });
  };
  const options = handler(data);

  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    const { org = [], ...rest } = formData;
    const [sectionId, enrollmentYear, classId] = org;
    let times = form.getFieldValue("startTime")
    if (times != undefined) {
      const startTime = times[0].format("YYYY-MM-DD HH:mm").toString();
      const endTime = times[1].format("YYYY-MM-DD HH:mm").toString();      
      rest.startTime = startTime;
      rest.endTime = endTime;
    }
    return  api.leave.getPage({enrollmentYear, sectionId, classId, ...rest, current, size});
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const { submit, reset } = search;
  const onExport = () => {
    const searchParams = form.getFieldsValue();
    const { org = [], ...rest } = searchParams;
    const [sectionId, enrollmentYear, classId] = org;
    let times = form.getFieldValue("startTime")
    if (times != undefined) {
      const startTime = times[0].format("YYYY-MM-DD HH:mm").toString();
      const endTime = times[1].format("YYYY-MM-DD HH:mm").toString();      
      rest.startTime = startTime;
      rest.endTime = endTime;
    }
    setExportLoading(true);
    api.leave
      .exportExcel({
        enrollmentYear, sectionId, classId, ...rest,
      })
      .then((res) => {
        download(res).finally(() => setExportLoading(false));
      })
      .catch(() => {
        setExportLoading(false);
      });
  };

  const columns: ColumnType<GT.Model.Leave>[] = [
    {
      title: '日期',
      dataIndex: 'recordTime',
      render: (value) => date(value),
      align: 'center',
    },
    {
      title: '学生姓名',
      dataIndex: 'studentName',
      render: (value, model) => <Button type='link' onClick={()=>props.history.push(`/app/362/365/LeaveDetail/${model.recordId}`)}>{value}</Button>,
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
      title: '回校住宿',
      dataIndex: 'goBed',
      // render: (value) => renderText('goBed', value),
      render: (value) => value == undefined ? "" : (value == 1 ? "否" : "是"),
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
  ];
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  const inputClearChange = (e: any) => {
    if (e.target.value.length == 0) {
      submit();                  
    }
  };

  const selectClearChange = (value: number, option: any) => {
    if (value == undefined) {
      submit();                  
    }
  };

  return (
    <div>
      <Form form={form} className='search_form'>
        <Row>
          <Row className='search_form_items'>

            <Form.Item label='学生姓名' name='studentName'>
              <Input placeholder='请输入学生姓名' allowClear onChange={inputClearChange}/>
            </Form.Item>

            <Form.Item label='班级' name='org' style={{width: 250}}>
              <Cascader 
                placeholder='请选择'
                options={options}
                changeOnSelect
                allowClear
                onChange={(value, selected) => {
                  if (selected == undefined || selected.length == 0) {
                    submit();
                  }
                }}
                ></Cascader>
            </Form.Item>

            <Form.Item label='回校住宿' name='goBed'>
              {/* {renderSelect('goBed')} */}
              <Select
              placeholder={'请选择'}
              getPopupContainer={(node) => {
                if (node?.parentElement) {
                  return node.parentElement;
                }
                return document.body;
              }} allowClear
              onChange={selectClearChange}>
              {[[0, "是"], [1, "否"]].map(([value, label]) => (
                <Select.Option value={value} key={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
            </Form.Item>

            <Form.Item label='请假类型' name='leaveType'>
              {renderSelect('leaveType', {onChange: selectClearChange})}
            </Form.Item>

            <Form.Item label="日期" name="startTime">
              <RangePicker
                style={{ width: 300 }}
                format="YYYY-MM-DD"
                onChange={(values, formats) => {
                  if (formats[0].length == 0) {
                      submit();
                  }
                }}
              />
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
      <p>
        <Button type='primary' ghost onClick={onExport} loading={exportLoading}>
          导出
        </Button>
      </p>

      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='timeId'
        {...tableProps}
        // rowSelection={{
        //   type: 'checkbox',
        //   onChange,
        //   fixed: true,
        //   selectedRowKeys: rows.map((item) => item.id),
        // }}
        size='middle'
        scroll={{ scrollToFirstRowOnChange: true, x: 1400 }}
      />
    </div>
  );
}
