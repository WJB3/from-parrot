import React, { useState } from 'react';
import { Table, Form, Row, Modal, DatePicker, message, Select } from 'antd';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import api from 'src/api';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import OneLineText from 'src/components/OneLineText';
import useMoment from 'src/hook/useMoment';
import constant from 'src/constant';
import moment from 'moment';

export default function CancelModal(props: GT.Modal.Props & {id: number, cancel?: () => void}) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const { renderText, renderSelect } = useDictionary();
  const { date, datetime_m } = useMoment();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [rows, setRows] = useState<GT.Model.LeaveHistory[]>([]);

  // 回调
  props.onRef({
    setVisible,
    setTitle,
    form: form,
  });

  // 学生信息
  const getTableData = ({ current, pageSize: size }: PaginatedParams[0], formData: any) => {
    return api.leave.foreList(props.id,{ params: {current, size}});
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    defaultPageSize: 5,
  });
  const { submit, reset } = search;

  // 弹窗
  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
    props.cancel && props.cancel();
  };

  const handleOk = () => {
    if (rows.length < 1) {
      message.info({content: '请选择销假学生', style: {marginTop: '20vh'}});
      return;
    }
    form.validateFields().then(() => {
      setLoading(true);
      const data = form.getFieldsValue();
      data["ids"] = rows.map((e) => e.id).join(',');
      data['goBackTime'] = data['goBackTime'].format("YYYY-MM-DD HH:mm:ss").toString();
      api.leave.cancelHistory(data).
      then((result) => {
        message.success("销假成功");
        setLoading(false);
        setVisible(false);
        form.resetFields();
        props.onOk && props.onOk();
        setRows([]);
      }).catch(() => {
        setLoading(false);
      });
    });
  };

  const columns: ColumnType<GT.Model.LeaveHistory>[] = [
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
      title: '周期请假',
      dataIndex: 'isCycle',
      render: (text) => text == false ? '否' : '是',
      align: 'center',
    },
    {
      title: '请假时间',
      dataIndex: 'startTime',
      render: (text, model) => model.leaveType == 2 ? <p style={{whiteSpace: 'pre-line', textAlign: 'center', marginBottom: 0}}>{moment(model.startTime).format("YYYY-MM-DD") + " 至\n" + moment(model.endTime).format("YYYY-MM-DD")}</p> : <p style={{whiteSpace: 'pre-line', textAlign: 'center', marginBottom: 0}}>{model.isCycle ? moment(model.startTime).format("YYYY-MM-DD") + " 至\n" + moment(model.endTime).format("YYYY-MM-DD") : moment(model.startTime).format("YYYY-MM-DD HH:mm") + " 至\n" + moment(model.endTime).format("YYYY-MM-DD HH:mm")}</p>,
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
  ];

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
    pageSizeOptions: ["5", '10', '20', '50', '100'],
  };
  
  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.LeaveHistory[]) => {
    setRows(selectedRows);
  };

  const disabledDate = (current: any) => {
    // return current && current >= moment();
    if (tableProps.dataSource.length > 0) {
      const item = tableProps.dataSource[0];
      if (item.isCycle) {
        const end = moment(item.endTime, "YYYY-MM-DD").endOf('day');
        const start = moment(item.startTime, 'YYYY-MM-DD');
        return (start && start >= current) || (end && end <= current);
      } else {
        const end = moment(item.endTime, "YYYY-MM-DD HH:mm").endOf('day');
        const start = moment(item.startTime, 'YYYY-MM-DD HH:mm');
        return (start && start >= current) || (end && end <= current);
      }
    } else {
      return true;
    }
  }

  return (
    <Modal
    title="提前销假"
    width="80%"
    visible={visible}
    onOk={handleOk}
    onCancel={handleCancel}
    afterClose={handleCancel}
    confirmLoading={loading}>
    <div>
      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        rowSelection={{ type: 'checkbox', onChange, selectedRowKeys: rows.map((item) => item.id) }}
        size='small'
        scroll={{ scrollToFirstRowOnChange: true }}
      />

      <Form form={form} className='search_form'>
        <p style={{color: '#303133', fontSize: 16, fontWeight: 'bold'}}>提前销假</p>
        <Row>
          <Row className='search_form_items'>
            <Form.Item style={{width: 350}} label="返校时间" name="goBackTime" rules={[{ required: true, message: "请选择返校时间"}]}>
                <DatePicker picker='date' showTime showNow={true} placeholder="请选择返校时间" format={"YYYY-MM-DD HH:mm"} disabledDate={disabledDate} />
            </Form.Item>

            <Form.Item label='回校住宿' name='goBed' rules={[{ required: true, message: "请选择回校住宿"}]}>
              {/* {renderSelect('goBed')} */}
              <Select
              placeholder={'请选择'}
              getPopupContainer={(node) => {
                if (node?.parentElement) {
                  return node.parentElement;
                }
                return document.body;
              }} allowClear>
              {[[0, "是"], [1, "否"]].map(([value, label]) => (
                <Select.Option value={value} key={value}>
                  {label}
                </Select.Option>
              ))}
              </Select>
            </Form.Item>
          </Row>
        </Row>
      </Form>

    </div>
    </Modal>
  );
}
