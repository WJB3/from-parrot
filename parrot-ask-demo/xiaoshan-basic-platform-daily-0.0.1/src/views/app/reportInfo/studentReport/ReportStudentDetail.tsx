import React, { useRef, useState, useEffect } from 'react';
import appStyle from 'src/App.style';
import constant from 'src/constant';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Select, message, Row, Col, Modal, Empty, Spin, Space } from "antd";
import { useForm } from "antd/lib/form/Form";
import FormItem from 'antd/lib/form/FormItem';
import GT from 'types';
import useDictionary from 'src/hook/useDictionary';
import PicturesShow from 'src/views/app/reportInfo/teacherReport/component/PicturesShow'
import api from 'src/api';
import GuideTeacherModal from './component/GuideTeachers'
import AwardStudentsModal from './component/AwardStudentsModal'
import { useMap, useRequest } from "ahooks";
import UploadFiles from 'src/components/UploadFiles';
import { PlusOutlined } from '@ant-design/icons';
import CustomAwardLevelModal from './component/CustomAwardLevel'
import IconFont from 'src/components/IconFont';
import useMoment from 'src/hook/useMoment';
import SelectMemberModal from 'src/components/selectMember';
import useUrlState from '@ahooksjs/use-url-state';
import ApprovalProcess from "src/views/app/reportInfo/teacherReport/component/ApprovalProcess";
import { useHistory } from "react-router-dom";
import qs from 'qs'
// import { Prompt } from "react-router";
import { useGlobalState, ActionType } from "src/store";

