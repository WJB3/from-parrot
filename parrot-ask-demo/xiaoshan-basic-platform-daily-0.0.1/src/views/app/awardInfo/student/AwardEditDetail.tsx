import React, { useRef, useState, useEffect } from 'react';
import appStyle from 'src/App.style';
import constant from 'src/constant';
import { RouteComponentProps} from 'react-router-dom';
import { Form, Input, Button, DatePicker, Select, message, Row, Col, Spin, Divider} from "antd";
import { useForm } from "antd/lib/form/Form";
import FormItem from 'antd/lib/form/FormItem';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';
import api from 'src/api';
import GuideTeacherModal from 'src/views/app/reportInfo/studentReport/component/GuideTeachers'
import AwardStudentsModal from 'src/views/app/reportInfo/studentReport/component/AwardStudentsModal'
import { useMap, useRequest } from "ahooks";
import UploadFiles from 'src/components/UploadFiles';
import { PlusOutlined } from '@ant-design/icons';
import CustomAwardLevelModal from 'src/views/app/reportInfo/studentReport/component/CustomAwardLevel'
import IconFont from 'src/components/IconFont';
import useMoment from 'src/hook/useMoment';
import VerifyAwardModal from './component/VerifyAwardModal'
import SelectMemberModal from 'src/components/selectMember';
import SelectStudentsModal from '../../students/leave/component/SelectStudents';
import ApprovalProcess from "src/views/app/reportInfo/teacherReport/component/ApprovalProcess";
import { useHistory } from "react-router-dom";
import PicturesShow from 'src/views/app/reportInfo/teacherReport/component/PicturesShow'
import { useGlobalState, ActionType } from "src/store";

