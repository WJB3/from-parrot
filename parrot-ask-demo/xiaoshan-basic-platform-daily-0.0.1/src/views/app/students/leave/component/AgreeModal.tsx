import React, { useState } from "react";
import { Button, Form, message, Modal, Radio, Input, Cascader, Table, Select,} from "antd";
import constant from "src/constant";
import GT from "types";
import { useAntdTable, useRequest } from "ahooks";
import api from "src/api";
import appStyle from "src/App.style";
import { ColumnType } from "antd/lib/table";
import useDictionary from "src/hook/useDictionary";
import OneLineText from "src/components/OneLineText";
import moment from "moment";

// 批量审核同意
export default function AgreeModal(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("请假审批-同意");
  const [loading, setLoading] = useState(false);
  const { renderText } = useDictionary();
  const [form] = Form.useForm<any>();
  const [ids, setIds] = useState<number[]>([]);
  const [leaves, setLeaves] = useState<GT.Model.LeaveHistory[]>([]);
  // 是否有加签人，needCountersignature 
  const [other, setOther] = useState(false);
  const fillRecords = (datas: GT.Model.LeaveHistory[]) => {
    setIds(datas.map((e)=>e.id));
    const needs = datas.filter((e)=> e.needCountersignature);
    setLeaves(needs);
    setOther(needs.length > 0);
    setTitle(needs.length > 0 ? "请假审批-指定审批人员" : "请假审批-同意")
    submit();
  };

  // 老师组织数据
  const { data = [] } = useRequest(
    () => {
      form.setFieldsValue({teacherIds: ''});
      if (leaves && leaves.length > 0) {
        const student = leaves[0];
        return api.section.getGradeLeaders({
          params: {
            enrollmentYear: student.enrollmentYear,
            sectionId: student.sectionId,
          },
        });
      }
      return Promise.resolve([]);
    },
    {
      refreshDeps: [leaves],
    },
  );
    
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
  ];
  const getTableData = () => {
    return Promise.resolve({list: leaves, total: leaves.length});
  };
  const { tableProps, search, refresh } = useAntdTable(getTableData, {});
  const { submit, reset } = search;

  tableProps.pagination = {
    ...tableProps.pagination,
    ...constant.pagination,
  };

  props.onRef({
    setVisible,
    setTitle,
    form: form,
    fillRecords,
  });

  const handleOk = () => {
    form.validateFields().then(() => {
      setLoading(true);
      let data = form.getFieldsValue();
      api.leave.approvalBatch({'recordIds': ids.join(","), ...data})
      .then(() => {
        setVisible(false);
        setLoading(false);
        message.info("审批成功");
        props.onOk && props.onOk();
      }).catch(()=> {
        setLoading(false);
      });
    });
  };

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
  };

  return (
    <div>
      <Modal
        width={other ? 1300 : undefined}
        title={title}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        afterClose={handleCancel}
        confirmLoading={loading}
      >
        {leaves.length > 0 && (
          <div>
            <p>以下请假人员需进行二次审批</p>
            <Table
            style={appStyle.table}
            columns={columns}
            {...tableProps}
            rowKey='id'
            size='small'
            scroll={{ scrollToFirstRowOnChange: true }}
            />
          </div>
        )}
        <Form
          preserve={false}
          form={form}
          initialValues={{result: 1}}
          {...constant.form.layout}
        >
          <Form.Item label="请假审批" name="result" hidden>
          </Form.Item>
          <Form.Item label="备注" name="remark" style={{marginTop: 10}} rules={[{ whitespace: true, message: "请输入备注" },]}>
                <Input placeholder="请输入备注" maxLength={50} style={{ width: 300 }}></Input>
          </Form.Item>
          {other == true ? <Form.Item label="审批人员" name="teacherIds" rules={[{ required: true }]}>
              <Select style={{ width: 300 }} allowClear>
                {data.map((e) => {
                    return <Select.Option value={e.teacherId} key={e.teacherId}>{e.name}</Select.Option>;
                  })}
              </Select>
              {/* <Cascader
              placeholder='请选择'
              options={options} style={{ width: 300 }} /> */}
            </Form.Item> : null }
        </Form>
      </Modal>
    </div>
  );
}