import React, { useRef, useState } from 'react';
import { Table, Form, Row, Modal, DatePicker, message } from 'antd';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import api from 'src/api';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import OneLineText from 'src/components/OneLineText';
import useMoment from 'src/hook/useMoment';
import RefusedModal from './RefusedModal';
import AgreeModal from './AgreeModal';
import moment from 'moment';
import constant from 'src/constant';

export default function BatchApprovalModal(props: GT.Modal.Props & {cancel?: () => void}) {
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
    return api.leave.getApproval({current, size});
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, {

  });

  // 拒绝
  const refusedModal = useRef<GT.Modal.Ref>();
  // 同意
  const agreeModal = useRef<GT.Modal.Ref>();

  // 弹窗
  const handleClose = () => {
    setVisible(false);
    setLoading(false);
    form.resetFields();
    props.cancel && props.cancel();
  };

  const handleCancel = () => {
    if (rows.length < 1) {
      message.info({content: '请选择学生', style: {marginTop: '20vh'}});
      return;
    }
    refusedModal.current?.setVisible(true);
    refusedModal.current?.fillRecordIds(rows.map((item) => item.id));
  };

  const handleOk = () => {
    if (rows.length < 1) {
      message.info({content: '请选择学生', style: {marginTop: '20vh'}});
      return;
    }
    agreeModal.current?.setVisible(true);
    agreeModal.current?.fillRecords(rows);
  };

  const handleResult = () => {
    setLoading(false);
    setVisible(false);
    form.resetFields();
    props.onOk && props.onOk();
  };

  const columns: ColumnType<GT.Model.LeaveHistory>[] = [
    {
      title: '姓名',
      dataIndex: 'studentName',
      align: 'center',
      width: 150,
      render: (text) => <OneLineText maxWidth={150}>{text}</OneLineText>,
    },
    {
      title: '班级',
      dataIndex: 'className',
      align: 'center',
      width: 100,
    },
    {
      title: '住校情况',
      dataIndex: 'studentTypeName',
      // render: (value) => renderText('studentLivingCondition', value),
      align: 'center',
      width: 100,
    },
    {
      title: '请假类型',
      dataIndex: 'leaveType',
      render: (text) => renderText('leaveType', text),
      align: 'center',
      width: 100,
    },
    {
      title: '周期请假',
      dataIndex: 'isCycle',
      render: (text) => text == false ? '否' : '是',
      align: 'center',
      width: 100,
    },
    {
      title: '请假时间',
      dataIndex: 'startTime',
      render: (text, model) => model.leaveType == 2 ? <p style={{whiteSpace: 'pre-line', textAlign: 'center', marginBottom: 0}}>{moment(model.startTime).format("YYYY-MM-DD") + " 至\n" + moment(model.endTime).format("YYYY-MM-DD")}</p> : <p style={{whiteSpace: 'pre-line', textAlign: 'center', marginBottom: 0}}>{model.isCycle ? moment(model.startTime).format("YYYY-MM-DD") + " 至\n" + moment(model.endTime).format("YYYY-MM-DD") : moment(model.startTime).format("YYYY-MM-DD HH:mm") + " 至\n" + moment(model.endTime).format("YYYY-MM-DD HH:mm")}</p>,
      align: 'center',
      width: 170,
    },
    {
      title: '重复日期',
      dataIndex: 'repeatDate',
      render: (text, model) => text != undefined ? (model.leaveType == 2 ? text : (<p style={{marginBottom: 2, whiteSpace: 'pre-line',}}>{text + "\n"  + model.repeatStart + "--" + model.repeatEnd}</p>)) : '',
      align: 'center',
      width: 200,
    },
    {
      title: '回校住宿类型',
      dataIndex: 'goBed',
      render: (text) => renderText('goBed', text),
      align: 'center',
      width: 150,
    },
  ];

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  
  const onChange = (selectedRowKeys: any[], selectedRows: GT.Model.LeaveHistory[]) => {
    setRows(selectedRows);
  };

  return (
    <Modal
    title="批量审批"
    width={1300}
    visible={visible}
    onOk={handleOk}
    onCancel={handleClose}
    afterClose={handleClose}
    cancelText="拒绝"
    okText="同意"
    cancelButtonProps={{onClick: handleCancel}}
    confirmLoading={loading}>
    <div>
      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
        {...tableProps}
        // pagination={false}
        rowSelection={{ type: 'checkbox', onChange, selectedRowKeys: rows.map((item) => item.id) }}
        size='small'
        scroll={{ scrollToFirstRowOnChange: true }}
      />
      <RefusedModal
      onRef={(ref) => refusedModal.current = ref}
      onOk={handleResult} />
      <AgreeModal onRef={(ref) => agreeModal.current = ref}
      onOk={handleResult} />
    </div>
    </Modal>
  );
}
