import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Row, Col, Tooltip, Radio, Spin } from "antd";
import FormItem from 'antd/lib/form/FormItem';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';
import api from 'src/api';
import IconFont from 'src/components/IconFont';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { useHistory } from 'react-router-dom';
import { useForm } from 'antd/lib/form/Form';
import ApprovalProcess from "src/views/app/reportInfo/teacherReport/component/ApprovalProcess";
import VerifyModal from './VerifyModal';
import { ActionType, useGlobalState } from 'src/store';

export default function LeaveDetail(props: GT.Modal.Props & {recordId: number, onCancel?: () => void}) {
  const history = useHistory();
  const [form] = useForm();
  const { renderRadio } = useDictionary();
  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: "查看请假记录" }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);
  
  const modal = useRef<GT.Modal.Ref>();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<GT.Model.LeaveDetail>();

  // 是否是课间操
  const [isExercise, setExercise] = useState<boolean>();
  // 是否是周期请假
  const [isCycle, setCycle] = useState<boolean>();

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const approvalLayout = {
    wrapperCol: { offset: 6, span: 20 },
  };
  const renderStep = (detail: GT.Model.LeaveDetail) => {
    return (
      <Row justify="center">
        <Col flex={1} style={{marginTop: 20}}>
          <div>审批流程</div>
        </Col>
        <Col flex={10}>
           <ApprovalProcess
             state={detail.state}
             sponsorName={detail.bizName}
             sponsorTime={detail.applyTime}
             nodes={detail.nodes}
             copies={detail.copyNodes}
             active={detail.active}
             contentWidth={300}
             itemMaxWidth={100}
           ></ApprovalProcess>
        </Col>
      </Row>
    )        
  };

  const submit = () => {
    if (details?.state == 2) {
      history.replace(`/app/362/366/createLeave/${props.recordId}`);
    } else {
      modal.current?.setVisible(true);
    }
  };

  const approvalBack = () => {
    if (props.onOk) {
      props.onOk();
    } else {
      history.goBack();
    }
  };

  const cancelBack = () => {
    if (props.onCancel) {
      props.onCancel();
    } else {
      history.goBack();
    }
  };

  // 获取详情数据
  const { data: formData } = useRequest(() => api.leave.getDetail(props.recordId), {
    refreshDeps: [props.recordId],
    onSuccess(result) {
      setDetails(result);
      setExercise(result.leaveType == 2);
      setCycle(result.isCycle);
      setLoading(false);
      let dict: {repeatDate?: (string | undefined)[], repeatStart?: string, repeatEnd?: string, startTime?: any, endTime?: any} = {};
      if (result.repeatDate) {
        const days = new Map([[1, "每周一"], [2,"每周二"], [3, "每周三"], [4,"每周四"], [5, "每周五"], [6,"每周六"], [7, "每周日"]]);
        let repeatDate = result.repeatDate.split(";").map((e)=> (days.get(Number(e))));
        dict.repeatDate = repeatDate;
        dict.repeatStart = moment(result.startTime).format("YYYY-MM-DD") + "--" + moment(result.endTime).format("YYYY-MM-DD");
        dict.repeatEnd = moment(result.repeatStart).format('HH:mm') + '--' + moment(result.repeatEnd).format('HH:mm');
      } else {
        if (result.leaveType == 2) {
          dict.startTime = moment(result.startTime).format("YYYY-MM-DD");
          dict.endTime = moment(result.endTime).format("YYYY-MM-DD");
        } else {
          dict.startTime = moment(result.startTime).format("YYYY-MM-DD HH:mm");
          dict.endTime = moment(result.endTime).format("YYYY-MM-DD HH:mm");
        }
      }
      form.setFieldsValue({studentNames: result.studentNames,
        leaveType: result.leaveType, leaveReason: result.leaveReason, isCycle: result.isCycle ? 0: 1, 
        leaveHours: `${Math.floor(result.leaveHours/60)}小时${result.leaveHours - Math.floor(result.leaveHours/60) * 60}分钟`, goBed: result.goBed, ...dict});
    },
    onError(e: Error) {
      setLoading(false);
      if (props.onOk) {
        // message.info("待办事项已改变，请刷新页面重试");
        props.onOk();
      } else {
        history.goBack();
      }
    },
  });

  const bottomNode = (type: number) => {
    if (props.onCancel) {
      if (type == 2) {
        if (details?.enableApproval == true) {
          return (
            <div style={{position: 'fixed', bottom: '0px', width: '700px', height: '74px', backgroundColor: 'white', zIndex: 1000}}>
              <div style={{display: "flex", width: '100%', justifyContent: 'center', alignItems: "center", paddingTop: 10}}>
                {details?.enableApproval && <Button type="primary" onClick={submit}>
                {details?.state === 2 ? '再次提交' : '审批'}</Button>}
                <Button
                  style={{ marginLeft: 10 }}
                  onClick={()=>props.onOk && props.onOk(2)}>
                  取消
                </Button>
              </div>
            </div>
          );
        }
      } else {
        return (
          <div style={{position: 'fixed', bottom: '0px', width: '700px', height: '74px', backgroundColor: 'white', zIndex: 1000}}>
          <div style={{display: "flex", width: '100%', justifyContent: 'center', alignItems: "center", paddingTop: 10}}>
            <Button
              onClick={()=>props.onOk && props.onOk(2)}>
              返回
            </Button>
          </div>
        </div>
        );
      }
    } else {
      if (type == 1) {
        if (details?.enableApproval == true) {
          return (
            <div>
            <FormItem {...tailLayout}>
              <Button 
                type="primary"
                onClick={submit}>
                {details?.state === 2 ? '再次提交' : '审批'}
              </Button>
              <Button style={{ marginLeft: 10 }}
              onClick={cancelBack}>
                返回
              </Button>
            </FormItem>
          </div>
          ); 
        } else {
          return (
            <div>
            <FormItem {...tailLayout}>
              <Button onClick={cancelBack}>
                返回
              </Button>
            </FormItem>
          </div>
          );
        }
      }

      return <div></div>;
    }
  }

  return loading ? (
    <Row justify="center">
      <Spin
        style={{ marginTop: "30vh" }}
        spinning={loading}
        size="large"
      ></Spin>
    </Row>
  ) : (
    <div className={props.onCancel ? 'csdrawer_list': 'form_list'}>
      <div className={props.onCancel ? "form_drawer_detail": 'form_list_content'} style={{marginBottom: props.onCancel ? 100 : 10}}>
        <Row>
          <Col span={0.5}>
            <IconFont
              type="iconcaiji-bianji"
              style={{ fontSize: 24, paddingTop: 30, paddingLeft: 30 }}
            ></IconFont>
          </Col>
          <Col span={4}>
            <p style={{ color: '#303133', fontSize: 16, fontWeight: 'bold', paddingTop: 30, paddingLeft: 10 }}>学生请假</p>
          </Col>
        </Row>
        <Form
        {...layout}
        layout="horizontal"
        colon={false}
        form={form}>
          <Form.Item label="请假学生" name="studentNames" rules={[{ required: true }]}>
            <Input
                placeholder="请选择"
                readOnly={true}
                style={{ width: 350}}
                disabled>
            </Input>
          </Form.Item>

          <Form.Item label='请假类型' name='leaveType' rules={[{ required: true }]}>
            {renderRadio('leaveType', {disabled: true})}
          </Form.Item>

          <Form.Item label="请假事由" name="leaveReason" rules={[{ required: true }]}>
            <Input.TextArea disabled style={{ width: 350 }} autoSize></Input.TextArea>
          </Form.Item>

          <Form.Item label='周期请假' name='isCycle' rules={[{ required: true }]}>
            <Radio.Group disabled>
              {[[1, "否"], [0,"是"]].map(([val, label]) => {
                return <Radio value={val}>{label}</Radio>;
              })}
            </Radio.Group>
          </Form.Item>      

          {/* // 非周期 */}
          {isCycle != true &&
            <div>
              <Form.Item label="请假开始时间" name="startTime" rules={[{ required: true }]}>
                <Input disabled style={{ width: 350 }} />
              </Form.Item>

              <Form.Item label="请假结束时间" name="endTime" rules={[{ required: true }]}>
                <Input disabled style={{ width: 350 }} />
              </Form.Item>
            </div>
          }
          {/* // 非课间操 、 非周期 */}
          {isExercise != true && isCycle != true &&
            <Form.Item label="请假时长" name="leaveHours" rules={[{ required: true }]}>
              <Input style={{ width: 350 }} disabled>
              </Input>
            </Form.Item>
          }

          {/* // 非课间操，是周期 */}
          { isCycle == true && 
            <div>
              <Form.Item label="请假日期范围" name="repeatStart" rules={[{ required: true }]}>
                <Input disabled style={{ width: 350 }} />
              </Form.Item>
              <Form.Item label="重复日期" name="repeatDate" rules={[{ required: true }]}>
                <Input disabled style={{ width: 350 }} />
              </Form.Item>
              {isExercise != true && <Form.Item label="请假时间段" name="repeatEnd" rules={[{ required: true }]}>
                  <Input disabled style={{ width: 350 }} />
              </Form.Item>}
            </div>
          }

          {/* // 非课间操 */}
          {isExercise != true && 
            <Form.Item label='住校生回校住宿类型' name='goBed' rules={[{ required: true }]}>
              {renderRadio('goBed', {disabled: true})}
            </Form.Item>
          }

          <FormItem {...approvalLayout}>
            <div>
              {details?.state !== -2 && details?.state !== undefined
                ? renderStep(details)
                : null}
            </div>
          </FormItem>
          { bottomNode(1)}
        </Form>
        {details && details.state < 1 && <VerifyModal
            onRef={(ref) => (modal.current = ref)}
            onOk={approvalBack}
            recordIds={[Number(props.recordId)]}
            needCountersignature={details!.needCountersignature}
            student={details.studentInfos[0]}
          />}
      </div>
      { bottomNode(2)}
    </div>
  )
}