// 学生竞赛获奖等级  新增+编辑
export default function ReportStudentDetail(props: {taskId?: number, taskName?: string, recordId?: number, updateModal?: boolean}) {
  const [form] = useForm();
  const { renderText, renderSelect } = useDictionary();
  // 所有的学生
  const [students, setStudents] = useState<GT.Model.Student[]>();
  // 选中的学生
  const [selectedStudents, setSelectedStudents] = useState<GT.Model.Student[]>();
  const [details, setDetails] = useState<GT.Model.ReporAwardDetailModel>();
  const modal = useRef<GT.Modal.Ref>();
  const levelModal = useRef<GT.Modal.Ref>();
  const studentModal = useRef<GT.Modal.Ref>();
  // 学生单独的modal
  const singleStuModal = useRef<GT.Modal.Ref>();
  // 教师单独modal
  const singleTeacherModal = useRef<GT.Modal.Ref>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [changed, setChanged] = useState(false);
  const [teachers, setTeachers] = useState<GT.Model.Teacher[]>();
  const {moment} = useMoment();
  const [awardLevels, setAwardLevels] = useState<GT.Model.AwardLevelModel[]>();
  // 是否是个人奖
  const [isPersonal, setIsPersonal] = useState(true);
  // 是否可以修改
  const [canEdit, setCanEdit] = useState(true);
  // 是否是新增
  const [isAdd, setIsAdd] = useState(true);
  // 是否已经结束
  const [isFinished, setIsFinished] = useState(false);
  const [pageState, setPageState] = useUrlState({ pageTab: 1});
  const history = useHistory();
  // loading效果
  const [loadingFlag, setLoadingFlag] = useState<boolean>(true);
  // 按钮的loading效果
  const [loading, setLoading] = useState(false);
  // 操作离开时是否要弹窗
  const hideModalRef = useRef<boolean>();
  // 是否需要使用弹窗 false 需要弹窗
  const isNeedHiddenShow = useRef<boolean>();
  const pictureModal = useRef<GT.Modal.Ref>();

  const currentLocation = useRef<any>();
  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({
      type: ActionType.SetBreadcrumb,
      payload: [{ zhName: props.taskName }],
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
    wrapperCol: { offset: 0, span: 24 },
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
    let lists = isStudent ? selectedStudents  : teachers;
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
          <div>审批流程</div>
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

  // 查看填报详情
  useEffect(() => {
    if (props.recordId) {
      api.award.getRecordDetail(props.recordId).then((value) => {
        setLoadingFlag(false);
        setDetails(value);
        // 审核通过或者任务结束后只能查看 
        (value.state === 1 || (value.status === 2&& value.state !== 2) || value.status === 0) ? setCanEdit(false) : setCanEdit(true);
        // 设置是否为个人奖项
        (value.type === 1) ? setIsPersonal(true) : setIsPersonal(false);
        // 是否是未提交
        (value.state === -2) ? setIsAdd(true) : setIsAdd(false);
        // 是否需要使用弹窗的逻辑 获取详情 不需要
        (value.state === 1 || (value.status === 2&& value.state !== 2) || value.status === 0) ? isNeedHiddenShow.current=true : isNeedHiddenShow.current=false;
        // 驳回情况 都能够编辑
        // if (value.state === 2) {
        //   setCanEdit(true)
        //   isNeedHiddenShow.current=false 
        // }
        console.log('获取详情设置弹窗是否需要展示');

        setTeachers(value.teachers);
        setSelectedStudents(value.students);
        modal.current?.setTeachers(value.teachers);
        studentModal.current?.setStudents(value.students);
  
        const image =  value?.awardFileUrl
                      ? ([
                          {
                            uid: value.awardFileId,
                            url: value.awardFileUrl,
                          },
                        ] as any)
                      : []
        form.setFieldsValue({contestName: value.contestName,
                              contestType: value.contestType,
                              contestLevel: value.contestLevel,
                              awardLevelName: value.awardLevelName,
                              department: value.department,
                              detailDate: moment(value.detailDate),
                              teachers: getTeacherNames(value.teachers).toString(),
                              type: value.type,
                              students: getStudentNames(value.students).toString(),
                              awardFileId: image,
                              awardContent: value.awardContent});
      })
    } else {
      // 没有对应的详情页面 
      setLoadingFlag(false);
      const currentIndex = qs.parse(history.location.search.substr(1)).pageTab;
      if (currentIndex&&currentIndex==='1') {
        // 当前若是在列表也无需展示弹窗
        console.log('是否展示弹窗: 否');
        isNeedHiddenShow.current = true;
      } else if (currentIndex&&currentIndex==='0') {
        console.log('是否展示弹窗: 是');
        // setIsNeedShow(true);
        isNeedHiddenShow.current = false;
      }
    }
  }, [props.updateModal]);

  useEffect(() => {
    // 确认那些页面需要弹提示   新增/修改  需要是false 不需要为true
    // let flag = !isNeedShow;
    console.log('useeffect加载', isNeedHiddenShow);

    return history.block((location: any, action) => {
      console.log('跳转逻辑',action);
      console.log('路由更新 是否需要弹窗', !isNeedHiddenShow.current);
      if (hideModalRef&&hideModalRef.current) {
        //console.log('不需要数据弹窗');
        return ;
      }
      console.log(location);
      console.log(history);
      // 一开始进入的时候判断
      if (location.pathname === history.location.pathname&&(qs.parse(history.location.search.substr(1)).pageTab===qs.parse(location.search.substr(1)).pageTab)) {
        //console.log('不需要数据弹窗');
        return ;
      }
      if (!isNeedHiddenShow.current) {
        Modal.confirm({
          title: '提示',
          content: '离开当前页面不会保存修改内容，确定离开吗？',
          okText: '确认离开',
          cancelText: '留在此页',
          onOk() {
            console.log('设置依赖为true', 'push返回页面');
            // flag = true;
            isNeedHiddenShow.current = true;
            // 页面跳转逻辑
            // history.push(location);
            if (action === 'PUSH') {
              history.push(location);
            } else if (action === 'POP') {
              // 大部分都为返回
              if (!currentLocation.current) {
                console.log('复制url');
                currentLocation.current = location;
              }
              // history.goBack();
              history.replace(currentLocation.current);

            } else if (action === 'REPLACE') {
              history.replace(location);
            }
          },
          onCancel() {
            if (action === 'POP') {
              if (!currentLocation.current) {
                console.log('复制url');
                currentLocation.current = location;
              }
            }
          }
        });
        return false;
      }

      // return isNeedHiddenShow.current&&undefined;
    });
  }, []);

  // 监听系统级别 刷新/关闭
  // useEffect(() => {
  //     const listener = (ev: any) => {
  //       if (isNeedShow) {
  //         ev.preventDefault();
  //         ev.returnValue = '确定要离开吗';
  //       }
  //     };
  //   window.addEventListener('beforeunload', listener);
  //   return () => {
  //     window.removeEventListener('beforeunload', listener);
  //   }
  // }, [isNeedShow]);

  // useEffect(() => {
  //     const listener = (ev: any) => {
  //       currentPath.current = window.location.hash;
  //       console.log('路由变化了', currentPath.current);
  //       // setIsChangeUrl(true);
  //     };
  //   window.addEventListener('hashchange', listener);
  //   return () => {
  //     window.removeEventListener('hashchange', listener);
  //   }
  // }, []);

  //获取照片url
  function getPhotoUrls(value?: any): string[] {
    console.log(value);
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

  const normFile = (e: any) => {
    return e;
  };

  const handleModalOk = () => {
    // 重新上报
    updateFormData();
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const onValuesChange = (val: any, all: any) => {
    setChanged(true);
  };

  const getAwardLevels = (open: boolean) => {
    if (open) {
      api.award.getByRecordId({ recordId: props.recordId }).then((res) => {
        let customLevels = res
        customLevels.push({id: 999, name: '自定义填写'})
        setAwardLevels(customLevels);
      });
    }
  };

  // 获取任务是否已经结束
  const {data: result} = useRequest(() => props.taskId&&api.award.getTaskDetail(props.taskId), {
    refreshDeps: [props.taskId],
    onSuccess(model) {
      if (model.status === 2) {
        // 任务已结束
        console.log('任务已结束');
        setIsFinished(true);
      }
    }
  });

  // 通过回调获取教师名称
  const getTeacherNames = (data: GT.Model.Teacher[]) => {
    setTeachers(data);
    // console.log(data);
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
    setSelectedStudents(data);
    let lists: string[] = [];
    if (data.length === 1) {
      //
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
    let currentLists = selectedStudents ?  selectedStudents: [];

    for (let index = 0; index < currentLists.length; index++) {
      const element = currentLists[index];
      // 新增的学生中过滤掉相同的数据
        addStudents = addStudents.filter(item => (item.id !== element.id));
    }
    // console.log(addStudents);
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
    const isNeedReplace =  teachers&&teachers.length === 1
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
    if (selectedStudents&&selectedStudents.length > 1) {
      studentModal.current?.setTitle('获奖学生详情');
      studentModal.current?.setVisible(true);
      studentModal.current?.setCanOperate(canEdit);
      studentModal.current?.setStudents(selectedStudents);
    } else {
      // 少于一个人 直接展示
      if (canEdit) {
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
      modal.current?.setCanOperate(canEdit);
      modal.current?.setTeachers(teachers);

    } else {
      // 少于一个教练 直接展示
      if (canEdit) {
        singleTeacherModal.current?.setVisible(true);
        singleTeacherModal.current?.setMembers(new Map());
      }
    }
  }

  const getTeacherIds = () => {
    // 返回一个string类的数组
    let lists: string[] = []
    if (teachers !== undefined) {
      // console.log(teachers);
      teachers.forEach( element => {
        lists.push((element.memberId ? element.memberId : element.id).toString());
      });
    }
    return lists.toString();
  };

  const getStudentIds = () => {
    // 返回一个string类的数组
    let lists: string[] = []
    if (selectedStudents !== undefined) {
      selectedStudents.forEach( element => {
        lists.push(element.id.toString());
      });
    }
    return lists.toString();
  };

  const matchStudentId = (value: number) => {
    // 匹配选中的数据
    const matchStudent = students?.find(element => element.id === value);
    if (matchStudent !== undefined) {
      setSelectedStudents([matchStudent]);
    }
  }

  // 修改了获奖类型 重置
  const changeAwardType = (value: number) => {
    // 是否是个人
    let currentType = value === 1;
    // 状态改变了
    if (currentType !== isPersonal) {
      setIsPersonal(currentType);
      setSelectedStudents([]);
      form.resetFields(['students']);
    }
  }

  const submit = () => {
    if (isAdd) {
      addNewAwardForm();
    } else {
      // 修改还是驳回后的重新来
      if (details?.state === 2) {
        // 被驳回 重新提交的弹窗
        setIsModalVisible(true);
      } else {
        // 修改数据
        updateFormData();
      }
    }
  }

  // 新增填报
  const addNewAwardForm = () => {
    console.log("taskId:" + props.taskId);

    // 提交表单数据
    form.validateFields().then(() => {
      const dateFormat = form.getFieldValue("detailDate").format("YYYY-MM-DD").toString();
      const imageId = form.getFieldValue('awardFileId')[0].response.id;

      setLoading(true);
      const params = {
        awardFileId: imageId,
        awardLevelName: form.getFieldValue("awardLevelName"),
        contestLevel: form.getFieldValue("contestLevel"),
        contestName: form.getFieldValue("contestName"),
        contestType: form.getFieldValue("contestType"),
        department: form.getFieldValue("department"),
        detailDate: dateFormat,
        id: props.taskId,
        recordId: props.recordId,
        students: getStudentIds(),
        teachers: getTeacherIds(),
        type: form.getFieldValue("type"),
      };
      api.award.createReportAward(params)
         .then(() => {
           message.success('提交成功')
           setLoading(false);
           // 清除数据
           form.resetFields();
           setSelectedStudents([]);
           setTeachers([]);
           // 跳转到列表页面
           hideModalRef.current = true;
           setPageState({pageTab:1});
         })
         .catch(() => {
          setLoading(false);
          //  message.error('提交错误');
         });
    });
  }

  // 修改数据
  const updateFormData = () => {
    // 是否有修改过数据 提交表单数据 先修改再审核
    form.validateFields().then(() => {
      if (!changed && details?.state !== 2) {
        // 编辑没有修改过
        message.success('修改成功');
        hideModalRef.current = true;
        history.goBack();
      } else {
        // 有修改数据
        const dateFormat = form.getFieldValue("detailDate").format("YYYY-MM-DD").toString();
        const imageId = form.getFieldValue('awardFileId')[0].response ? form.getFieldValue('awardFileId')[0].response.id : form.getFieldValue('awardFileId')[0].uid;
        // 同意 是否有修改数据
        setLoading(true);
        const params = {
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
        };

        api.award.updateReportAward(params)
        .then(() => {
          message.success('提交修改成功')
          setLoading(false);
          // 更新/驳回更新都返回前一页
          hideModalRef.current = true;
          history.goBack();
        })
        .catch(() => {
          message.error('发生错误');
          setLoading(false);
        });
      }
    });
  }

  // 自定义level等级
  const onChangeLevel = (val: any, text: any) => {
    if (text.children === '自定义填写' ) {
      levelModal.current?.setVisible(true);
    }
  }

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
    // console.log(isPersonal);
    // 最小的学生数量是多少
    const minStundentNumber = isPersonal ? 1 : 2;
    // 当前学生数量
    if (val !== undefined) {
      // 一个人也会有, 
      const currentStudentsNumber = val.includes(',')&&!val.includes('(') ? 2 : 1;
      console.log(minStundentNumber, val);
      if (currentStudentsNumber < minStundentNumber) {
          return Promise.reject('多人/团体奖需选择1个以上学生');
      }
    }
    return Promise.resolve();
  };

  return loadingFlag ? (
    <Row justify="center">
      <Spin
        style={{ marginTop: "30vh" }}
        spinning={loadingFlag}
        size="large"
      ></Spin>
    </Row>
  ) :
 (isFinished && props.taskId) ?  <Empty description="任务已结束, 无法填报"/> : (
     <div className="form_list">
      <div className="form_list_content">
        {/* Row */}
        <Row>
          <Col span={0.5}>
            <IconFont
              type="iconcaiji-bianji"
              style={{ fontSize: 24, paddingTop: 30, paddingLeft: 30 }}
            ></IconFont>
          </Col>
          <Col span={14}>
            <p style={{ color: '#303133', fontSize: 16, fontWeight: 'bold', paddingTop: 30, paddingLeft: 10 }}>{props.taskName ? props.taskName : details?.title ? details.title : '学生竞赛获奖登记'}</p>
          </Col>
          <Col span={3} offset={ isAdd ? 5 : 3}>
            {renderTitleText(details)}
          </Col>
          {isAdd ? null: (
            <Col span={2}>
              {renderStateText(details)}
            </Col>
          )}
        </Row>
        <Form
        name="report"
        {...layout}
        layout="horizontal"
        colon={false}
        onValuesChange={onValuesChange}
        // initialValues={{awardContent:details?.awardContent}}
        form={form}>
          <Form.Item label="竞赛名称" name="contestName" rules={[{ required: true }]}>
            <Input
              maxLength={50}
              // readOnly={true}
              disabled={!canEdit}
              placeholder="请输入"
              style={{ width: 350 }}
              >
            </Input>
          </Form.Item>
          <Form.Item label="竞赛类型" name="contestType" rules={[{ required: true }]}>
            {renderSelect('contestType', { style: { width: 350 }, disabled:!canEdit })}
          </Form.Item>
          <Form.Item label="竞赛级别" name="contestLevel" rules={[{ required: true }]}>
            {renderSelect('stuContestLevel', { style: { width: 350 }, disabled:!canEdit })} 
          </Form.Item>
          <Form.Item label="获奖等级" name="awardLevelName" rules={[{ required: true }]}>
            {/* 获奖等级下拉选择 */}
            <Select
              placeholder="请输入"
              style={{ width: 350 }}
              disabled={!canEdit}
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
              disabled={!canEdit}
            ></Input>
          </Form.Item>
          <Form.Item label="获奖日期" name="detailDate" rules={[{ required: true }]}>
            <DatePicker 
              picker='date'
              style={{width: 350}}
              disabled={!canEdit}/>
          </Form.Item>
          <Form.Item label="指导教练" name="teachers" 
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
          <Form.Item label="获奖类型" name="type" rules={[{ required: true }]}>
            {renderSelect('awardType', { style: { width: 350 }, disabled: !canEdit , onSelect: (val, option) => changeAwardType(val) })} 
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
              disabled={!canEdit}
              onChange={(value, option) => matchStudentId(Number(value))}
              // tagRender={tagRender}
              style={{width: 350, display: "block"}}>
              {students?.map((t) => (
                <Select.Option value={t.id.toString()}>
                  <div>
                    <div>
                      <span style={{ fontSize: 13 }}>{t.name}</span>
                      <span style={{ fontSize: 12, color: '#909499' }}>({t.className + ',' + t.sectionName})</span>
                    </div>
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
              max={5 * 1024}
              className="upload_Image_feedback"
              disabled={!canEdit}
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
          <Form.Item {...tailLayout}>
            <div style={{marginTop: '-5px', marginBottom: '-10px'}}>
              <pre style={{color: '#616266', fontSize: '13px'}}>{'上传须知:\n获奖证书照片大小不超过5M，支持png、jpg或jpeg格式。\n多人参与同一项目获奖上传1张证书照片'}</pre>
            </div>
          </Form.Item>
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
          <Form.Item label="" name="steps" {...approvalLayout}> 
            <div style={{paddingLeft: '265px'}}>
              {details?.state !== -2 && !isAdd
                ? renderStep(details)
                  : null}
            </div>
          </Form.Item>
          <GuideTeacherModal
            taskId={props.taskId}
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
          <AwardStudentsModal
            // taskId={props.taskId}
            studentLists={selectedStudents}
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
          <CustomAwardLevelModal
            onRef={(ref) => (levelModal.current = ref)}
            onOk={(data) => {
              if (data.name !== '') {
                form.setFieldsValue({awardLevelName: data.name});
              } else {
                form.resetFields(['awardLevelName']);
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
          <Modal
            title="再次提交"
            visible={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
          >
            <p>确认要再次提交填报内容吗？</p>
         </Modal>
         <PicturesShow
              onRef={(ref) => {
                pictureModal.current = ref;
              }}
          ></PicturesShow>
        </Form>
      </div>
      {canEdit? (
        <div style={{display: "block", width: '1000px', height: '74px', backgroundColor: 'white'}}>
        </div>
      ) : null}
        {canEdit ? (
          <div style={{position: 'fixed', bottom: '0px', width: '1000px', height: '74px', backgroundColor: 'white', zIndex: 1000}}>
            <div style={{display: "flex", width: '100%', justifyContent: 'center', alignItems: "center", paddingTop: 10}}>
              <Button 
                type="primary"
                onClick={submit}
                loading={loading}>
                {isAdd ? '提交' : (details?.state === 2 ? '再次提交' : '确认修改') }
              </Button>
              <Button
                style={{ marginLeft: 10 }}
                onClick={()=> history.goBack()}>
                取消
              </Button>
            </div>
          </div>
          ) : null}
    </div>
  )
}