// 填报编辑详情页面
export default function AwardEditDetail(props: GT.Modal.Props & {recordId: number, onlyShow?: string} ) {
  const [form] = useForm();
  const { renderText, renderSelect } = useDictionary();
  const [students, setStudents] = useState<GT.Model.Student[]>();
  const [chooseStudent, setChooseStudent] = useState<GT.Model.Student[]>();
  // 是否有修改
  const [changed, setChanged] = useState(false);
  const modal = useRef<GT.Modal.Ref>();
  const levelModal = useRef<GT.Modal.Ref>();
  const verifyModal = useRef<GT.Modal.Ref>();
  const studentModal = useRef<GT.Modal.Ref>();
  const singleStuModal = useRef<GT.Modal.Ref>();
  // 教师单独modal
  const singleTeacherModal = useRef<GT.Modal.Ref>();

  const [teachers, setTeachers] = useState<GT.Model.Teacher[]>();

  const [awardLevels, setAwardLevels] = useState<GT.Model.AwardLevelModel[]>();
  const [map, { set, get, setAll, reset }] = useMap(new Map());
  const {moment} = useMoment();
  const [details, setDetails] = useState<GT.Model.ReporAwardDetailModel>();
  // 是否已经审批完成
  const [showButton, setShowButton] = useState(false);
  // 是否是个人奖
  const [isPersonal, setIsPersonal] = useState(true);
  const history = useHistory();
  // loading效果
  const [loadingFlag, setLoadingFlag] = useState<boolean>(true);
  // 按钮的loading效果
  const [loading, setLoading] = useState(false);
  const pictureModal = useRef<GT.Modal.Ref>();
  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: "汇总记录" }, { zhName: "提交详情" }],
    });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const approvalLayout = {
    wrapperCol: { offset: 0, span: 24},
  };

  const renderTitleText = (model?: GT.Model.ReporAwardDetailModel) => {
    let text = '';
    let color = '';
    switch (model?.status) {
      case 0:
        text = '填报任务未开始';
        color = '#84878C';
        break;
      case 1:
        text = '填报任务进行中';
        color = '#5781F2';
        break;
      case 2:
        text = '填报任务已结束';
        color = '#84878C';
        break;
      default:
        break;
    }
    return (
      <p style={{ fontSize: 13, color: color, paddingTop: 30 }}>
        {text}
      </p>
    );
  };

  const renderStateText = (model?: GT.Model.ReporAwardDetailModel) => {
    let text = '';
    let color = '';
    let backgroundColor= '';
    switch (model?.state) {
      case -2:
        text = '未提交';
        color = '#FE4F54';
        backgroundColor = '#FE4F5426';
        break;
      case -1:
        text = '待审批';
        color = '#FF8948';
        backgroundColor = '#FF894826';
        break;
      case 0:
        text = '审批中';
        color = '#9065F6';
        backgroundColor = '#9065F626';
        break;
      case 1:
        text = '已通过';
        color = '#3CC251';
        backgroundColor = '#3CC25126';
        break;
      case 2:
        text = '已驳回';
        color = '#FE4F54';
        backgroundColor = '#FE4F5426';
        break;
      default:
        break;
    }
    return (
      <p style={{ color: color, 
      fontSize: 13, 
      marginTop: 28,
      width: 70, 
      height: 28, 
      backgroundColor: backgroundColor,
      textAlign: "center",
      verticalAlign: "middle",
      paddingTop: 3,
      borderRadius: 3}}> 
        {text}
      </p>
    );
  };

  const renderSuffix = (isStudent: boolean) => {
    let lists = isStudent ? chooseStudent  : teachers;
    return (
      <div style={{color: '#5781F2'}}
      onClick={isStudent ? onClickSelectStudents : onClickSelectTeachers}>    
        {(lists&&lists.length > 1) ? "共" + lists.length + "人" : null}
      </div>
    )
  }

  const renderTeacherSuffix = () => {
    let lists = teachers;
    if (lists && lists?.length > 1) {
      return (
        <div style={{ color: "#5781F2" }} onClick={onClickSelectTeachers}>
          {"共" + lists.length + "人"}
        </div>
      );
    } else if (lists && lists?.length === 1) {
      return (
        <div>
          <IconFont
            type="iconcaiji-delete-gray"
            onClick={() => {
              setTeachers([]);
              console.log(form)
              form.setFieldsValue({ teachers: "" });
            }}
          ></IconFont>
        </div>
      );
    } else {
      return null;
    }
  };

  const renderStep = (detail?: GT.Model.ReporAwardDetailModel) => {
    return (
      <Row justify="center">
        <Col flex={1}>
          <span>审批流程</span>
        </Col>
        <Col flex={4} style={{marginTop: '-20px'}}>
          <div style={{width: '500px'}}>
            <ApprovalProcess
              contentWidth={440}
              state={detail?.state}
              sponsorName={detail?.applyTeacher}
              sponsorTime={detail?.applyTime}
              nodes={detail?.nodes}
              copies={detail?.carbonCopies}
            ></ApprovalProcess>
           </div>
        </Col>
      </Row>
    )        
  };

  const normFile = (e: any) => {
    return e;
  };

  // 通过回调获取教师名称
  const getTeacherNames = (data: GT.Model.Teacher[]) => {
    setTeachers(data);
    let lists: string[] = [];
    if (data.length === 1) {
      //
      data.forEach (element => lists.push(element.name + '(' + element.phone + ')' ));
    } else {
      data.forEach (element => lists.push(element.name));
    }
    return lists;
  };

  // 通过回调获取学生的姓名
  const getStudentNames = (data: GT.Model.Student[]) => {
    setChooseStudent(data);
    let lists: string[] = [];
    if (data.length === 1) {
      data.forEach (element => lists.push(element.name + '(' + element.className + ',' + element.sectionName + ')' ));
    } else {
      data.forEach (element => lists.push(element.name));
    }
    return lists;
  };

  // 学生空白回调
  const chooseEmptyStudent = (data: Map<string, any>) => {
    let addStudents: GT.Model.Student[] = [...data.values()].reduce((arr, item) => {
      arr = arr.concat(item.nodes);
      return arr;
    }, []);
    
    // 过滤相同的学生
    let currentLists = chooseStudent ?  chooseStudent: [];

    for (let index = 0; index < currentLists.length; index++) {
      const element = currentLists[index];
      // 新增的学生中过滤掉相同的数据
       addStudents = addStudents.filter(item => (item.id !== element.id));
    }
    console.log(addStudents);
    currentLists = currentLists.concat(addStudents);
    let studentsName = getStudentNames(currentLists).toString();
    form.setFieldsValue({students: studentsName});
  };

  // 获取教师 modal回调
  const chooseEmptyTeachers = (data: Map<string, any>) => {
    let addTeachers: GT.Model.Teacher[] = [...data.values()].reduce((arr, item) => {
      arr = arr.concat(item.nodes);
      return arr;
    }, []);

    // addteachers中需要去重
    let filterMap = new Map<number, any>([])
    addTeachers.forEach((item) => {filterMap.set(item.id, item)})
    addTeachers = [...filterMap.values()].reduce((arr, item) => {
      arr = arr.concat(item);
      return arr
    }, []);
    
    // 过滤相同的教师
    let currentLists = teachers ?  teachers: [];
    for (let index = 0; index < currentLists.length; index++) {
      const element = currentLists[index];
      // 新增的老师中过滤掉相同的数据 兼容Id
      const elementId = element.memberId ? element.memberId : element.id;
      addTeachers = addTeachers.filter(item => ((item.memberId ? item.memberId : item.id) !== elementId));
    }
    currentLists = currentLists.concat(addTeachers);
    let teachersName = getTeacherNames(currentLists).toString();
    form.setFieldsValue({teachers: teachersName});
  };

  // 选择多学生判断
  const onClickSelectStudents = () => {
    // 
    if (chooseStudent&&chooseStudent.length > 1) {
      studentModal.current?.setTitle('获奖学生详情');
      studentModal.current?.setVisible(true);
      studentModal.current?.setCanOperate(showButton);
      studentModal.current?.setStudents(chooseStudent);
    } else {
      // 少于一个人 直接展示
      if (showButton) {
        // 可以操作
        singleStuModal.current?.setVisible(true);
        singleStuModal.current?.setMembers(new Map());
      }
    }
  }

  // 选择多老师判断
  const onClickSelectTeachers = () => {
    // 
    if (teachers&&teachers.length > 1) {
      modal.current?.setTitle('指导教练详情');
      modal.current?.setVisible(true);
      modal.current?.setCanOperate(showButton);
    } else {
      // 少于一个教练 直接展示
      if (showButton) {
        singleTeacherModal.current?.setVisible(true);
        singleTeacherModal.current?.setMembers(new Map());
      }
    }
  }

  // 获取详情数据
  useEffect(() => {
    if (props.recordId) {
      api.award.getRecordDetail(props.recordId).then((result) => {
        setDetails(result);
        setLoadingFlag(false);
        (result.state === 1 || result.state === 2) ? setShowButton(false) : setShowButton(true);
        // 是否只展示
        // console.log('🍉');
        if (props.onlyShow === '1') {
          setShowButton(false);
        }
        // 如果不是当前审批人 不展示
        if (!result.active) {
          setShowButton(false);
        }
        
        (result.type === 1) ? setIsPersonal(true) : setIsPersonal(false);
  
        setTeachers(result.teachers);
        setChooseStudent(result.students);
        modal.current?.setTeachers(result.teachers);
        studentModal.current?.setStudents(result.students);
        const image =  result?.awardFileUrl
                      ? ([
                          {
                            uid: result.awardFileId,
                            url: result.awardFileUrl,
                          },
                        ] as any)
                      : []
        form.setFieldsValue({contestName: result.contestName,
                             contestType: result.contestType,
                             contestLevel: result.contestLevel,
                             awardLevelName: result.awardLevelName,
                             department: result.department,
                             detailDate: moment(result.detailDate),
                             teachers: getTeacherNames(result.teachers).toString(),
                             type: result.type,
                             students: getStudentNames(result.students).toString(),
                             awardFileId: image,
                             awardContent: result.awardContent});
      });
    } else {
      setLoadingFlag(false);
    }
  }, [])

  //获取照片url
  function getPhotoUrls(value?: any): string[] {
    let urls = value?.reduce((arr: any[], item: any) => {
      if (item.url) {
        arr.push(item.url);
      } else {
        arr.push(item.response.url);
      }
      return arr;
    }, []);
    return urls;
  }

  const getAwardLevels = (open: boolean) => {
    if (open) {
      api.award.getByRecordId({ recordId: details?.id }).then((res) => {
        let customLevels = res
        customLevels.push({id: 999, name: '自定义填写'})
        setAwardLevels(customLevels);
      });
    }
  };

  const submit = (data: any) => {
    // 审核提交
    let result = data.result;
    let content = data.content;

    // 是否有修改过数据 提交表单数据 先修改再审核
    form.validateFields().then(() => {
      // warn 修改数据 1:  通过 2: 驳回
      let params: any;
      // console.log(form.getFieldValue('awardFileId'));
      if (changed) {
        // 有修改数据
        const dateFormat = form.getFieldValue("detailDate").format("YYYY-MM-DD").toString();
        const imageId = form.getFieldValue('awardFileId')[0].response ? form.getFieldValue('awardFileId')[0].response.id : form.getFieldValue('awardFileId')[0].uid;
        // 同意 是否有修改数据
        const params1 = {
          awardFileId: imageId,
          awardLevelName: form.getFieldValue("awardLevelName"),
          contestLevel: form.getFieldValue("contestLevel"),
          contestName: form.getFieldValue("contestName"),
          contestType: form.getFieldValue("contestType"),
          department: form.getFieldValue("department"),
          detailDate: dateFormat,
          id: details?.taskId,
          recordId: details?.id,
          students: getStudentIds(),
          teachers: getTeacherIds(),
          type: form.getFieldValue("type"),
          resultState: result,
          content: content,
          changed: 1,
        };
        params = params1;
      } else {
        // 没有修改数据
        const params2 = {
          recordId: details?.id,
          resultState: result,
          content: content,
          changed: 0,
        };
        params = params2;
      }
      setLoading(true);
      api.award.verifyAwardRecord(params)
         .then(() => {
           message.success('审核成功');
           setLoading(false);
          //  // 审核完成跳转
          //  history.goBack();
          // 回调给上一层
          props.onOk && props.onOk();
         })
         .catch(() => {
          //  message.error('修改错误');
           setLoading(false);
         });
    });
  }

  // 审核填报
  const verifyInfo = () => {
    // 弹窗
    verifyModal.current?.setVisible(true);
  }

  // 自定义level等级
  const onChangeLevel = (val: any, text: any) => {
    if (text.children === '自定义填写' ) {
      levelModal.current?.setVisible(true);
    }
  }

  const matchStudentId = (value: number) => {
    // 匹配选中的学生数据
    const matchStudent = students?.find(element => element.id === value);
    if (matchStudent !== undefined) {
      // console.log('match');
      setChooseStudent([matchStudent]);
    }
  }

  // 修改了获奖类型 重置
  const changeAwardType = (value: number) => {
     // 是否是个人
     let currentType = value === 1;
    // 状态改变了
    if (currentType !== isPersonal) {
       setIsPersonal(currentType);
       setChooseStudent([]);
       form.resetFields(['students']);
     }
  }

  const onValuesChange = (val: any, all: any) => {
    // console.log('changed');
    setChanged(true);
  };

  const getTeacherIds = () => {
    // 返回一个string类的数组
    let lists: string[] = []
    if (teachers !== undefined) {
      teachers.forEach( element => {
        // lists.push(element.id.toString());
        lists.push((element.memberId ? element.memberId : element.id).toString());
      });
    }
    return lists.toString();
  };

  const getStudentIds = () => {
    // 返回一个string类的数组
    let lists: string[] = []
    if (chooseStudent !== undefined) {
      chooseStudent.forEach( element => {
        lists.push(element.id.toString());
      });
    }
    return lists.toString();
  };

  // const onSearch = (value: string) => {
  //   api.award
  //     .getAllStudentsPage({
  //       name: value,
  //       current: -1,
  //       size: -1,
  //       scope: 1,
  //       full: true,
  //     })
  //     .then((res) => {
  //       setStudents(res.list);
  //     });
  // };

  const onSearch = (value: string) => {
    let params = (value&&value.length > 0) ? {name: value, current: -1, size: -1, scope: 1, full: true, yearScope: 4} : {current: -1, size: -1, scope: 1, full: true, yearScope: 4} 
    api.award
      .getAllStudentsPage(params)
      .then((res) => {
        setStudents(res.list);
      });
  };

  // 奖项对应的学生数量校验
  const validate = (rule: any, val: string) => {
    console.log(isPersonal);
    // 最小的学生数量是多少
    const minStundentNumber = isPersonal ? 1 : 2;
    // 当前学生数量
    if (val !== undefined) {
      const currentStudentsNumber = val.includes(',')&&!val.includes('(') ? 2 : 1;
      console.log(minStundentNumber, val);
      if (currentStudentsNumber < minStundentNumber) {
          return Promise.reject('多人/团体奖需选择1个以上学生');
      }
    }
    return Promise.resolve();
  };

  // 任务列表Id
  return loadingFlag ? (
    <Row justify="center">
      <Spin
        style={{ marginTop: "30vh" }}
        spinning={loadingFlag}
        size="large"
      ></Spin>
    </Row>
  ) : (
    <div>
    <div style={{color:"#303133",fontSize:16,opacity:1}}>提交详情</div>
    <div style={{marginTop:10,marginBottom:20,background:"#DFE1E6",height:"1px"}}></div>
    <div className="form_list">
      <div className="form_editList_content">
        {/* Row */}
        <Row>
          <Col span={24}>
            <div style={{ height: "76px", background: "#F2F4FB", paddingTop: '14px' }}>
              <pre style={{
                  paddingLeft: 16,
                  color: "#303133",
                  fontSize: "16px",
                  fontFamily:'-apple-system',
                  fontWeight: "bold",
                  lineHeight: "22px",
                  marginBottom: '8px'}}>
                {details?.title}-{details?.applyTeacher}的提交详情
              </pre>
              <pre style={{
                  paddingLeft: 16,
                  color: "#84878C",
                  fontFamily:'-apple-system',
                  fontSize: "13px"}}>
                {`提交人：${details?.applyTeacher}    提交时间：${details?.applyTime}   提交编号：${details?.serialNumber}`}
              </pre>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={0.5}>
            <IconFont
              type="iconcaiji-bianji"
              style={{ fontSize: 24, paddingTop: 30, paddingLeft: 30 }}
            ></IconFont>
          </Col>
          <Col span={4}>
            <p style={{ color: '#303133', fontSize: 16, fontWeight: 'bold', paddingTop: 30, paddingLeft: 10 }}>{details?.title ? details.title : '学生竞赛获奖登记'}</p>
          </Col>
          <Col span={3} offset={13}>
            {renderTitleText(details)}
          </Col>
          <Col span={2}>
            {renderStateText(details)}
          </Col>
        </Row>
        <Form
        name="report"
        {...layout}
        layout="horizontal"
        colon={false}
        onValuesChange={onValuesChange}
        // initialValues={{contestName: formData?.contestName}}
        form={form}>
          <Form.Item label="竞赛名称" name="contestName" rules={[{ required: true }]}>
            <Input
              maxLength={50}
              // readOnly={true}
              disabled={!showButton}
              placeholder="请输入"
              style={{ width: 350 }}
              >
            </Input>
          </Form.Item>
          <Form.Item label="竞赛类型" name="contestType" rules={[{ required: true }]}>
            {renderSelect('contestType', { style: { width: 350 }, disabled: !showButton})}
          </Form.Item>
          <Form.Item label="竞赛级别" name="contestLevel" rules={[{ required: true }]}>
            {renderSelect('stuContestLevel', { style: { width: 350 }, disabled: !showButton })} 
          </Form.Item>
          <Form.Item label="获奖等级" name="awardLevelName" rules={[{ required: true }]}>
            {/* 获奖等级下拉选择 */}
            <Select
              disabled={!showButton}
              placeholder="请输入"
              style={{ width: 350 }}
              onDropdownVisibleChange={getAwardLevels}
              onChange={(val, text) => onChangeLevel(val, text)}>
                {awardLevels?.map((level) => (
                  <Select.Option value={level.name}>{level.name}</Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="颁奖部门" name="department" rules={[{ required: true }]}>
            <Input
              maxLength={50}
              allowClear={true}
              placeholder="请输入"
              style={{ width: 350 }}
              disabled={!showButton}
            ></Input>
          </Form.Item>
          <Form.Item label="获奖日期" name="detailDate" rules={[{ required: true }]}>
            <DatePicker 
              picker='date'
              style={{width: 350}}
              disabled={!showButton}
              />
          </Form.Item>
          <Form.Item label="指导教练" 
            name="teachers" 
            rules={[{ required: true }]}
            extra={<div style={{color: '#FE4F54', fontSize: '13px', marginTop: '5px'}}>注：指导教练如有多人，请安排一人提交，并添加多个指导教练</div>}>
            <Input
                placeholder="请选择"
                readOnly={true}
                onClick={onClickSelectTeachers}
                allowClear={true}
                style={{ width: 350}}
                suffix={renderTeacherSuffix()}>
                {/* // suffix={(teachers&&teachers.length > 1) ? "共" + teachers.length + "人" : null}> */}
            </Input>
          </Form.Item>
          <Form.Item label="获奖类型" 
            name="type" 
            rules={[{ required: true }]}
            >
            {renderSelect('awardType', { style: { width: 350 }, disabled: !showButton, onSelect: (val, option) => changeAwardType(val) })} 
          </Form.Item>
          <Form.Item label='获奖学生' name='students' rules={[{ required: true }, {validator: validate}]}>
            {isPersonal ? (
              <Select
              showSearch
              showArrow
              // mode="multiple"
              onSearch={onSearch}
              allowClear
              onDropdownVisibleChange={(open) => open && onSearch('')}
              placeholder='请输入'
              filterOption={false}
              disabled={!showButton}
              onChange={(value, option) => matchStudentId(Number(value))}
              style={{width: 350, display: "block"}}>
              {students?.map((t) => (
                <Select.Option value={t.id.toString()}>
                  <div>
                    <div>
                      <span style={{ fontSize: 13 }}>{t.name}</span>
                      <span style={{ fontSize: 12, color: '#909499' }}>({t.className + ',' + t.sectionName})</span>
                    </div>
                    {/* <div>
                      <span style={{ fontSize: 12, color: '#616266' }}>{t.className}</span>
                      <span style={{ fontSize: 12, color: '#616266' }}>({t.sectionName})</span>
                    </div> */}
                  </div>
                </Select.Option>
              ))}
            </Select>
            ) : (
              <Input
              placeholder="请选择"
              readOnly={true}
              onClick={onClickSelectStudents}
              allowClear={true}
              style={{ width: 350}}
              suffix={renderSuffix(true)}>
              </Input>
            )}
          </Form.Item>
          <Form.Item 
            label="获奖证书" 
            name="awardFileId" 
            rules={[{ required: true }]}
            getValueFromEvent={normFile}
            valuePropName='fileList'>
            <UploadFiles
              limit={1}
              disabled={!showButton}
              max={5 * 1024}
              className="upload_Image_feedback"
              upload={{ 
                accept: 'image/jpeg,image/jpg,image/png',
                onPreview: (file) => {
                  const pictures = form.getFieldValue(
                    "awardFileId"
                  );
                  const urls = getPhotoUrls(pictures);
                  pictureModal.current?.setPictures(urls);
                  pictureModal.current?.setPosition(
                    pictures?.findIndex(
                      (ele: any) => ele === file
                    )
                  );
                  pictureModal.current?.setVisible(true);
                }, }}>
              <div className="upload_Image">
                <PlusOutlined />
              </div>
            </UploadFiles>
          </Form.Item>
          <FormItem {...tailLayout}>
            <div style={{marginTop: '-5px', marginBottom: '-10px'}}>
              <pre style={{color: '#616266', fontSize: '13px'}}>{'上传须知:\n获奖证书照片大小不超过5M，支持png、jpg或jpeg格式。\n多人参与同一项目获奖上传1张证书照片'}</pre>
            </div>          
          </FormItem>
          {(details?.awardContent&&details.awardContent.length > 0&&details.state===1) ? (
            <Form.Item label="获奖奖励" name="awardContent" rules={[{ required: true }]}>
              <Input
              disabled={true}
              placeholder="请输入"
              style={{ width: 350}}
              >
              </Input>
            </Form.Item>
          ) : null}
          <Form.Item {...approvalLayout}>
            <div style={{paddingLeft: '265px'}}>
              {details?.state !== -2 && details?.state !== undefined
                ? renderStep(details)
                : null}
            </div>
          </Form.Item>
          {/* {showButton ? (
            <FormItem {...tailLayout}>
            <Button 
              type="primary"
              onClick={verifyInfo}>
              审批
            </Button>
            <Button
              style={{ marginLeft: 10 }}>
              取消
            </Button>
          </FormItem>
          ) : null} */}
          <GuideTeacherModal
            taskId={details?.taskId}
            teacherLists={details?.teachers}
            onRef={(ref) => (modal.current = ref)}
            onOk={(data) => {
              if (data !== undefined) {
                let names = getTeacherNames(data).toString();
                form.setFieldsValue({teachers: names});
              } else {
                form.setFieldsValue({teachers: ''});
              }
            }}
            />
          <CustomAwardLevelModal
            onRef={(ref) => (levelModal.current = ref)}
            onOk={(object) => {
              if (object.name !== undefined) {
                // 自定义填写了等级
                form.setFieldsValue({awardLevelName: object.name});
              } else {
                form.resetFields(['awardLevelName']);
              }
            }}
          />
          <VerifyAwardModal
            onRef={(ref) => (verifyModal.current = ref)}
            onOk={(data) => {submit(data)}}
          />
          <AwardStudentsModal
            studentLists={chooseStudent}
            onRef={(ref) => (studentModal.current = ref)}
            onOk={(data) => {
              // 学生的数据
              if (data !== undefined) {
                let names = getStudentNames(data).toString();
                form.setFieldsValue({students: names});
              } else {
                form.setFieldsValue({students: ''});
              }
            }}
          />
          <SelectMemberModal
            tabs={['student']}
            studentQuery={{fullStudent: true, all: false, yearScope: 4}}
            onRef={(ref) => (singleStuModal.current = ref)}
            onOk={chooseEmptyStudent}></SelectMemberModal>
          <SelectMemberModal
            tabs={['organization', 'group' ]}
            customQuery={{propertyType: 0}}
            onRef={(ref) => (singleTeacherModal.current = ref)}
            onOk={chooseEmptyTeachers}></SelectMemberModal>
          <PicturesShow
            onRef={(ref) => {
              pictureModal.current = ref;
            }}
          ></PicturesShow>
          </Form>
      </div>
      {showButton? (
        <div style={{display: "block", width: '1000px', height: '74px', backgroundColor: 'white'}}>
        </div>
      ) : null}
        {showButton ? (
          <div style={{position: 'fixed', bottom: '0px', width: '1000px', height: '74px', backgroundColor: 'white', zIndex: 1000}}>
            <div style={{display: "flex", width: '100%', justifyContent: 'center', alignItems: "center", paddingTop: 10}}>
              <Button 
                type="primary"
                onClick={verifyInfo}
                loading={loading}>
                审批
              </Button>
              <Button
                style={{ marginLeft: 10 }}
                onClick={()=>props.onOk && props.onOk(2)}>
                取消
              </Button>
            </div>
          </div>
            ) : null}
    </div>
    </div>
  )
}
