import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, message, Row, Col, Divider, Tooltip, Radio, Cascader, TimePicker, Modal } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';
import api from 'src/api';
import SelectStudentsModal from './NewSelectStudents'
import IconFont from 'src/components/IconFont';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { useHistory } from 'react-router-dom';
import { ActionType, useGlobalState } from 'src/store';

const { RangePicker } = TimePicker;

export default function CreateLeave(props: {recordId?: number}) {
  const history = useHistory();
  const [form] = Form.useForm<any>();
  const { renderRadio, renderSelect } = useDictionary();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);

  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: "发起请假" }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);
  
  const modal = useRef<GT.Modal.Ref>();
  // 当前选中学生
  const [students, setStudents] = useState<GT.Model.Student[]>();
  // 当前请假时长，非周期且非课间操才有
  const [leaveHours, setLeaveHours] = useState<number>();
  // 是否是课间操
  const [isExercise, setExercise] = useState<boolean>();
  // 是否是周期请假
  const [isCycle, setCycle] = useState<boolean>(false);
  // 学生组织数据
  const { data: studentGroup = [] } = useRequest(() => api.section.getTree({ all: false, containsAdmin: false }));
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
  const options = handler(studentGroup); 

  // 老师组织数据
  const { data = [] } = useRequest(
    () => {
      form.setFieldsValue({teacherId: ''});
      if (roles == undefined) {
        // 非班主任无需审核
        setNeedSign(false);
        return Promise.resolve([]);
      }
      if (students && students!.length > 0) {
        const student = students[0];
        // 若是年级组，且含有该年级，无需审核
        if (roles && roles["ROLE_grade_group_members"] && roles["ROLE_grade_group_members"].length > 0) {
          for (let index = 0; index < roles["ROLE_grade_group_members"].length; index++) {
            const element = roles["ROLE_grade_group_members"][index];
            if (element.sectionId == student.sectionId && element.enrollmentYear == student.enrollmentYear) {
              // 判断所选学生是否属于该用户年级组管理
              setNeedSign(false);
              return Promise.resolve([]);
            }
          }
        }

        // 其他情况下，只有是该班班主任，则获取下一级审核员信息
        setNeedSign(true);
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
      refreshDeps: [students],
    },
  );

  // 是否显示加签
  const [needSign, setNeedSign] = useState(false);

  // 获取用户班主任班级数据、年级组数据
  const {data: roles} = useRequest( () => {
    return api.leave.getRoleDetails().then((res) => {
      if (res["ROLE_head_teacher"] == undefined || res["ROLE_head_teacher"].length <= 0) {
        // 不是班主任
        return undefined;
      } else {
        return res;
      }
    }).catch((e) => {
      history.goBack();
    });
  });

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  // 发起请假
  const submit = (isCommit: boolean = false) => {
    // 提交表单数据
    form.validateFields().then(() => {
      setLoading(true);
      let data = form.getFieldsValue();
      if (data.startTime != undefined) {
        data.startTime = data.startTime.format("YYYY-MM-DD HH:mm").toString();
        data.endTime = data.endTime.format("YYYY-MM-DD HH:mm").toString();
      }

      if (data.repeatStart != undefined) {
        const startTime = data.repeatStart[0].format("YYYY-MM-DD HH:mm").toString();
        const endTime = data.repeatStart[1].format("YYYY-MM-DD HH:mm").toString();   
        data.startTime = startTime;
        data.endTime = endTime;
      }
      if (data.repeatDate != undefined) {
        data.repeatDate = data.repeatDate.join(";");
      }
      if (data.repeatEnd != undefined) {
        const startTime = data.repeatEnd[0].format("HH:mm").toString();
        const endTime = data.repeatEnd[1].format("HH:mm").toString();   
        data.repeatStart = startTime;
        data.repeatEnd = endTime;
      } else {
        data.repeatStart = undefined;
        data.repeatEnd = undefined;
      }
      data.recordId = formData?.recordId;
      if (formData) {
        data.isReject = 0;
      } else {
        data.isReject = 1;
      }
      api.leave.createLeave({...data, isCommit: isCommit, 
        studentIds: getStudentIds()})
      .then((result) => {
        if(result.tip) {
          Modal.confirm({
            title: '请假消息提示',
            content: result.tip,
            cancelText: "取消",
            okText: '确认提交',
            onOk: () => {
              submit(true);
              // if (history.location.pathname.includes("createLeave")) {
              //   history.goBack();
              // }
            },
          });
        } else {
          message.success('提交成功')
          history.goBack();
        }
      }).finally(() => {
        setLoading(false)
      });
    });
  }

  // 获得学生名称
  const getMembersName = (data: GT.Model.Student[]) => {
    // 返回一个string类的数组
    let lists: string[] = []
    // 通校生人数
    let studentTypes = 0
    data.forEach( element => {
      lists.push(element.name)
      if (element.livingCondition == 0) {
        studentTypes += 1
      }
    });
    if (studentTypes == lists.length) {
      // 全为通校生
      form.setFieldsValue({goBed: 2});
    }
    return lists
  };

  const getStudentIds = () => {
    // 返回一个string类的数组
    let lists: {id: number, type: number, classId: number}[] = []
    if (students !== undefined) {
      students.forEach( element => {
        lists.push({id: element.id, type: element.livingCondition, classId: element.classId});
      });
    }

    return lists;
  };

  // 时间处理
  const startDateChange = (date: any, dateString: string) => {
    const end: moment.Moment = form.getFieldValue('endTime');
    dateChange(date, end);
  };

  const endDateChange = (date: any, dateString: string) => {
    const start: moment.Moment = form.getFieldValue('startTime');
    dateChange(start, date);
  };

  const dateChange = (start: any, end: any) => {
    if (start == undefined || start.valueOf() == 0 || end == undefined || end.valueOf() == 0) {
      // 开始时间或结束时间为空
      form.setFieldsValue({leaveHours: undefined});
      setLeaveHours(undefined);
      form.setFieldsValue({teacherId: ''});
    } else {
      // 计算小时
      if (start.valueOf() >= end.valueOf()) {
        // 开始时间不可大于结束
        message.warning('开始时间不可大于结束');
        form.setFieldsValue({endTime: '', leaveHours: undefined});
        setLeaveHours(undefined);
        form.setFieldsValue({teacherId: ''});
      } else {
        const diff = end.endOf('m').diff(start.endOf('m'), 'minutes');
        form.setFieldsValue({leaveHours: diff});
        setLeaveHours(diff);
      }
    }
  };

  // 课间操请假事由
  const renderExercise = () => {
    const map = state.dictionary.get("studentLeaveReason");
    if (map) {
      const list = [...map?.entries()];
      return (
        <Select style={{ width: 350 }} placeholder="请选择" allowClear>
          {list.map(([value, label]) => {
              return <Select.Option value={label} key={label}>{label}</Select.Option>;
            })}
        </Select>
      )
    } else {
      return null;
    }
  };

  // 获取详情数据
  const { data: formData } = useRequest(() => props.recordId && api.leave.getDetail(props.recordId!), {
    refreshDeps: [props.recordId],
    onSuccess(result) {
      setStudents(result.studentInfos);
      setExercise(result.leaveType == 2);
      setCycle(result.isCycle);
      setLeaveHours(result.leaveHours);
      let approverInfo: GT.Model.Teacher | undefined;
      if (result.approverInfos) {
        approverInfo = result.approverInfos.shift()
      }

      let dict: {repeatDate?: string, repeatStart?: string, repeatEnd?: string, startTime?: moment.Moment, endTime?: moment.Moment} = {};
      // 暂时来说能发起重新审批的只有非周期且非课间操
      if (result.repeatDate) {
        // const days = new Map([[1, "每周一"], [2,"每周二"], [3, "每周三"], [4,"每周四"], [5, "每周五"], [6,"每周六"], [7, "每周日"]]);
        // let repeatDate = result.repeatDate.split(";")//.map((e)=> (days.get(Number(e))));
        // dict.repeatDate = repeatDate.join(',');
        // dict.repeatStart = date(new Date(result.startTime)) + "--" + date(new Date(result.endTime));
        // dict.repeatEnd = moment(new Date(result.repeatStart)).format('HH:mm') + '--' + moment(new Date(result.repeatEnd)).format('HH:mm');
      } else {
        dict.startTime = moment(result.startTime, "YYYY-MM-DD HH:mm");
        dict.endTime = moment(result.endTime, "YYYY-MM-DD HH:mm");
      }
      form.setFieldsValue({studentNames: result.studentNames,
        leaveType: result.leaveType, leaveReason: result.leaveReason, isCycle: result.isCycle ? 0: 1, 
        leaveHours: result.leaveHours, goBed: result.goBed, ...dict});
    },
  });

  const chooseStudents = () => {
    modal.current?.setTitle('选择请假学生');
    modal.current?.setVisible(true);
    if (formData && formData.studentInfos.length > 0 && !isReaply) {
      // 如果有详情，且详情有学生数据，且是第一次点击。选择学生界面默认学生班级和班级学生数据和选中条件
      setIsReaply(true);
      modal.current?.setPreStudents(formData.studentInfos);
    }
  };
  /// 是否重新提交点击选择学生第一次
  const [isReaply, setIsReaply] = useState(false);

  return (
    <div className="form_list">
      <div className="form_list_content">
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
        initialValues={{isCycle: 1}}
        form={form}>
          <Form.Item label="请假学生" name="studentNames" rules={[{ required: true, message: "请选择请假学生"}]}>
            <Input
                placeholder="请选择"
                readOnly={true}
                onClick={chooseStudents}
                allowClear={true}
                style={{ width: 350}}
                suffix={
                <div style={{color: '#5781F2'}} onClick={chooseStudents}>    
                {(students && students.length > 1) ? "共" + students.length + "人" : null}
                </div>}
              >

            </Input>
          </Form.Item>

          <Form.Item label='请假类型' name='leaveType' rules={[{ required: true, message: "请选择请假类型"}]}>
            {renderRadio('leaveType', {onChange: (e) => {
              setExercise(e.target.value == 2);
              if (e.target.value == 2) {
                form.setFieldsValue({leaveReason: undefined});
                  // setCycle(false);
                  // form.setFieldsValue({isCycle: false});
              }
              }})}
          </Form.Item>

          {/* 课间操请假，请假事由通过选择获取 */}
          <Form.Item label="请假事由" name="leaveReason" rules={[{ required: true, whitespace: true, message: isExercise ? '请选择请假事由' : '请填写请假事由，最多50字', type: 'string', max: 50}]}>
          { isExercise ? renderExercise() :
            <Input.TextArea placeholder="请填写请假事由" style={{ width: 350 }} maxLength={100} autoSize></Input.TextArea>
          }
          </Form.Item>

          <Form.Item label='周期请假' name='isCycle' rules={[{ required: true, message: "请选择周期请假"}]}>
            <Radio.Group onChange={(e) => {
              setCycle(e.target.value == 0);
            }}>
              {[[1, "否"], [0,"是"]].map(([val, label]) => {
                return <Radio value={val}>{label}</Radio>;
              })}
            </Radio.Group>
          </Form.Item>       

          {/* // 非周期 */}
          {isCycle != true &&
            <div>
              <Form.Item label="请假开始时间" name="startTime" rules={[{ required: true, message: "请选择请假开始时间"}]}>
                <DatePicker picker='date' style={{width: 350}} onChange={startDateChange} format={isExercise ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'} showTime={!isExercise}/>
              </Form.Item>

              <Form.Item label="请假结束时间" name="endTime" rules={[{ required: true, message: "请选择请假结束时间"}]}>
                <DatePicker picker='date' style={{width: 350}} onChange={endDateChange} format={isExercise ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'} showTime={!isExercise}/>
              </Form.Item>
            </div>
          }
          {/* // 非课间操 、 非周期 */}
          {isExercise != true && isCycle != true &&
            <Form.Item label="请假时长" name="leaveHours" rules={[{ required: true, message: "请自动计算请假时长"}]}>
              <Input placeholder="请自动计算请假时长" style={{ width: 350 }} disabled value={leaveHours && leaveHours > 0 ? `${Math.floor(leaveHours/60)}小时${leaveHours - Math.floor(leaveHours/60) * 60}分钟`: ""}>
              </Input>
              <Tooltip
              placement='right'
              title={'若学生请假时间大于三天，系统提交申请后仍需通知家长到校办理相关手续！'}>
                <QuestionCircleOutlined style={{ color: '#5781F2', marginLeft: 10 }} />
              </Tooltip>
            </Form.Item>
          }

          {/* 非年级组成员， 非课间操 、 非周期，请假时长超过48小时 */}
          { needSign && isExercise != true && isCycle != true && leaveHours && leaveHours/60 > 48 ? 
            <Form.Item label="审批人员" name="teacherId" rules={[{ required: true, message: "请选择审批人员"}]}>
              <Select style={{ width: 350 }}>
                {data.map((e) => {
                    return <Select.Option value={e.teacherId} key={e.teacherId}>{e.name}</Select.Option>;
                  })}
              </Select>
            </Form.Item> : null }

          {/* 是周期 */}
          { isCycle == true && 
            <div>
              <Form.Item label="请假日期范围" name="repeatStart" rules={[{ required: true, message: "请选择请假日期范围"}]}>
                <DatePicker.RangePicker style={{width: 350}}/>
              </Form.Item>
              <Form.Item label="重复日期" name="repeatDate" rules={[{ required: true, message: "请选择重复日期"}]}>
                <Select mode='multiple' allowClear style={{width: 350}} placeholder="请选择（可多选）"> 
                {[[1, "每周一"], [2,"每周二"], [3, "每周三"], [4,"每周四"], [5, "每周五"], [6,"每周六"], [7, "每周日"]].map(([val, label]) => {
                  return <Select.Option value={val} key={val}>{label}</Select.Option>;
                })}
                </Select>
              </Form.Item>
              { isExercise != true && <Form.Item label="请假时间段" name="repeatEnd" rules={[{ required: true, message: "请选择请假时间段"}]}>
                  <RangePicker picker='time' format="HH:mm"/>
                </Form.Item> }
            </div>
          }

          {/* 非课间操 */}
          {isExercise != true && 
          <div>
            <Divider dashed style={{margin: '0 30px', width: 'auto', minWidth: 'auto'}} />
            <Row>
              <p style={{ color: '#303133', fontSize: 16, fontWeight: 'bold', paddingTop: 10, paddingLeft: 200 }}>住校生回校住宿设置</p>
            </Row>

            <Form.Item label='回校住宿类型' name='goBed' rules={[{ required: true, message: "请选择回校住宿类型"}]}>
              {renderRadio('goBed')}
            </Form.Item>
          </div>
          }

          <FormItem {...tailLayout}>
            <Button 
              type="primary"
              onClick={() => submit(false)}
              loading={loading}>
              保存
            </Button>
            <Button style={{ marginLeft: 10 }}
            onClick={()=> history.goBack()}>
              取消
            </Button>
          </FormItem>
          { options.length > 0 && <SelectStudentsModal 
            onRef={(ref) => modal.current = ref}
            onOk={(data) => {
              setStudents(data);
              if (data !== undefined) {
                let names = getMembersName(data).toString();
                form.setFieldsValue({studentNames: names});
              } else {
                form.setFieldsValue({studentNames: ''});
              }
            }}
            studentGroup={options}
           />}

        </Form>
      </div>
    </div>
  )
}
