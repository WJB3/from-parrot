import React, { useRef, useState } from 'react';
import { Table, Form, Input, Row, Button, Space, Modal, message, Select, DatePicker, Cascader, notification } from 'antd';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { useAntdTable, useRequest } from 'ahooks';

import GT from 'types';
import { ColumnType } from 'antd/es/table/interface';
import appStyle from 'src/App.style';
import api from 'src/api';
import constant from 'src/constant';
import useDictionary from 'src/hook/useDictionary';
import useDownload from 'src/hook/useDownload';
import useMoment from 'src/hook/useMoment';
import CancelModal from './component/CancelModal';
import BatchApprovalModal from './component/BatchApproval';
import { RouteComponentProps } from 'react-router-dom';
import OneLineText from 'src/components/OneLineText';
import { setTimeout } from 'timers';
import moment from 'moment';
import PrivateComponent from 'src/components/PrivateComponent';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function LeaveHistory(props: RouteComponentProps) {
  const [form] = Form.useForm<GT.DTO.SearchLeaveHistoryParmas>();
  const { renderText, renderSelect } = useDictionary();
  const [exportLoading, setExportLoading] = useState(false);
  const { date, datetime_m } = useMoment();
  const { download } = useDownload();
  const [current, setCurrent] = useState<GT.Model.LeaveHistory>();
  
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
      const startTime = times[0].format("YYYY-MM-DD").toString();
      const endTime = times[1].format("YYYY-MM-DD").toString();      
      rest.startTime = startTime;
      rest.endTime = endTime;
    }

    return api.leave.getHistoryPage({
      enrollmentYear, sectionId, classId, ...rest,
      current,
      size,
    });
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });
  const modal = useRef<GT.Modal.Ref>();

  const { submit, reset } = search;
  const onShow = (record: GT.Model.LeaveHistory) => {
    props.history.push(`${props.location.pathname}/LeavePassDetail/${record.id}`);
    // if (record.state == 1) {
    //   props.history.push(`${props.location.pathname}/LeavePassDetail/${record.id}`);
    // } else {
    //   props.history.push(`${props.location.pathname}/LeaveDetail/${record.id}`);
    // }
  };
  const onEdit = (value: GT.Model.LeaveHistory) => {
    setCurrent(value);
    setTimeout(()=>{
      modal.current?.setVisible(true);
    }, 250);
  };

  const onDelete = (record: GT.Model.LeaveHistory) => {
    if (record.state >= 1) {
      Modal.warning({
        title: '删除请假记录',
        content: '请假已审批，无法删除。',
        okText: "确定",
        maskClosable: true,
      });
    } else {
      Modal.confirm({
        title: '删除请假记录',
        content: (
        <div>
          <p>{record.state == -1 ? '确定删除此条记录？' : '已进入审批流程，确定删除此条记录？' }</p>
          <p style={{color: 'gray', fontSize: 14}}>删除后将无法恢复。</p>
        </div>),
        onOk: () => {
          api.leave.delete(record.id).then(() => {
            message.success('删除成功');
            submit();
          });
        },
      }); 
    }
  };

  const columns: ColumnType<GT.Model.LeaveHistory>[] = [
    {
      title: '审批编号',
      dataIndex: 'serialNumber',
      align: 'center',
      width: 160,
    },
    {
      title: '学生姓名',
      dataIndex: 'studentName',
      render: (text) => <OneLineText maxWidth={'100%'}>{text}</OneLineText>,
      align: 'center',
      width: 150,
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
      dataIndex: 'startTIme',
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
    {
      title: '发起时间',
      dataIndex: 'createdTime',
      align: 'center',
      width: 200,
    },
    {
      title: '审批状态',
      dataIndex: 'state',
      render: (text, model) => {
        const colors = ['#FF8948', '#9065F6', '#3CC251', '#FE4F54'];
        return <span style={{ color: colors[model.state + 1] }}>{renderText("taskApprovalStatus", text)}</span>;
      } ,
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 250,
      render: (text, record) => (
        <Space>
          <PrivateComponent id={434}>
            <Button type='link' onClick={() => onShow(record)}>
              查看
            </Button>
          </PrivateComponent>
            {record.state == 1 && record.needEarlyBack ? 
            (<PrivateComponent id={433}>
              <Button type='link' onClick={() => onEdit(record)}>提前销假</Button>
            </PrivateComponent>): 
            (<PrivateComponent id={432}>
              {record.state < 1 && <Button type='link' danger onClick={() => onDelete(record)}>删除</Button>}
            </PrivateComponent>)}
        </Space>
      ),
    },
  ];
  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };
  const onCreate = () => {
    props.history.push(`${props.location.pathname}/createLeave`);
  };

  const onExport = () => {
    const searchParams = form.getFieldsValue();
    const { org = [], ...rest } = searchParams;
    const [sectionId, enrollmentYear, classId] = org;
    let times = form.getFieldValue("startTime")
    if (times != undefined) {
      const startTime = times[0].format("YYYY-MM-DD").toString();
      const endTime = times[1].format("YYYY-MM-DD").toString();      
      rest.startTime = startTime;
      rest.endTime = endTime;
    }
    setExportLoading(true);
    api.leave
      .historyExportExcel({
        enrollmentYear, sectionId, classId, ...rest,
      })
      .then((res) => {
        download(res).finally(() => setExportLoading(false));
      })
      .catch(() => {
        setExportLoading(false);
      });
  };
  const cancelblock = (number?: number) => {
    setCurrent(undefined);
    if (number) {
      refresh();
    }
  };

  // 批量审批
  const approvalModal = useRef<GT.Modal.Ref>();
  const [approval, setApproval] = useState<boolean>();
  const showApproval = () => {
    setApproval(true);
    setTimeout(() => {
      approvalModal.current?.setVisible(true);
    }, 250);
  };

  const approvalCallback = (numer?: number) => {
    setApproval(false);
    if (numer) {
      refresh();
    }
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
                }}></Cascader>
            </Form.Item>

            <Form.Item label='审批编号' name='serialNumber' style={{width: 280}}>
              <Input placeholder='请输入' allowClear  onChange={inputClearChange}/>
            </Form.Item>

            <Form.Item label='请假类型' name='leaveType'>
              {renderSelect('leaveType', {onChange: selectClearChange})}
            </Form.Item>

            <Form.Item label='审批状态' name='state'>
              {renderSelect('taskApprovalStatus', {onChange: selectClearChange})}
            </Form.Item>

            <Form.Item label="请假时间" name="startTime">
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
      <PrivateComponent id={[429, 430, 431]}>
        <p>
          <Space>
            <PrivateComponent id={429}>
              <Button type='primary' ghost onClick={onCreate}>
              发起学生请假
              </Button>
            </PrivateComponent>
            <PrivateComponent id={430}>
              <Button type='primary' ghost onClick={showApproval}>
                批量审批
              </Button>
            </PrivateComponent>
            <PrivateComponent id={431}>
              <Button type='primary' ghost onClick={onExport} loading={exportLoading}>
                导出
              </Button>
            </PrivateComponent>
          </Space>
        </p>
      </PrivateComponent>

      <Table
        style={appStyle.table}
        columns={columns}
        rowKey='id'
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
      {current && <CancelModal onRef={(ref) => (modal.current = ref)}
      onOk={() => cancelblock(1)}
      cancel={cancelblock}
      id={current!.id}/>}

      {approval == true && <BatchApprovalModal 
      onRef={(ref) => (approvalModal.current = ref)}
      onOk={() => approvalCallback(1)}
      cancel={approvalCallback} />}
    </div>
  );
}
