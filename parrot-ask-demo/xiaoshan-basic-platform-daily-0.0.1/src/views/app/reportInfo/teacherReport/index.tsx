import React, { useRef, useState, useEffect } from "react";
import { useForm } from "antd/lib/form/Form";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Divider,
  message,
  Checkbox,
  Select,
  Row,
  Col,
  Spin,
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GT from "types";
import api from "src/api";
import IconFont from "src/components/IconFont";
import useDictionary from "src/hook/useDictionary";
import UploadFiles from "src/components/UploadFiles";
import CustomAwardLevelModal from "../studentReport/component/CustomAwardLevel";
import VerifyAwardModal from "src/views/app/awardInfo/student/component/VerifyAwardModal";
import moment from "moment";
import { TeacherReportSubmit, TeacherReportDetail } from "types/dto/award";
import { useHistory } from "react-router-dom";
import ApprovalProcess from "./component/ApprovalProcess";
import TextArea from "antd/lib/input/TextArea";
import UpdateConfirmModal from "./component/UpdateConfirmModal";
import PicturesShow from "./component/PicturesShow";
import { ActionType, useGlobalState } from "src/store";
import qs from "qs";

/**
 *
 * @param props roleType参数 1为填报人 2为审批人
 */
export default function TeacherReportCenter(props: GT.Modal.Props & any) {
  const history = useHistory();
  //顶部基本信息form
  const [infoForm] = useForm();
  //填报信息form
  const [form] = useForm();
  //自定义奖项
  const [awardLevels, setAwardLevels] = useState<GT.Model.AwardLevelModel[]>();
  const levelModal = useRef<GT.Modal.Ref>();
  const verifyModal = useRef<GT.Modal.Ref>();
  const updateModal = useRef<GT.Modal.Ref>();
  const pictureModal = useRef<GT.Modal.Ref>();
  const { renderSelect } = useDictionary();
  const [loadingFlag, setLoadingFlag] = useState<boolean>(true);

  const mustFill = useRef<boolean>(true);

  const hideModal = useRef<boolean>(false);

  const getRequire = (rule: any, value: any) => {
    if (mustFill.current) {
      if (value) {
        return Promise.resolve();
      } else {
        return Promise.reject(rule.message);
      }
    } else {
      return Promise.resolve();
    }
  };

  const [, dispatch] = useGlobalState();
  useEffect(() => {
    if (props.roleType === "3") {
      dispatch({
        type: ActionType.SetBreadcrumb,
        payload: [{ zhName: "汇总记录" }, { zhName: "提交详情" }],
      });
      return () => {
        dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
      };
    }
    if (props.roleType === "1") {
      dispatch({
        type: ActionType.SetBreadcrumb,
        payload: [{ zhName: props.taskName }],
      });
      return () => {
        dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
      };
    }
  }, []);

  //接口获取填报详情
  const [dataDetail, setDataDetail] = useState<TeacherReportDetail>();

  //表单组件内统一disable
  const [disableFlag, setDisableFlag] = useState(false);

  const monthFormat = "YYYY-MM";

  useEffect(() => {
    //获取任务填报详情
    api.award
      .getTeacherReportDetail({
        params: { taskId: props.taskId, recordId: props.recordId },
      })
      .then((value) => {
        setLoadingFlag(false);
        //填报人
        if (props.roleType === "1") {
          if (value.state === 1 || value.state === 0) {
            setDisableFlag(true);
          } else {
            setDisableFlag(false);
          }
        } //审批人
        else if (props.roleType === "2") {
          if (!value?.active) {
            setDisableFlag(true);
          } else {
            setDisableFlag(false);
          }
        } else {
          setDisableFlag(true);
        }

        //设置年度荣誉选中状态（优先设置，界面展示用）
        value.bonusRecords?.forEach((value) => {
          //设置选中状态
          if (value.bonusId) {
            value.flag = true;
          } else {
            value.flag = false;
          }
        });
        //设置接口数据
        setDataDetail(value);
        //设置基本信息
        infoForm.setFieldsValue({
          teacherName: value.teacherName,
          icCardNo: value.icCardNo ? value.icCardNo : "无",
          groupId: value.groupId,
        });
        //设置 业务比赛参与和获奖
        setTeacherAwardRecords(value);
        //设置 课题申报和立项
        setProjectApplicationRecords(value);
        //设置 课题获奖
        setProjectAwardRecords(value);
        //设置 论文送审和获奖
        setPaperSubmitRecords(value);
        //设置 论文发表
        setPaperPublishRecords(value);
        //设置 校内外公开课
        setOpenCourseRecords(value);
        //设置 校内外讲座
        setLectureRecords(value);
        //设置 各类荣誉
        setHonorRecords(value);
        //设置 年度荣誉加分情况
        setBonusRecords(value);
        //设置表单填报详情
        form.setFieldsValue(value);
      });
  }, []);

  //设置 业务比赛参与和获奖
  function setTeacherAwardRecords(value: TeacherReportDetail) {
    value.teacherAwardRecords?.forEach((value) => {
      //设置时间
      if (value.detailDate) {
        value.awardData = moment(value.detailDate, monthFormat);
      }
      //设置排名
      if (value.chargeTotalNo && value.chargeOrderNo) {
        value.rank = value.chargeOrderNo + "/" + value.chargeTotalNo;
      }
      value.photoList = value.recordFilePaths?.map((value, index) => ({
        uid: index,
        id: value.id,
        status: "done",
        url: value.filePath + "&resize=200x200",
        sourceUrl: value.filePath,
        idFlag: true,
      }));
    });
  }

  const currentLocation = useRef<any>();

  useEffect(() => {
    let flag = disableFlag;
    return history.block((location: any, action) => {
      //hiden的时候不显示
      if (hideModal.current) {
        return;
      }
      if (location.pathname === history.location.pathname) {
        return;
      }
      if (!flag) {
        Modal.confirm({
          title: "提示",
          content: "离开当前页面不会保存修改内容，确定离开吗？",
          okText: "确认离开",
          cancelText: "留在此页",
          onOk() {
            flag = true;
            if (action === "PUSH") {
              history.push(location);
            } else if (action === "POP") {
              // 大部分都为返回
              if (!currentLocation.current) {
                currentLocation.current = location;
              }
              // isNeedForward.current = false;
              // history.goBack();
              history.replace(currentLocation.current);
            } else if (action === "REPLACE") {
              history.replace(location);
            }
          },
          onCancel() {
            if (action === "POP") {
              if (!currentLocation.current) {
                currentLocation.current = location;
              }
            }
          },
        });
        return false;
      }
    });
  }, [disableFlag]);

  //设置 课题申报和立项
  function setProjectApplicationRecords(value: TeacherReportDetail) {
    value.projectApplicationRecords?.forEach((value) => {
      //设置排名
      if (value.chargeTotalNo && value.chargeOrderNo) {
        value.rank = value.chargeOrderNo + "/" + value.chargeTotalNo;
      }
    });
  }

  //设置课题获奖
  function setProjectAwardRecords(value: TeacherReportDetail) {
    value.projectAwardRecords?.forEach((value) => {
      //设置时间
      if (value.detailDate) {
        value.awardData = moment(value.detailDate, monthFormat);
      }
      value.photoList = value.recordFilePaths?.map((value, index) => ({
        uid: index,
        id: value.id,
        status: "done",
        url: value.filePath + "&resize=200x200",
        sourceUrl: value.filePath,
        idFlag: true,
      }));
    });
  }

  //设置 论文送审和获奖
  function setPaperSubmitRecords(value: TeacherReportDetail) {
    value.paperSubmitRecords?.forEach((value) => {
      //设置时间
      if (value.detailDate) {
        value.awardData = moment(value.detailDate, monthFormat);
      }
      //设置排名
      if (value.chargeTotalNo && value.chargeOrderNo) {
        value.rank = value.chargeOrderNo + "/" + value.chargeTotalNo;
      }
      value.photoList = value.recordFilePaths?.map((value, index) => ({
        uid: index,
        id: value.id,
        status: "done",
        url: value.filePath + "&resize=200x200",
        sourceUrl: value.filePath,
        idFlag: true,
      }));
    });
  }

  //设置 论文发表
  function setPaperPublishRecords(value: TeacherReportDetail) {
    value.paperPublishRecords?.forEach((value) => {
      //设置时间
      if (value.detailDate) {
        value.awardData = moment(value.detailDate, monthFormat);
      }
      //设置排名
      if (value.chargeTotalNo && value.chargeOrderNo) {
        value.rank = value.chargeOrderNo + "/" + value.chargeTotalNo;
      }
      value.photoList = value.recordFilePaths?.map((value, index) => ({
        uid: index,
        id: value.id,
        status: "done",
        url: value.filePath + "&resize=200x200",
        sourceUrl: value.filePath,
        idFlag: true,
      }));
    });
  }

  //设置 校内外公开课
  function setOpenCourseRecords(value: TeacherReportDetail) {
    value.openCourseRecords?.forEach((value) => {
      //设置时间
      if (value.detailDate) {
        value.awardData = moment(value.detailDate, monthFormat);
      }
      value.photoList = value.recordFilePaths?.map((value, index) => ({
        uid: index,
        id: value.id,
        status: "done",
        url: value.filePath + "&resize=200x200",
        sourceUrl: value.filePath,
        idFlag: true,
      }));
    });
  }

  //设置 校内外讲座
  function setLectureRecords(value: TeacherReportDetail) {
    value.lectureRecords?.forEach((value) => {
      //设置时间
      if (value.detailDate) {
        value.awardData = moment(value.detailDate, monthFormat);
      }
      value.photoList = value.recordFilePaths?.map((value, index) => ({
        uid: index,
        id: value.id,
        status: "done",
        url: value.filePath + "&resize=200x200",
        sourceUrl: value.filePath,
        idFlag: true,
      }));
    });
  }

  //设置 各类荣誉
  function setHonorRecords(value: TeacherReportDetail) {
    value.honorRecords?.forEach((value) => {
      //设置时间
      if (value.detailDate) {
        value.awardData = moment(value.detailDate, monthFormat);
      }
      value.photoList = value.recordFilePaths?.map((value, index) => ({
        uid: index,
        id: value.id,
        status: "done",
        url: value.filePath + "&resize=200x200",
        sourceUrl: value.filePath,
        idFlag: true,
      }));
    });
  }

  //设置 年度荣誉加分情况
  function setBonusRecords(value: TeacherReportDetail) {
    //年度荣誉获奖加分情况
    value.bonusRecords?.forEach((value) => {
      //设置时间
      if (value.detailDate) {
        value.awardData = moment(value.detailDate, monthFormat);
      }
      //设置排名
      if (value.chargeTotalNo && value.chargeOrderNo) {
        value.rank = value.chargeOrderNo + "/" + value.chargeTotalNo;
      }
      value.photoList = value.recordFilePaths?.map((value, index) => ({
        uid: index,
        id: value.id,
        status: "done",
        url: value.filePath + "&resize=200x200",
        sourceUrl: value.filePath,
        idFlag: true,
      }));
    });
  }

  /**
   * 提交 教师填报
   */
  function submitRecord() {
    mustFill.current = true;
    infoForm
      .validateFields()
      .then(() => {
        form
          .validateFields()
          .then(() => {
            let record = getSubmitForm();
            if (
              record.bonusRecords?.length === 0 &&
              record.honorRecords?.length === 0 &&
              record.lectureRecords?.length === 0 &&
              record.openCourseRecords?.length === 0 &&
              record.paperPublishRecords?.length === 0 &&
              record.paperSubmitRecords?.length === 0 &&
              record.projectApplicationRecords?.length === 0 &&
              record.projectAwardRecords?.length === 0 &&
              record.teacherAwardRecords?.length === 0
            ) {
              message.error("未填写任何内容");
              return;
            }
            api.award.submitTeacherRecord(record).then(() => {
              message.success("提交成功");
              if (props.onOk) {
                props.onOk();
              } else {
                hideModal.current = true;
                history.goBack();
              }
            });
          })
          .catch((error) => {
            message.error("请检查表单填写内容");
          });
      })
      .catch((error) => {
        message.error("请选择教研组");
      });
  }

  /**
   * 修改 教师填报
   */
  function updateRecord() {
    mustFill.current = true;
    infoForm
      .validateFields()
      .then(() => {
        form
          .validateFields()
          .then(() => {
            let record = getSubmitForm();
            if (
              record.bonusRecords?.length === 0 &&
              record.honorRecords?.length === 0 &&
              record.lectureRecords?.length === 0 &&
              record.openCourseRecords?.length === 0 &&
              record.paperPublishRecords?.length === 0 &&
              record.paperSubmitRecords?.length === 0 &&
              record.projectApplicationRecords?.length === 0 &&
              record.projectAwardRecords?.length === 0 &&
              record.teacherAwardRecords?.length === 0
            ) {
              message.error("未填写任何内容");
              return;
            }
            api.award.updateTeacherRecord(record).then(() => {
              message.success("修改成功");
              if (props.onOk) {
                props.onOk();
              } else {
                hideModal.current = true;
                history.goBack();
              }
            });
          })
          .catch((error) => {
            message.error("请检查表单填写内容");
          });
      })
      .catch((error) => {
        message.error("请选择教研组");
      });
  }

  /**
   * 暂存 教师填报（校验排名字段是否合法）
   */
  function saveRecord() {
    mustFill.current = false;
    //业务比赛参与和获奖
    let teacherAwardRecords = form
      .getFieldValue("teacherAwardRecords")
      ?.map((item: any, index: number) => {
        return ["teacherAwardRecords", index, "rank"];
      });

    // 课题申报和立项
    let projectApplicationRecords = form
      .getFieldValue("projectApplicationRecords")
      ?.map((item: any, index: number) => {
        return ["projectApplicationRecords", index, "rank"];
      });

    //论文送审和获奖
    let paperSubmitRecords = form
      .getFieldValue("paperSubmitRecords")
      ?.map((item: any, index: number) => {
        return ["paperSubmitRecords", index, "rank"];
      });

    //论文发表
    let paperPublishRecords = form
      .getFieldValue("paperPublishRecords")
      ?.map((item: any, index: number) => {
        return ["paperPublishRecords", index, "rank"];
      });

    //年度荣誉
    let bonusRecords = form
      .getFieldValue("bonusRecords")
      ?.map((item: any, index: number) => {
        if (item.itemType === 2 && item.flag) {
          return ["bonusRecords", index, "rank"];
        }
      })
      .filter((item: any[]) => item !== undefined);

    //获取校验字段路径 数组
    let empty: any[] = [];
    let arr = empty.concat(
      teacherAwardRecords,
      projectApplicationRecords,
      paperSubmitRecords,
      paperPublishRecords,
      bonusRecords
    );

    //校验通过提交 暂存
    form
      .validateFields(arr)
      .then((values) => {
        let record = getSubmitForm();
        api.award.saveTeacherRecord(record).then(() => {
          message.success("保存成功");
        });
      })
      .catch((errorInfo) => {
        message.error("表单填写内容有误");
      });
  }

  /**
   * 教师填报审核
   *
   * @param state
   * @param content
   */
  function approvalTeacherReport(state: number, content?: string) {
    mustFill.current = true;
    infoForm
      .validateFields()
      .then(() => {
        form
          .validateFields()
          .then(() => {
            let record = getSubmitForm();
            record.state = state;
            record.content = content;
            if (
              record.bonusRecords?.length === 0 &&
              record.honorRecords?.length === 0 &&
              record.lectureRecords?.length === 0 &&
              record.openCourseRecords?.length === 0 &&
              record.paperPublishRecords?.length === 0 &&
              record.paperSubmitRecords?.length === 0 &&
              record.projectApplicationRecords?.length === 0 &&
              record.projectAwardRecords?.length === 0 &&
              record.teacherAwardRecords?.length === 0
            ) {
              message.error("未填写任何内容");
              return;
            }
            api.award.approvalTeacherRepor(record).then(() => {
              message.success("审核成功");
              if (props.onOk) {
                props.onOk();
              } else {
                hideModal.current = true;
                history.goBack();
              }
            });
          })
          .catch((error) => {
            message.error("请检查表单填写内容");
          });
      })
      .catch((error) => {
        message.error("请选择教研组");
      });
  }

  //获取照片id
  function getPhotoIds(value?: any): number[] {
    let ids = value?.reduce((arr: any[], item: any) => {
      if (item.idFlag) {
        arr.push(item.id);
      } else {
        arr.push(item.response.id);
      }
      return arr;
    }, []);
    return ids;
  }

  //获取照片url
  function getPhotoUrls(value?: any): string[] {
    let urls = value?.reduce((arr: any[], item: any) => {
      if (item.idFlag) {
        arr.push(item.sourceUrl);
      } else {
        arr.push(item.response.url);
      }
      return arr;
    }, []);
    return urls;
  }

  //获取表单信息
  function getSubmitForm(): TeacherReportSubmit {
    //业务比赛参与和获奖
    let teacherAwardRecords = form
      .getFieldValue("teacherAwardRecords")
      ?.reduce((arr: any, item: any) => {
        arr.push({
          awardGradeName: item.awardGradeName,
          awardUnit: item.awardUnit,
          chargeOrderNo: item.rank?.split("/")[0],
          chargeTotalNo: item.rank?.split("/")[1],
          contestContent: item.contestContent,
          contestLevel: item.contestLevel,
          contestName: item.contestName,
          detailDate: item.awardData?.format("YYYY-MM"),
          id: item.id,
          recordFileIds: getPhotoIds(item.photoList),
        });
        return arr;
      }, []);

    //课题申报和立项
    let projectApplicationRecords = form
      .getFieldValue("projectApplicationRecords")
      ?.reduce((arr: any, item: any) => {
        arr.push({
          chargeOrderNo: item.rank?.split("/")[0],
          chargeTotalNo: item.rank?.split("/")[1],
          establishmentState: item.establishmentState,
          id: item.id,
          projectName: item.projectName,
          projectTotalNo: item.projectTotalNo,
        });
        return arr;
      }, []);

    // 课题获奖
    let projectAwardRecords = form
      .getFieldValue("projectAwardRecords")
      ?.reduce((arr: any, item: any) => {
        arr.push({
          awardGradeName: item.awardGradeName,
          awardLevel: item.awardLevel,
          awardUnit: item.awardUnit,
          detailDate: item.awardData?.format("YYYY-MM"),
          id: item.id,
          project: item.project,
          projectName: item.projectName,
          recordFileIds: getPhotoIds(item.photoList),
        });
        return arr;
      }, []);

    //论文送审和获奖
    let paperSubmitRecords = form
      .getFieldValue("paperSubmitRecords")
      ?.reduce((arr: any, item: any) => {
        arr.push({
          awardGradeName: item.awardGradeName,
          awardLevel: item.awardLevel,
          awardUnit: item.awardUnit,
          chargeOrderNo: item.rank?.split("/")[0],
          chargeTotalNo: item.rank?.split("/")[1],
          detailDate: item.awardData?.format("YYYY-MM"),
          id: item.id,
          paperName: item.paperName,
          project: item.project,
          recordFileIds: getPhotoIds(item.photoList),
        });
        return arr;
      }, []);

    //论文发表
    let paperPublishRecords = form
      .getFieldValue("paperPublishRecords")
      ?.reduce((arr: any, item: any) => {
        arr.push({
          chargeOrderNo: item.rank?.split("/")[0],
          chargeTotalNo: item.rank?.split("/")[1],
          detailDate: item.awardData?.format("YYYY-MM"),
          id: item.id,
          journalName: item.journalName,
          paperName: item.paperName,
          recordFileIds: getPhotoIds(item.photoList),
        });
        return arr;
      }, []);

    //校内外公开课
    let openCourseRecords = form
      .getFieldValue("openCourseRecords")
      ?.reduce((arr: any, item: any) => {
        arr.push({
          courseName: item.courseName,
          detailDate: item.awardData?.format("YYYY-MM"),
          hostUnit: item.hostUnit,
          id: item.id,
          recordFileIds: getPhotoIds(item.photoList),
        });
        return arr;
      }, []);

    //校内外讲座
    let lectureRecords = form
      .getFieldValue("lectureRecords")
      ?.reduce((arr: any, item: any) => {
        arr.push({
          lectureName: item.lectureName,
          detailDate: item.awardData?.format("YYYY-MM"),
          hostUnit: item.hostUnit,
          id: item.id,
          recordFileIds: getPhotoIds(item.photoList),
        });
        return arr;
      }, []);

    //各类荣誉
    let honorRecords = form
      .getFieldValue("honorRecords")
      ?.reduce((arr: any, item: any) => {
        arr.push({
          honorName: item.honorName,
          detailDate: item.awardData?.format("YYYY-MM"),
          hostUnit: item.hostUnit,
          id: item.id,
          recordFileIds: getPhotoIds(item.photoList),
        });
        return arr;
      }, []);

    // 年度荣誉获奖加分情况
    let bonusRecords = form
      .getFieldValue("bonusRecords")
      ?.reduce((arr: any, item: any) => {
        if (item.flag) {
          arr.push({
            bonusId: item.itemId,
            chargeOrderNo: item.rank?.split("/")[0],
            chargeTotalNo: item.rank?.split("/")[1],
            detailDate: item.awardData?.format("YYYY-MM"),
            hostUnit: item.hostUnit,
            id: item.id,
            recordFileIds: getPhotoIds(item.photoList),
          });
        }
        return arr;
      }, []);

    return {
      id: dataDetail?.id,
      taskId: props.taskId,
      groupId: infoForm.getFieldValue("groupId"),
      teacherAwardRecords: teacherAwardRecords,
      projectApplicationRecords: projectApplicationRecords,
      projectAwardRecords: projectAwardRecords,
      paperSubmitRecords: paperSubmitRecords,
      paperPublishRecords: paperPublishRecords,
      openCourseRecords: openCourseRecords,
      lectureRecords: lectureRecords,
      honorRecords: honorRecords,
      bonusRecords: bonusRecords,
    };
  }

  //获取获奖等级
  const getAwardLevels = (open: boolean) => {
    if (open) {
      api.award.getByRecordId({ recordId: props.recordId }).then((res) => {
        let customLevels = res;
        customLevels.push({ id: 999, name: "自定义填写" });
        setAwardLevels(customLevels);
      });
    }
  };

  // 自定义level等级
  const onChangeLevel = (
    val: any,
    text: any,
    listName: string,
    itemName: string,
    index: number
  ) => {
    if (text) {
      if (text.children === "自定义填写") {
        levelModal.current?.setListName(listName);
        levelModal.current?.setItemName(itemName);
        levelModal.current?.setIndex(index);
        levelModal.current?.setVisible(true);
      }
    }
  };

  const titleStyle = {
    color: "#303133",
    fontSize: "16px",
    marginLeft: 10,
  };

  const itemDivStyle = {
    background: "#F5F5F5",
    border: "1px solid #C6C8CC",
    borderRadius: "3px",
    padding: "20px 20px 20px 30px",
    marginBottom: "20px",
  };

  //当前任务状态
  const renderTaskState = (taskState?: number) => {
    let text, color;
    switch (taskState) {
      case 0:
        text = "填报任务未开始";
        color = "#84878C";
        break;
      case 1:
        text = "填报任务进行中";
        color = "#5781F2";
        break;
      case 2:
        text = "填报任务已结束";
        color = "#84878C";
        break;
      default:
        break;
    }

    return <span style={{ color }}>{text}</span>;
  };

  //当前填报状态
  const renderState = (state?: number) => {
    let text, color, background;
    switch (state) {
      case -2:
        text = "未提交";
        color = "#FE4F54";
        background = "#FE4F5426";
        break;
      case -1:
        text = "待审批";
        color = "#FF8948";
        background = "#FF894826";
        break;
      case 0:
        text = "审批中";
        color = "#9065F6";
        background = "#9065F626";
        break;
      case 1:
        text = "已通过";
        color = "#3CC251";
        background = "#3CC25126";
        break;
      case 2:
        text = "已驳回";
        color = "#FE4F54";
        background = "#FE4F5426";
        break;
    }
    return (
      <p
        style={{
          color,
          background,
          height: 28,
          width: 70,
          borderRadius: 3,
          textAlign: "center",
          paddingTop: 3,
        }}
      >
        {text}
      </p>
    );
  };

  const renderStep = (detail?: TeacherReportDetail) => {
    return (
      <div>
        <Divider></Divider>
        <div
          style={{
            fontSize: 16,
            fontWeight: 400,
            lineHeight: "22px",
            color: "#303133",
            opacity: 1,
          }}
        >
          <b>审批流程</b>
        </div>
        <div id="div">
          <ApprovalProcess
            state={dataDetail?.state}
            sponsorName={dataDetail?.teacherName}
            sponsorTime={dataDetail?.publishTime}
            nodes={dataDetail?.nodes}
            copies={dataDetail?.carbonCopies}
            contentWidth={500}
          ></ApprovalProcess>
        </div>
      </div>
    );
  };

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
      <div style={{ margin: "0 auto", width: 1000 }}>
        <div
          style={{
            border: "1px solid #C6C8CC",
            marginTop: 20,
            marginBottom: 100,
          }}
        >
          {dataDetail?.state === -2 ? (
            <div style={{ height: "50px", background: "#F2F4FB" }}>
              <b
                style={{
                  marginLeft: "16px",
                  color: "#303133",
                  fontSize: "16px",
                  lineHeight: "50px",
                }}
              >
                {dataDetail?.taskName}
              </b>
            </div>
          ) : null}

          {dataDetail?.state !== -2 ? (
            <div
              style={{
                height: "76px",
                background: "#F2F4FB",
                paddingTop: 15,
              }}
            >
              <b
                style={{
                  marginLeft: "16px",
                  color: "#303133",
                  fontSize: "16px",
                }}
              >
                {dataDetail?.taskName}-{dataDetail?.teacherName}的提交详情
              </b>
              <br />
              <span
                style={{
                  marginLeft: "16px",
                  color: "#84878C",
                  marginTop: 10,
                  fontSize: "13px",
                }}
              >
                提交人：{dataDetail?.teacherName}
              </span>
              <span
                style={{
                  marginLeft: "20px",
                  marginTop: 10,
                  color: "#84878C",
                  fontSize: "13px",
                }}
              >
                提交时间：{dataDetail?.publishTime}
              </span>
              <span
                style={{
                  marginLeft: "20px",
                  color: "#84878C",
                  marginTop: 10,
                  fontSize: "13px",
                }}
              >
                提交编号：{dataDetail?.serialNumber}
              </span>
            </div>
          ) : null}

          <div style={{ padding: "30px 20px 20px 20px" }}>
            <Form
              name="report"
              layout="horizontal"
              colon={false}
              form={infoForm}
              preserve={false}
              onChange={() => {}}
            >
              <Row align="middle" style={{ marginBottom: 20 }}>
                <Col flex="25px">
                  <IconFont
                    type="iconcaiji-bianji"
                    style={{ fontSize: 24 }}
                  ></IconFont>
                </Col>
                <Col flex="100px">
                  <b style={titleStyle}>基本信息</b>
                </Col>
                <Col flex="auto"></Col>
                <Col flex="200px">
                  <Row style={{ marginTop: 10 }}>
                    <Col style={{ marginTop: 2 }}>
                      {renderTaskState(dataDetail?.taskState)}
                    </Col>
                    <Col style={{ marginLeft: 10 }}>
                      {renderState(dataDetail?.state)}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Form.Item
                    label="教师姓名"
                    colon={true}
                    name="teacherName"
                    rules={[{ required: true }]}
                  >
                    <Input
                      bordered={false}
                      readOnly={true}
                      style={{ color: "#303133" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="IC卡号"
                    required={true}
                    colon={true}
                    name="icCardNo"
                  >
                    <Input
                      bordered={false}
                      readOnly={true}
                      style={{ color: "#303133" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="教研组"
                    colon={true}
                    name="groupId"
                    rules={[{ required: true }]}
                  >
                    {renderSelect("researchGroup", {
                      style: { width: 100 },
                      disabled: disableFlag,
                    })}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            {disableFlag &&
            dataDetail?.honorRecords?.length === 0 &&
            dataDetail?.lectureRecords?.length === 0 &&
            dataDetail?.openCourseRecords?.length === 0 &&
            dataDetail?.paperPublishRecords?.length === 0 &&
            dataDetail?.paperSubmitRecords?.length === 0 &&
            dataDetail?.projectApplicationRecords?.length === 0 &&
            dataDetail?.projectAwardRecords?.length === 0 &&
            dataDetail?.teacherAwardRecords?.length === 0 ? null : (
              <Divider plain style={{ color: "#909499", fontSize: 12 }}>
                基本考核项
              </Divider>
            )}
            <Form
              name="report"
              layout="vertical"
              preserve={false}
              colon={false}
              scrollToFirstError={true}
              form={form}
            >
              {/* ----------------------------------------业务比赛参与和获奖---------------------------------------- */}
              {disableFlag &&
              dataDetail?.teacherAwardRecords?.length === 0 ? null : (
                <Form.List name="teacherAwardRecords">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item>
                        <Row align="middle">
                          <Col flex={"25px"}>
                            <IconFont
                              type="iconcaiji-bianji"
                              style={{ fontSize: 24 }}
                            ></IconFont>
                          </Col>
                          <Col flex={"170px"}>
                            <b style={titleStyle}>业务比赛参与和获奖</b>
                          </Col>
                          <Col span={5}>
                            <Button
                              type="primary"
                              ghost
                              hidden={disableFlag}
                              size="middle"
                              style={{ fontSize: 13 }}
                              onClick={() => {
                                if (fields.length < 10) {
                                  add({
                                    contestName: null,
                                    awardGradeName: null,
                                    contestContent: null,
                                    contestLevel: null,
                                    awardUnit: null,
                                    awardData: null,
                                    rank: null,
                                    photoList: [],
                                  });
                                }
                              }}
                            >
                              添加项目
                            </Button>
                          </Col>
                        </Row>
                      </Form.Item>
                      {fields.map((field, index) => {
                        return (
                          <div style={itemDivStyle}>
                            <Row align="middle">
                              <Col span={4}>
                                <IconFont
                                  type="iconbulecircle"
                                  style={{ fontSize: 25 }}
                                />
                                <b style={{ fontSize: 25, marginLeft: -10 }}>
                                  {index < 9 ? "0" + (index + 1) : index + 1}
                                </b>
                              </Col>
                              <Col span={2} offset={18}>
                                <Button
                                  danger
                                  style={{
                                    background: "#F5F5F5",
                                    fontSize: 14,
                                  }}
                                  onClick={() => {
                                    remove(index);
                                  }}
                                  hidden={disableFlag}
                                  size="middle"
                                >
                                  删除
                                </Button>
                              </Col>
                            </Row>
                            <div>
                              <b style={{ fontSize: 16 }}>参与情况</b>
                            </div>
                            <Row style={{ marginTop: 10 }}>
                              <Col span={8}>
                                <Form.Item
                                  label="比赛名称"
                                  colon={true}
                                  name={[field.name, "contestName"]}
                                  fieldKey={[field.fieldKey, "contestName"]}
                                  rules={[{ required: true, whitespace: true }]}
                                >
                                  <TextArea
                                    disabled={disableFlag}
                                    placeholder="例如，浙江省2019年度“一师一优课”活动"
                                    maxLength={50}
                                    autoSize
                                  ></TextArea>
                                </Form.Item>
                              </Col>
                              <Col span={8} offset={4}>
                                <Form.Item
                                  label="参评内容"
                                  colon={true}
                                  rules={[{ whitespace: true }]}
                                  name={[field.name, "contestContent"]}
                                  fieldKey={[field.key, "contestContent"]}
                                >
                                  <TextArea
                                    autoSize
                                    disabled={disableFlag}
                                    placeholder="例如，课例《传统文化的继承》"
                                    maxLength={50}
                                  ></TextArea>
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row>
                              <Col span={8}>
                                <Form.Item
                                  label="比赛类别"
                                  colon={true}
                                  name={[field.name, "contestLevel"]}
                                  fieldKey={[field.key, "contestLevel"]}
                                  rules={[{ required: true }]}
                                >
                                  {renderSelect("contestLevel", {
                                    style: { height: 34, width: "100%" },
                                    disabled: disableFlag,
                                  })}
                                </Form.Item>
                              </Col>
                              <Col span={8} offset={4}>
                                <Form.Item
                                  label="授奖单位"
                                  colon={true}
                                  name={[field.name, "awardUnit"]}
                                  fieldKey={[field.key, "awardUnit"]}
                                  rules={[{ required: true, whitespace: true }]}
                                >
                                  <TextArea
                                    autoSize
                                    disabled={disableFlag}
                                    placeholder="例如，浙江省教育技术中心"
                                    maxLength={50}
                                  ></TextArea>
                                </Form.Item>
                              </Col>
                            </Row>
                            {disableFlag &&
                            !form.getFieldValue("teacherAwardRecords")[index]
                              .awardGradeName ? null : (
                              <div>
                                <div style={{ marginTop: 20 }}>
                                  <b style={{ fontSize: 16 }}>获奖情况</b>
                                  <div style={{ color: "#84878C" }}>
                                    (如有获奖，请填写获奖情况)
                                  </div>
                                </div>
                                <Row style={{ marginTop: 10 }}>
                                  <Col span={8}>
                                    <Form.Item
                                      label="获奖等级"
                                      colon={true}
                                      name={[field.name, "awardGradeName"]}
                                      fieldKey={[field.key, "awardGradeName"]}
                                      rules={[
                                        {
                                          validator(rule, value) {
                                            if (
                                              form.getFieldValue(
                                                "teacherAwardRecords"
                                              )[index].rank ||
                                              form.getFieldValue(
                                                "teacherAwardRecords"
                                              )[index].awardData ||
                                              form.getFieldValue(
                                                "teacherAwardRecords"
                                              )[index].photoList.length > 0
                                            ) {
                                              return value
                                                ? Promise.resolve()
                                                : Promise.reject(
                                                    "请选择获奖等级"
                                                  );
                                            }
                                            return Promise.resolve();
                                          },
                                        },
                                      ]}
                                    >
                                      <Select
                                        disabled={disableFlag}
                                        placeholder="请选择"
                                        allowClear={true}
                                        onDropdownVisibleChange={getAwardLevels}
                                        onChange={(val, text) =>
                                          onChangeLevel(
                                            val,
                                            text,
                                            "teacherAwardRecords",
                                            "awardGradeName",
                                            index
                                          )
                                        }
                                      >
                                        {awardLevels?.map((level) => (
                                          <Select.Option value={level.name}>
                                            {level.name}
                                          </Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                  <Col span={8} offset={4}>
                                    <Form.Item
                                      label="获奖时间"
                                      colon={true}
                                      name={[field.name, "awardData"]}
                                      fieldKey={[field.key, "awardData"]}
                                      rules={[
                                        {
                                          validator(rule, value) {
                                            if (
                                              form.getFieldValue(
                                                "teacherAwardRecords"
                                              )[index].awardGradeName ||
                                              form.getFieldValue(
                                                "teacherAwardRecords"
                                              )[index].rank ||
                                              form.getFieldValue(
                                                "teacherAwardRecords"
                                              )[index].photoList.length > 0
                                            ) {
                                              return value
                                                ? Promise.resolve()
                                                : Promise.reject(
                                                    "请选择获奖时间"
                                                  );
                                            }
                                            return Promise.resolve();
                                          },
                                        },
                                      ]}
                                    >
                                      <DatePicker
                                        disabled={disableFlag}
                                        picker="month"
                                        style={{ width: "100%" }}
                                      ></DatePicker>
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col span={8}>
                                    <Form.Item
                                      label="第几负责人/共几人"
                                      validateFirst
                                      colon={true}
                                      name={[field.name, "rank"]}
                                      fieldKey={[field.key, "rank"]}
                                      rules={[
                                        {
                                          message: "请输入正确格式",
                                          pattern: RegExp(
                                            "^(([1-9]{1})|([0-9]{2,5}))/(([1-9]{1})|([0-9]{2,5}))$"
                                          ),
                                        },
                                        {
                                          validator(_, value) {
                                            if (value) {
                                              let arr = value.split("/");
                                              if (
                                                Number(arr[0]) > Number(arr[1])
                                              ) {
                                                return Promise.reject(
                                                  "排名不能比总人数多"
                                                );
                                              } else {
                                                return Promise.resolve();
                                              }
                                            }
                                            return Promise.resolve();
                                          },
                                        },
                                        {
                                          validator(_, value) {
                                            if (
                                              form.getFieldValue(
                                                "teacherAwardRecords"
                                              )[index].awardGradeName ||
                                              form.getFieldValue(
                                                "teacherAwardRecords"
                                              )[index].awardData ||
                                              form.getFieldValue(
                                                "teacherAwardRecords"
                                              )[index].photoList.length > 0
                                            ) {
                                              if (!value) {
                                                return Promise.reject("请输入");
                                              }
                                            }
                                            return Promise.resolve();
                                          },
                                        },
                                      ]}
                                    >
                                      <Input
                                        disabled={disableFlag}
                                        placeholder="例如，1/3"
                                        maxLength={11}
                                      ></Input>
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <Form.Item
                                  label={
                                    <div>
                                      获奖证书照片{" "}
                                      <span style={{ color: "#FE4F54" }}>
                                        （照片大小不超过5M，支持png、jpg或jpeg格式
                                        ，最多上传9张）
                                      </span>
                                    </div>
                                  }
                                  hasFeedback
                                  valuePropName="fileList"
                                  name={[field.name, "photoList"]}
                                  fieldKey={[field.key, "photoList"]}
                                  rules={[
                                    {
                                      validator(rule, value) {
                                        if (
                                          form.getFieldValue(
                                            "teacherAwardRecords"
                                          )[index].awardGradeName ||
                                          form.getFieldValue(
                                            "teacherAwardRecords"
                                          )[index].awardData ||
                                          form.getFieldValue(
                                            "teacherAwardRecords"
                                          )[index].rank
                                        ) {
                                          return value.length > 0
                                            ? Promise.resolve()
                                            : Promise.reject("请上传照片");
                                        }
                                        return Promise.resolve();
                                      },
                                    },
                                  ]}
                                >
                                  <UploadFiles
                                    limit={disableFlag ? 0 : 9}
                                    crop={false}
                                    disabled={disableFlag}
                                    max={5 * 1024}
                                    upload={{
                                      accept: "image/jpeg,image/jpg,image/png",
                                      onPreview: (file) => {
                                        const pictures = form.getFieldValue(
                                          "teacherAwardRecords"
                                        )?.[index].photoList;
                                        const urls = getPhotoUrls(pictures);
                                        pictureModal.current?.setPictures(urls);
                                        pictureModal.current?.setPosition(
                                          pictures?.findIndex(
                                            (ele: any) => ele === file
                                          )
                                        );
                                        pictureModal.current?.setVisible(true);
                                      },
                                    }}
                                  >
                                    <div className="upload_Image_teacher">
                                      <PlusOutlined />
                                    </div>
                                  </UploadFiles>
                                </Form.Item>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </Form.List>
              )}

              {/* ----------------------------------------课题申报和立项---------------------------------------- */}

              {disableFlag &&
              dataDetail?.projectApplicationRecords?.length === 0 ? null : (
                <Form.List name="projectApplicationRecords">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item>
                        <Row align="middle">
                          <Col flex={"25px"}>
                            <IconFont
                              type="iconcaiji-bianji"
                              style={{ fontSize: 24 }}
                            ></IconFont>
                          </Col>
                          <Col flex="170px">
                            <b style={titleStyle}>课题申报和立项</b>
                          </Col>
                          <Col span={5}>
                            <Button
                              type="primary"
                              hidden={disableFlag}
                              ghost
                              size="middle"
                              onClick={() => {
                                if (fields.length < 10) {
                                  add({
                                    projectName: null,
                                    projectTotalNo: null,
                                    rank: null,
                                    establishmentState: null,
                                  });
                                }
                              }}
                              style={{ fontSize: 13 }}
                            >
                              添加项目
                            </Button>
                          </Col>
                        </Row>
                      </Form.Item>
                      {fields.map((field, index) => (
                        <div style={itemDivStyle}>
                          <Row align="middle">
                            <Col span={4}>
                              <IconFont
                                type="iconbulecircle"
                                style={{ fontSize: 25 }}
                              />
                              <b style={{ fontSize: 25, marginLeft: -10 }}>
                                {index < 9 ? "0" + (index + 1) : index + 1}
                              </b>
                            </Col>
                            <Col span={2} offset={18}>
                              <Button
                                danger
                                style={{ background: "#F5F5F5", fontSize: 14 }}
                                onClick={() => {
                                  remove(index);
                                }}
                                size="middle"
                                hidden={disableFlag}
                              >
                                删除
                              </Button>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label="申报课题名称"
                                colon={true}
                                name={[field.name, "projectName"]}
                                fieldKey={[field.key, "projectName"]}
                                rules={[{ required: true, whitespace: true }]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="请输入"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                            <Col span={8} offset={4}>
                              <Form.Item
                                label="课题参与人数"
                                colon={true}
                                name={[field.name, "projectTotalNo"]}
                                fieldKey={[field.key, "projectTotalNo"]}
                                rules={[
                                  { required: true },
                                  {
                                    message: "请输入1-99999范围的正整数",
                                    pattern: RegExp(
                                      "^([1-9]{1})|([0-9]{2,5})$"
                                    ),
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="请输入"
                                  disabled={disableFlag}
                                  maxLength={5}
                                ></Input>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row>
                            <Col span={8}>
                              <Form.Item
                                label="第几负责人/共几人"
                                colon={true}
                                validateFirst
                                name={[field.name, "rank"]}
                                required={true}
                                fieldKey={[field.key, "rank"]}
                                rules={[
                                  {
                                    validator: getRequire,
                                    message: "请输入",
                                  },
                                  {
                                    message: "请输入正确格式",
                                    pattern: RegExp(
                                      "^(([1-9]{1})|([0-9]{2,5}))/(([1-9]{1})|([0-9]{2,5}))$"
                                    ),
                                  },
                                  {
                                    validator(_, value) {
                                      if (value) {
                                        let arr = value.split("/");
                                        if (Number(arr[0]) > Number(arr[1])) {
                                          return Promise.reject(
                                            "排名不能比总人数多"
                                          );
                                        } else {
                                          return Promise.resolve();
                                        }
                                      }
                                      return Promise.resolve();
                                    },
                                  },
                                ]}
                              >
                                <Input
                                  disabled={disableFlag}
                                  placeholder="例如，1/3"
                                  maxLength={11}
                                ></Input>
                              </Form.Item>
                            </Col>
                            <Col span={8} offset={4}>
                              <Form.Item
                                label="是否立项"
                                colon={true}
                                name={[field.name, "establishmentState"]}
                                fieldKey={[field.key, "establishmentState"]}
                                rules={[{ required: true }]}
                              >
                                {renderSelect("establishmentState", {
                                  style: { height: 34, width: "100%" },
                                  disabled: disableFlag,
                                })}
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              )}
              {/* ----------------------------------------课题获奖---------------------------------------- */}
              {disableFlag &&
              dataDetail?.projectAwardRecords?.length === 0 ? null : (
                <Form.List name="projectAwardRecords">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item>
                        <Row align="middle">
                          <Col flex={"25px"}>
                            <IconFont
                              type="iconcaiji-bianji"
                              style={{ fontSize: 24 }}
                            ></IconFont>
                          </Col>
                          <Col flex="170px">
                            <b style={titleStyle}>课题获奖</b>
                          </Col>
                          <Col span={5}>
                            <Button
                              type="primary"
                              ghost
                              size="middle"
                              hidden={disableFlag}
                              onClick={() => {
                                if (fields.length < 10) {
                                  add({
                                    projectName: null,
                                    project: null,
                                    awardGradeName: null,
                                    awardUnit: null,
                                    awardData: null,
                                    awardLevel: null,
                                    photoList: [],
                                  });
                                }
                              }}
                              style={{ fontSize: 13 }}
                            >
                              添加项目
                            </Button>
                          </Col>
                        </Row>
                      </Form.Item>
                      {fields.map((field, index) => (
                        <div style={itemDivStyle}>
                          <Row align="middle">
                            <Col span={4}>
                              <IconFont
                                type="iconbulecircle"
                                style={{ fontSize: 25 }}
                              />
                              <b style={{ fontSize: 25, marginLeft: -10 }}>
                                {index < 9 ? "0" + (index + 1) : index + 1}
                              </b>
                            </Col>
                            <Col span={2} offset={18}>
                              <Button
                                danger
                                style={{ background: "#F5F5F5", fontSize: 14 }}
                                onClick={() => {
                                  remove(index);
                                }}
                                hidden={disableFlag}
                                size="middle"
                              >
                                删除
                              </Button>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label={
                                  <span>
                                    课题名称{" "}
                                    <span style={{ color: "#FE4F54" }}>
                                      与文件或证书一致
                                    </span>
                                  </span>
                                }
                                colon={true}
                                name={[field.name, "projectName"]}
                                fieldKey={[field.key, "projectName"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "请输入课题名称",
                                    whitespace: true,
                                  },
                                ]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="例如，《开展深度教学全面培育高中生素养的实践研究》"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                            <Col span={8} offset={4}>
                              <Form.Item
                                label="参评项目"
                                colon={true}
                                rules={[{ whitespace: true }]}
                                name={[field.name, "project"]}
                                fieldKey={[field.key, "project"]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="例如，浙江省2018-2019年创新教育分会优秀成果"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label="获奖等级"
                                colon={true}
                                name={[field.name, "awardGradeName"]}
                                fieldKey={[field.key, "awardGradeName"]}
                                rules={[
                                  { required: true, message: "请选择获奖等级" },
                                ]}
                              >
                                <Select
                                  disabled={disableFlag}
                                  placeholder="请选择"
                                  allowClear={true}
                                  onDropdownVisibleChange={getAwardLevels}
                                  onChange={(val, text) =>
                                    onChangeLevel(
                                      val,
                                      text,
                                      "projectAwardRecords",
                                      "awardGradeName",
                                      index
                                    )
                                  }
                                >
                                  {awardLevels?.map((level) => (
                                    <Select.Option value={level.name}>
                                      {level.name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={8} offset={4}>
                              <Form.Item
                                label="授奖单位"
                                colon={true}
                                name={[field.name, "awardUnit"]}
                                fieldKey={[field.key, "awardUnit"]}
                                rules={[{ required: true, whitespace: true }]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="例如，浙江省教学学会创新教育分会"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label="获奖时间"
                                colon={true}
                                name={[field.name, "awardData"]}
                                fieldKey={[field.key, "awardData"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "请选择获奖时间",
                                  },
                                ]}
                              >
                                <DatePicker
                                  disabled={disableFlag}
                                  picker="month"
                                  style={{ width: "100%" }}
                                ></DatePicker>
                              </Form.Item>
                            </Col>
                            <Col span={8} offset={4}>
                              <Form.Item
                                label="获奖级别"
                                colon={true}
                                name={[field.name, "awardLevel"]}
                                fieldKey={[field.key, "awardLevel"]}
                                rules={[{ required: true }]}
                              >
                                {renderSelect("awardLevel", {
                                  style: { height: 34, width: "100%" },
                                  disabled: disableFlag,
                                })}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Form.Item
                            label={
                              <span>
                                获奖证书照片{" "}
                                <span style={{ color: "#FE4F54" }}>
                                  （照片大小不超过5M，支持png、jpg或jpeg格式
                                  ，最多上传9张）
                                </span>
                              </span>
                            }
                            colon={true}
                            rules={[{ required: true, message: "请上传照片" }]}
                            valuePropName="fileList"
                            name={[field.name, "photoList"]}
                            fieldKey={[field.key, "photoList"]}
                          >
                            <UploadFiles
                              limit={disableFlag ? 0 : 9}
                              disabled={disableFlag}
                              crop={false}
                              max={5 * 1024}
                              upload={{
                                accept: "image/jpeg,image/jpg,image/png",
                                onPreview: (file) => {
                                  const pictures = form.getFieldValue(
                                    "projectAwardRecords"
                                  )?.[index].photoList;
                                  const urls = getPhotoUrls(pictures);
                                  pictureModal.current?.setPictures(urls);
                                  pictureModal.current?.setPosition(
                                    pictures?.findIndex(
                                      (ele: any) => ele === file
                                    )
                                  );
                                  pictureModal.current?.setVisible(true);
                                },
                              }}
                            >
                              <div className="upload_Image_teacher">
                                <PlusOutlined />
                              </div>
                            </UploadFiles>
                          </Form.Item>
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              )}
              {/* ----------------------------------------论文送审和获奖---------------------------------------- */}
              {disableFlag &&
              dataDetail?.paperSubmitRecords?.length === 0 ? null : (
                <Form.List name="paperSubmitRecords">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item>
                        <Row align="middle">
                          <Col flex={"25px"}>
                            <IconFont
                              type="iconcaiji-bianji"
                              style={{ fontSize: 24 }}
                            ></IconFont>
                          </Col>
                          <Col flex="170px">
                            <b style={titleStyle}>论文送审和获奖</b>
                          </Col>
                          <Col span={5}>
                            <Button
                              type="primary"
                              ghost
                              hidden={disableFlag}
                              size="middle"
                              onClick={() => {
                                if (fields.length < 10) {
                                  add({
                                    paperName: null,
                                    project: null,
                                    rank: null,
                                    awardGradeName: null,
                                    awardUnit: null,
                                    awardData: null,
                                    awardLevel: null,
                                    photoList: [],
                                  });
                                }
                              }}
                              style={{ fontSize: 13 }}
                            >
                              添加项目
                            </Button>
                          </Col>
                        </Row>
                      </Form.Item>
                      {fields.map((field, index) => (
                        <div style={itemDivStyle}>
                          <Row align="middle">
                            <Col span={4}>
                              <IconFont
                                type="iconbulecircle"
                                style={{ fontSize: 25 }}
                              />
                              <b style={{ fontSize: 25, marginLeft: -10 }}>
                                {index < 9 ? "0" + (index + 1) : index + 1}
                              </b>
                            </Col>
                            <Col span={2} offset={18}>
                              <Button
                                danger
                                style={{ background: "#F5F5F5", fontSize: 14 }}
                                onClick={() => {
                                  remove(index);
                                }}
                                size="middle"
                                hidden={disableFlag}
                              >
                                删除
                              </Button>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label={
                                  <span>
                                    论文题目{" "}
                                    <span style={{ color: "#FE4F54" }}>
                                      与文件或证书一致
                                    </span>
                                  </span>
                                }
                                colon={true}
                                name={[field.name, "paperName"]}
                                fieldKey={[field.key, "paperName"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "论文题目不能为空",
                                    whitespace: true,
                                  },
                                ]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="例如，《基于选考命题导向的地理选考复习模式的探究》"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                            <Col span={8} offset={4}>
                              <Form.Item
                                label="参评项目"
                                colon={true}
                                rules={[{ whitespace: true }]}
                                name={[field.name, "project"]}
                                fieldKey={[field.key, "project"]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="例如，萧山区2019年度中小幼教学专题研究论文评比"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label="第几负责人/共几人"
                                validateFirst
                                required={true}
                                colon={true}
                                name={[field.name, "rank"]}
                                fieldKey={[field.key, "rank"]}
                                rules={[
                                  {
                                    validator: getRequire,
                                    message: "请输入",
                                  },
                                  {
                                    message: "请输入正确格式",
                                    pattern: RegExp(
                                      "^(([1-9]{1})|([0-9]{2,5}))/(([1-9]{1})|([0-9]{2,5}))$"
                                    ),
                                  },
                                  {
                                    validator(_, value) {
                                      if (value) {
                                        let arr = value.split("/");
                                        if (Number(arr[0]) > Number(arr[1])) {
                                          return Promise.reject(
                                            "排名不能比总人数多"
                                          );
                                        } else {
                                          return Promise.resolve();
                                        }
                                      } else {
                                        return Promise.resolve();
                                      }
                                    },
                                  },
                                ]}
                              >
                                <Input
                                  disabled={disableFlag}
                                  placeholder="例如，1/3"
                                  maxLength={11}
                                ></Input>
                              </Form.Item>
                            </Col>
                            <Col span={8} offset={4}>
                              <Form.Item
                                label="获奖等级"
                                colon={true}
                                rules={[
                                  { required: true, message: "请选择获奖等级" },
                                ]}
                                name={[field.name, "awardGradeName"]}
                                fieldKey={[field.key, "awardGradeName"]}
                              >
                                <Select
                                  placeholder="请选择"
                                  disabled={disableFlag}
                                  allowClear={true}
                                  onDropdownVisibleChange={getAwardLevels}
                                  onChange={(val, text) =>
                                    onChangeLevel(
                                      val,
                                      text,
                                      "paperSubmitRecords",
                                      "awardGradeName",
                                      index
                                    )
                                  }
                                >
                                  {awardLevels?.map((level) => (
                                    <Select.Option value={level.name}>
                                      {level.name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label="授奖单位"
                                colon={true}
                                name={[field.name, "awardUnit"]}
                                fieldKey={[field.key, "awardUnit"]}
                                rules={[{ required: true, whitespace: true }]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="例如，萧山区教育局"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                            <Col span={8} offset={4}>
                              <Form.Item
                                label="获奖时间"
                                colon={true}
                                rules={[
                                  {
                                    required: true,
                                    message: "请选择获奖时间",
                                  },
                                ]}
                                name={[field.name, "awardData"]}
                                fieldKey={[field.key, "awardData"]}
                              >
                                <DatePicker
                                  disabled={disableFlag}
                                  picker="month"
                                  style={{ width: "100%" }}
                                ></DatePicker>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label="获奖级别"
                                colon={true}
                                name={[field.name, "awardLevel"]}
                                fieldKey={[field.key, "awardLevel"]}
                                rules={[{ required: true }]}
                              >
                                {renderSelect("awardLevel", {
                                  style: { height: 34, width: "100%" },
                                  disabled: disableFlag,
                                })}
                              </Form.Item>
                            </Col>
                          </Row>

                          <Form.Item
                            label={
                              <span>
                                获奖证书照片{" "}
                                <span style={{ color: "#FE4F54" }}>
                                  （照片大小不超过5M，支持png、jpg或jpeg格式
                                  ，最多上传9张）
                                </span>
                              </span>
                            }
                            colon={true}
                            rules={[{ required: true, message: "请上传照片" }]}
                            valuePropName="fileList"
                            name={[field.name, "photoList"]}
                            fieldKey={[field.key, "photoList"]}
                          >
                            <UploadFiles
                              disabled={disableFlag}
                              limit={disableFlag ? 0 : 9}
                              crop={false}
                              max={5 * 1024}
                              upload={{
                                accept: "image/jpeg,image/jpg,image/png",
                                onPreview: (file) => {
                                  const pictures = form.getFieldValue(
                                    "paperSubmitRecords"
                                  )?.[index].photoList;
                                  const urls = getPhotoUrls(pictures);
                                  pictureModal.current?.setPictures(urls);
                                  pictureModal.current?.setPosition(
                                    pictures?.findIndex(
                                      (ele: any) => ele === file
                                    )
                                  );
                                  pictureModal.current?.setVisible(true);
                                },
                              }}
                            >
                              <div className="upload_Image_teacher">
                                <PlusOutlined />
                              </div>
                            </UploadFiles>
                          </Form.Item>
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              )}
              {/* ----------------------------------------论文发表---------------------------------------- */}
              {disableFlag &&
              dataDetail?.paperPublishRecords?.length === 0 ? null : (
                <Form.List name="paperPublishRecords">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item>
                        <Row align="middle">
                          <Col flex={"25px"}>
                            <IconFont
                              type="iconcaiji-bianji"
                              style={{ fontSize: 24 }}
                            ></IconFont>
                          </Col>
                          <Col flex="170px">
                            <b style={titleStyle}>论文发表</b>
                          </Col>
                          <Col span={5}>
                            <Button
                              type="primary"
                              ghost
                              hidden={disableFlag}
                              size="middle"
                              onClick={() => {
                                if (fields.length < 10) {
                                  add({
                                    paperName: null,
                                    journalName: null,
                                    rank: null,
                                    awardData: null,
                                    photoList: [],
                                  });
                                }
                              }}
                              style={{ fontSize: 13 }}
                            >
                              添加项目
                            </Button>
                          </Col>
                        </Row>
                      </Form.Item>

                      {fields.map((field, index) => (
                        <div style={itemDivStyle}>
                          <Row align="middle">
                            <Col span={4}>
                              <IconFont
                                type="iconbulecircle"
                                style={{ fontSize: 25 }}
                              />
                              <b style={{ fontSize: 25, marginLeft: -10 }}>
                                {index < 9 ? "0" + (index + 1) : index + 1}
                              </b>
                            </Col>
                            <Col span={2} offset={18}>
                              <Button
                                danger
                                style={{ background: "#F5F5F5", fontSize: 14 }}
                                onClick={() => {
                                  remove(index);
                                }}
                                size="middle"
                                hidden={disableFlag}
                              >
                                删除
                              </Button>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label={
                                  <span>
                                    论文题目{" "}
                                    <span style={{ color: "#FE4F54" }}>
                                      包括专著出版和论文发表
                                    </span>
                                  </span>
                                }
                                colon={true}
                                name={[field.name, "paperName"]}
                                fieldKey={[field.key, "paperName"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "论文题目不能为空",
                                    whitespace: true,
                                  },
                                ]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="例如，《能读会写夯基础 以文育人养浩气》"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                            <Col span={8} offset={4}>
                              <Form.Item
                                label="发表期刊"
                                colon={true}
                                name={[field.name, "journalName"]}
                                fieldKey={[field.key, "journalName"]}
                                rules={[{ required: true, whitespace: true }]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="例如，语文教学通讯2019年第1期"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label="第几作者/共几人"
                                validateFirst
                                colon={true}
                                name={[field.name, "rank"]}
                                fieldKey={[field.key, "rank"]}
                                required={true}
                                rules={[
                                  {
                                    validator: getRequire,
                                    message: "请输入",
                                  },
                                  {
                                    message: "请输入正确格式",
                                    pattern: RegExp(
                                      "^(([1-9]{1})|([0-9]{2,5}))/(([1-9]{1})|([0-9]{2,5}))$"
                                    ),
                                  },
                                  {
                                    validator(_, value) {
                                      if (value) {
                                        let arr = value.split("/");
                                        if (Number(arr[0]) > Number(arr[1])) {
                                          return Promise.reject(
                                            "排名不能比总人数多"
                                          );
                                        } else {
                                          return Promise.resolve();
                                        }
                                      } else {
                                        return Promise.resolve();
                                      }
                                    },
                                  },
                                ]}
                              >
                                <Input
                                  disabled={disableFlag}
                                  placeholder="例如，1/3"
                                  maxLength={11}
                                ></Input>
                              </Form.Item>
                            </Col>
                            <Col span={8} offset={4}>
                              <Form.Item
                                label="发表时间"
                                colon={true}
                                rules={[
                                  {
                                    required: true,
                                    message: "请选择发表时间",
                                  },
                                ]}
                                name={[field.name, "awardData"]}
                                fieldKey={[field.key, "awardData"]}
                              >
                                <DatePicker
                                  disabled={disableFlag}
                                  picker="month"
                                  style={{ width: "100%" }}
                                ></DatePicker>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Form.Item
                            label={
                              <span>
                                期刊照片{" "}
                                <span style={{ color: "#FE4F54" }}>
                                  （封面、目录、正文照片，大小不超过5M，支持png、jpg或jpeg格式
                                  ，最多上传9张）
                                </span>
                              </span>
                            }
                            colon={true}
                            rules={[{ required: true, message: "请上传照片" }]}
                            valuePropName="fileList"
                            name={[field.name, "photoList"]}
                            fieldKey={[field.key, "photoList"]}
                          >
                            <UploadFiles
                              limit={disableFlag ? 0 : 9}
                              crop={false}
                              max={5 * 1024}
                              disabled={disableFlag}
                              upload={{
                                accept: "image/jpeg,image/jpg,image/png",
                                onPreview: (file) => {
                                  const pictures = form.getFieldValue(
                                    "paperPublishRecords"
                                  )?.[index].photoList;
                                  const urls = getPhotoUrls(pictures);
                                  pictureModal.current?.setPictures(urls);
                                  pictureModal.current?.setPosition(
                                    pictures?.findIndex(
                                      (ele: any) => ele === file
                                    )
                                  );
                                  pictureModal.current?.setVisible(true);
                                },
                              }}
                            >
                              <div className="upload_Image_teacher">
                                <PlusOutlined />
                              </div>
                            </UploadFiles>
                          </Form.Item>
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              )}
              {/* ----------------------------------------校内外公开课---------------------------------------- */}
              {disableFlag &&
              dataDetail?.openCourseRecords?.length === 0 ? null : (
                <Form.List name="openCourseRecords">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item>
                        <Row align="middle">
                          <Col flex={"25px"}>
                            <IconFont
                              type="iconcaiji-bianji"
                              style={{ fontSize: 24 }}
                            ></IconFont>
                          </Col>
                          <Col flex="170px">
                            <b style={titleStyle}>校内外公开课</b>
                          </Col>
                          <Col span={5}>
                            <Button
                              type="primary"
                              ghost
                              size="middle"
                              hidden={disableFlag}
                              onClick={() => {
                                if (fields.length < 10) {
                                  add({
                                    courseName: null,
                                    awardData: null,
                                    hostUnit: null,
                                    photoList: [],
                                  });
                                }
                              }}
                              style={{ fontSize: 13 }}
                            >
                              添加项目
                            </Button>
                          </Col>
                        </Row>
                      </Form.Item>
                      {fields.map((field, index) => (
                        <div style={itemDivStyle}>
                          <Row align="middle">
                            <Col span={4}>
                              <IconFont
                                type="iconbulecircle"
                                style={{ fontSize: 25 }}
                              />
                              <b style={{ fontSize: 25, marginLeft: -10 }}>
                                {index < 9 ? "0" + (index + 1) : index + 1}
                              </b>
                            </Col>
                            <Col span={2} offset={18}>
                              <Button
                                danger
                                style={{ background: "#F5F5F5", fontSize: 14 }}
                                onClick={() => {
                                  remove(index);
                                }}
                                hidden={disableFlag}
                                size="middle"
                              >
                                删除
                              </Button>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label="公开课课题"
                                colon={true}
                                name={[field.name, "courseName"]}
                                fieldKey={[field.key, "courseName"]}
                                rules={[{ required: true, whitespace: true }]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="请输入"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                            <Col span={8} offset={4}>
                              <Form.Item
                                label="开课时间"
                                colon={true}
                                name={[field.name, "awardData"]}
                                fieldKey={[field.key, "awardData"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "请选择开课时间",
                                  },
                                ]}
                              >
                                <DatePicker
                                  disabled={disableFlag}
                                  picker="month"
                                  style={{ width: "100%" }}
                                ></DatePicker>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label="主办单位"
                                colon={true}
                                name={[field.name, "hostUnit"]}
                                fieldKey={[field.key, "hostUnit"]}
                                rules={[{ required: true, whitespace: true }]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="请输入"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Form.Item
                            label={
                              <span>
                                证书照片{" "}
                                <span style={{ color: "#FE4F54" }}>
                                  （照片大小不超过5M，支持png、jpg或jpeg格式
                                  ，最多上传9张）
                                </span>
                              </span>
                            }
                            colon={true}
                            rules={[{ required: true, message: "请上传照片" }]}
                            valuePropName="fileList"
                            name={[field.name, "photoList"]}
                            fieldKey={[field.key, "photoList"]}
                          >
                            <UploadFiles
                              limit={disableFlag ? 0 : 9}
                              disabled={disableFlag}
                              crop={false}
                              max={5 * 1024}
                              upload={{
                                accept: "image/jpeg,image/jpg,image/png",
                                onPreview: (file) => {
                                  const pictures = form.getFieldValue(
                                    "openCourseRecords"
                                  )?.[index].photoList;
                                  const urls = getPhotoUrls(pictures);
                                  pictureModal.current?.setPictures(urls);
                                  pictureModal.current?.setPosition(
                                    pictures?.findIndex(
                                      (ele: any) => ele === file
                                    )
                                  );
                                  pictureModal.current?.setVisible(true);
                                },
                              }}
                            >
                              <div className="upload_Image_teacher">
                                <PlusOutlined />
                              </div>
                            </UploadFiles>
                          </Form.Item>
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              )}
              {/* ----------------------------------------校内外讲座---------------------------------------- */}
              {disableFlag &&
              dataDetail?.lectureRecords?.length === 0 ? null : (
                <Form.List name="lectureRecords">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item>
                        <Row align="middle">
                          <Col flex={"25px"}>
                            <IconFont
                              type="iconcaiji-bianji"
                              style={{ fontSize: 24 }}
                            ></IconFont>
                          </Col>
                          <Col flex="170px">
                            <b style={titleStyle}>校内外讲座</b>
                          </Col>
                          <Col span={5}>
                            <Button
                              type="primary"
                              hidden={disableFlag}
                              ghost
                              size="middle"
                              onClick={() => {
                                if (fields.length < 10) {
                                  add({
                                    lectureName: null,
                                    awardData: null,
                                    hostUnit: null,
                                    photoList: [],
                                  });
                                }
                              }}
                              style={{ fontSize: 13 }}
                            >
                              添加项目
                            </Button>
                          </Col>
                        </Row>
                      </Form.Item>
                      {fields.map((field, index) => (
                        <div style={itemDivStyle}>
                          <Row align="middle">
                            <Col span={4}>
                              <IconFont
                                type="iconbulecircle"
                                style={{ fontSize: 25 }}
                              />
                              <b style={{ fontSize: 25, marginLeft: -10 }}>
                                {index < 9 ? "0" + (index + 1) : index + 1}
                              </b>
                            </Col>
                            <Col span={2} offset={18}>
                              <Button
                                danger
                                style={{ background: "#F5F5F5", fontSize: 14 }}
                                onClick={() => {
                                  remove(index);
                                }}
                                size="middle"
                                hidden={disableFlag}
                              >
                                删除
                              </Button>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label="讲座标题"
                                colon={true}
                                name={[field.name, "lectureName"]}
                                fieldKey={[field.key, "lectureName"]}
                                rules={[{ required: true, whitespace: true }]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="请输入"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                            <Col span={8} offset={4}>
                              <Form.Item
                                label="举办时间"
                                colon={true}
                                name={[field.name, "awardData"]}
                                fieldKey={[field.key, "awardData"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "请选择举办时间",
                                  },
                                ]}
                              >
                                <DatePicker
                                  disabled={disableFlag}
                                  picker="month"
                                  style={{ width: "100%" }}
                                ></DatePicker>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label="主办单位"
                                colon={true}
                                name={[field.name, "hostUnit"]}
                                fieldKey={[field.key, "hostUnit"]}
                                rules={[{ required: true, whitespace: true }]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="请输入"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Form.Item
                            label={
                              <span>
                                证书照片{" "}
                                <span style={{ color: "#FE4F54" }}>
                                  （照片大小不超过5M，支持png、jpg或jpeg格式
                                  ，最多上传9张）
                                </span>
                              </span>
                            }
                            colon={true}
                            rules={[{ required: true, message: "请上传照片" }]}
                            valuePropName="fileList"
                            name={[field.name, "photoList"]}
                            fieldKey={[field.key, "photoList"]}
                          >
                            <UploadFiles
                              limit={disableFlag ? 0 : 9}
                              crop={false}
                              disabled={disableFlag}
                              max={5 * 1024}
                              upload={{
                                accept: "image/jpeg,image/jpg,image/png",
                                onPreview: (file) => {
                                  const pictures = form.getFieldValue(
                                    "lectureRecords"
                                  )?.[index].photoList;
                                  const urls = getPhotoUrls(pictures);
                                  pictureModal.current?.setPictures(urls);
                                  pictureModal.current?.setPosition(
                                    pictures?.findIndex(
                                      (ele: any) => ele === file
                                    )
                                  );
                                  pictureModal.current?.setVisible(true);
                                },
                              }}
                            >
                              <div className="upload_Image_teacher">
                                <PlusOutlined />
                              </div>
                            </UploadFiles>
                          </Form.Item>
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              )}
              {/* ----------------------------------------各类荣誉---------------------------------------- */}
              {disableFlag && dataDetail?.honorRecords?.length === 0 ? null : (
                <Form.List name="honorRecords">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item>
                        <Row align="middle">
                          <Col flex={"25px"}>
                            <IconFont
                              type="iconcaiji-bianji"
                              style={{ fontSize: 24 }}
                            ></IconFont>
                          </Col>
                          <Col flex="170px">
                            <b style={titleStyle}>各类荣誉</b>
                          </Col>
                          <Col span={5}>
                            <Button
                              type="primary"
                              ghost
                              size="middle"
                              hidden={disableFlag}
                              onClick={() => {
                                if (fields.length < 10) {
                                  add({
                                    honorName: null,
                                    awardData: null,
                                    hostUnit: null,
                                    photoList: [],
                                  });
                                }
                              }}
                              style={{ fontSize: 13 }}
                            >
                              添加项目
                            </Button>
                          </Col>
                        </Row>
                      </Form.Item>
                      {fields.map((field, index) => (
                        <div style={itemDivStyle}>
                          <Row align="middle">
                            <Col span={4}>
                              <IconFont
                                type="iconbulecircle"
                                style={{ fontSize: 25 }}
                              />
                              <b style={{ fontSize: 25, marginLeft: -10 }}>
                                {index < 9 ? "0" + (index + 1) : index + 1}
                              </b>
                            </Col>
                            <Col span={2} offset={18}>
                              <Button
                                danger
                                style={{ background: "#F5F5F5", fontSize: 14 }}
                                onClick={() => {
                                  remove(index);
                                }}
                                size="middle"
                                hidden={disableFlag}
                              >
                                删除
                              </Button>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label="荣誉名称"
                                colon={true}
                                name={[field.name, "honorName"]}
                                fieldKey={[field.key, "honorName"]}
                                rules={[{ required: true, whitespace: true }]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="请输入"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                            <Col span={8} offset={4}>
                              <Form.Item
                                label="颁发时间"
                                colon={true}
                                name={[field.name, "awardData"]}
                                fieldKey={[field.key, "awardData"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "请选择颁发时间",
                                  },
                                ]}
                              >
                                <DatePicker
                                  disabled={disableFlag}
                                  picker="month"
                                  style={{ width: "100%" }}
                                ></DatePicker>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row style={{ marginTop: 10 }}>
                            <Col span={8}>
                              <Form.Item
                                label="主办单位"
                                colon={true}
                                name={[field.name, "hostUnit"]}
                                fieldKey={[field.key, "hostUnit"]}
                                rules={[{ required: true, whitespace: true }]}
                              >
                                <TextArea
                                  autoSize
                                  disabled={disableFlag}
                                  placeholder="请输入"
                                  maxLength={50}
                                ></TextArea>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Form.Item
                            label={
                              <span>
                                证书照片{" "}
                                <span style={{ color: "#FE4F54" }}>
                                  （照片大小不超过5M，支持png、jpg或jpeg格式
                                  ，最多上传9张）
                                </span>
                              </span>
                            }
                            colon={true}
                            rules={[{ required: true, message: "请上传照片" }]}
                            valuePropName="fileList"
                            name={[field.name, "photoList"]}
                            fieldKey={[field.key, "photoList"]}
                          >
                            <UploadFiles
                              limit={disableFlag ? 0 : 9}
                              crop={false}
                              max={5 * 1024}
                              disabled={disableFlag}
                              upload={{
                                accept: "image/jpeg,image/jpg,image/png",
                                onPreview: (file) => {
                                  const pictures = form.getFieldValue(
                                    "honorRecords"
                                  )?.[index].photoList;
                                  const urls = getPhotoUrls(pictures);
                                  pictureModal.current?.setPictures(urls);
                                  pictureModal.current?.setPosition(
                                    pictures?.findIndex(
                                      (ele: any) => ele === file
                                    )
                                  );
                                  pictureModal.current?.setVisible(true);
                                },
                              }}
                            >
                              <div className="upload_Image_teacher">
                                <PlusOutlined />
                              </div>
                            </UploadFiles>
                          </Form.Item>
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              )}
              {/* ----------------------------------------年度荣誉获奖加分情况---------------------------------------- */}
              {disableFlag &&
              dataDetail?.bonusRecords?.every(
                (e) => e.flag === false
              ) ? null : (
                <div>
                  <Divider plain style={{ color: "#909499", fontSize: 12 }}>
                    荣誉加分项
                  </Divider>
                  <Row align="middle" style={{ marginBottom: 18 }}>
                    <Col flex={"25px"}>
                      <IconFont
                        type="iconcaiji-bianji"
                        style={{ fontSize: 24 }}
                      ></IconFont>
                    </Col>
                    <Col flex={"270px"}>
                      <b style={titleStyle}>年度荣誉获奖加分情况</b>
                    </Col>
                  </Row>
                  <div>
                    <p style={{ color: "#303133" }}>选择荣誉项目(支持多选)：</p>
                    <Form.List name="bonusRecords">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map((field, index) => {
                            return (
                              <div>
                                <Form.Item
                                  style={{ marginBottom: 0 }}
                                  hidden={
                                    disableFlag &&
                                    !dataDetail?.bonusRecords?.[index].flag
                                  }
                                  valuePropName="checked"
                                  name={[field.name, "flag"]}
                                  fieldKey={[field.key, "flag"]}
                                >
                                  <Checkbox
                                    disabled={disableFlag}
                                    style={{ color: "#616266" }}
                                    onChange={(e) => {
                                      let copyForm = form;
                                      let copyList = copyForm.getFieldValue(
                                        "bonusRecords"
                                      );
                                      copyList[index].flag = e.target.checked;
                                      copyForm.setFields([
                                        "bonusRecords",
                                        copyList,
                                      ]);
                                      form.setFieldsValue(copyForm);
                                    }}
                                  >
                                    {
                                      form.getFieldValue("bonusRecords")[index]
                                        .itemName
                                    }
                                  </Checkbox>
                                </Form.Item>
                                {form.getFieldValue("bonusRecords")[index]
                                  .flag &&
                                form.getFieldValue("bonusRecords")[index]
                                  .itemType === 1 ? (
                                  <Row>
                                    <Col span={6}>
                                      <Form.Item
                                        colon={true}
                                        style={{ marginBottom: 10 }}
                                        name={[field.name, "awardData"]}
                                        fieldKey={[field.key, "awardData"]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "请选择获奖时间",
                                          },
                                        ]}
                                      >
                                        <DatePicker
                                          disabled={disableFlag}
                                          picker="month"
                                          placeholder="请选择获奖时间"
                                          style={{ width: "100%" }}
                                        ></DatePicker>
                                      </Form.Item>
                                    </Col>
                                    <Col span={6} offset={2}>
                                      <Form.Item
                                        colon={true}
                                        style={{ marginBottom: 0 }}
                                        name={[field.name, "hostUnit"]}
                                        fieldKey={[field.key, "hostUnit"]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "请填写主办单位",
                                            whitespace: true,
                                          },
                                        ]}
                                      >
                                        <TextArea
                                          autoSize
                                          disabled={disableFlag}
                                          maxLength={50}
                                          placeholder="请填写主办单位"
                                        ></TextArea>
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                ) : null}
                                {form.getFieldValue("bonusRecords")[index]
                                  .flag &&
                                form.getFieldValue("bonusRecords")[index]
                                  .itemType === 2 ? (
                                  <div>
                                    <Row>
                                      <Col span={6}>
                                        <Form.Item
                                          colon={true}
                                          style={{ marginBottom: 10 }}
                                          name={[field.name, "awardData"]}
                                          fieldKey={[field.key, "awardData"]}
                                          rules={[
                                            {
                                              required: true,
                                              message: "请选择发表时间",
                                            },
                                          ]}
                                        >
                                          <DatePicker
                                            picker="month"
                                            disabled={disableFlag}
                                            placeholder="请选择发表时间"
                                            style={{ width: "100%" }}
                                          ></DatePicker>
                                        </Form.Item>
                                      </Col>
                                      <Col span={6} offset={2}>
                                        <Form.Item
                                          colon={true}
                                          style={{ marginBottom: 0 }}
                                          name={[field.name, "hostUnit"]}
                                          fieldKey={[field.key, "hostUnit"]}
                                          rules={[
                                            {
                                              required: true,
                                              whitespace: true,
                                              message: "请填写发表刊物",
                                            },
                                          ]}
                                        >
                                          <TextArea
                                            autoSize
                                            disabled={disableFlag}
                                            maxLength={50}
                                            placeholder="请填写发表刊物"
                                          ></TextArea>
                                        </Form.Item>
                                      </Col>
                                    </Row>

                                    <Row>
                                      <Col span={6}>
                                        <Form.Item
                                          colon={true}
                                          style={{ marginBottom: 10 }}
                                          name={[field.name, "rank"]}
                                          fieldKey={[field.key, "rank"]}
                                          required={true}
                                          validateFirst
                                          rules={[
                                            {
                                              validator: getRequire,
                                              message: "请输入",
                                            },
                                            {
                                              message: "请输入正确格式",
                                              pattern: RegExp(
                                                "^(([1-9]{1})|([0-9]{2,5}))/(([1-9]{1})|([0-9]{2,5}))$"
                                              ),
                                            },
                                            {
                                              validator(_, value) {
                                                if (value) {
                                                  let arr = value.split("/");
                                                  if (
                                                    Number(arr[0]) >
                                                    Number(arr[1])
                                                  ) {
                                                    return Promise.reject(
                                                      "排名不能比总人数多"
                                                    );
                                                  } else {
                                                    return Promise.resolve();
                                                  }
                                                } else {
                                                  return Promise.resolve();
                                                }
                                              },
                                            },
                                          ]}
                                        >
                                          <Input
                                            disabled={disableFlag}
                                            placeholder="请填写第几负责人/共几人"
                                            maxLength={11}
                                          ></Input>
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                  </div>
                                ) : null}
                                {form.getFieldValue("bonusRecords")[index]
                                  .flag ? (
                                  <div>
                                    <Form.Item
                                      style={{ marginBottom: 0 }}
                                      colon={true}
                                      rules={[
                                        {
                                          required: true,
                                          message: "请上传照片",
                                        },
                                      ]}
                                      valuePropName="fileList"
                                      name={[field.name, "photoList"]}
                                      fieldKey={[field.key, "photoList"]}
                                    >
                                      <UploadFiles
                                        limit={disableFlag ? 0 : 9}
                                        crop={false}
                                        disabled={disableFlag}
                                        max={5 * 1024}
                                        upload={{
                                          accept:
                                            "image/jpeg,image/jpg,image/png",
                                          onPreview: (file) => {
                                            const pictures = form.getFieldValue(
                                              "bonusRecords"
                                            )?.[index].photoList;
                                            const urls = getPhotoUrls(pictures);
                                            pictureModal.current?.setPictures(
                                              urls
                                            );
                                            pictureModal.current?.setPosition(
                                              pictures?.findIndex(
                                                (ele: any) => ele === file
                                              )
                                            );
                                            pictureModal.current?.setVisible(
                                              true
                                            );
                                          },
                                        }}
                                      >
                                        <div className="upload_Image_teacher">
                                          <PlusOutlined />
                                        </div>
                                      </UploadFiles>
                                    </Form.Item>
                                    <span
                                      style={{
                                        color: "#FE4F54",
                                        fontSize: 12,
                                      }}
                                    >
                                      {form.getFieldValue("bonusRecords")[index]
                                        .type === 1
                                        ? "照片大小不超过5M，支持png、jpg或jpeg格式，最多上传9张"
                                        : "封面、目录、正文照片，大小不超过5M，支持png、jpg或jpeg格式 ，最多上传9张"}
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </>
                      )}
                    </Form.List>
                  </div>
                </div>
              )}
            </Form>
            {dataDetail?.state !== -2 && dataDetail?.state !== undefined
              ? renderStep(dataDetail)
              : null}
            <CustomAwardLevelModal
              onRef={(ref) => (levelModal.current = ref)}
              onOk={(data) => {
                if (data.name !== "") {
                  let copyForm = form.getFieldValue(data.listName);
                  copyForm[data.index][data.itemName] = data.name;
                  form.setFieldsValue({
                    [data.listName]: copyForm,
                  });
                } else {
                  let copyForm = form.getFieldValue(data.listName);
                  copyForm[data.index][data.itemName] = null;
                  form.setFieldsValue({
                    [data.listName]: copyForm,
                  });
                }
              }}
            />
            <VerifyAwardModal
              onRef={(ref) => (verifyModal.current = ref)}
              onOk={(data) => {
                if (data.result === 1) {
                  approvalTeacherReport(1);
                } else {
                  approvalTeacherReport(2, data.content);
                }
              }}
            />
            <UpdateConfirmModal
              onRef={(ref) => {
                updateModal.current = ref;
              }}
              onOk={() => {
                updateRecord();
              }}
            />
            <PicturesShow
              onRef={(ref) => {
                pictureModal.current = ref;
              }}
            ></PicturesShow>
          </div>
        </div>
      </div>
      <div
        style={
          props.onCancel
            ? {
                position: "fixed",
                bottom: 0,
                width: 1000,
                height: "74px",
                backgroundColor: "white",
                marginLeft: 69,
                paddingTop: 30,
              }
            : {
                position: "fixed",
                bottom: 0,
                width: 1050,
                height: "74px",
                backgroundColor: "white",
                left: "calc(50% + 90px)",
                marginLeft: -500,
                paddingTop: 30,
              }
        }
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {dataDetail?.state === -2 ? (
            <Button
              type="primary"
              size="large"
              onClick={() => {
                submitRecord();
              }}
            >
              提交
            </Button>
          ) : null}
          {dataDetail?.active && props.roleType === "2" ? (
            <Button
              type="primary"
              size="large"
              onClick={() => {
                verifyModal.current?.setVerifyType(2);
                verifyModal.current?.setVisible(true);
              }}
            >
              审批
            </Button>
          ) : null}
          {(dataDetail?.state === 2 || dataDetail?.state === -1) &&
          props.roleType === "1" ? (
            <Button
              type="primary"
              size="large"
              onClick={() => {
                //驳回状态下 显示弹窗
                if (dataDetail?.state === 2) {
                  updateModal.current?.setVisible(true);
                } else {
                  updateRecord();
                }
              }}
            >
              {dataDetail?.state === 2 ? "再次提交" : "确认修改"}
            </Button>
          ) : null}
          {dataDetail?.state === -2 ? (
            <Button
              type="primary"
              ghost
              size="large"
              style={{ marginLeft: 10 }}
              onClick={() => {
                saveRecord();
              }}
            >
              暂存
            </Button>
          ) : null}
          <Button
            style={{ marginLeft: 10 }}
            size="large"
            onClick={() => {
              if (props.onCancel) {
                if (!disableFlag) {
                  Modal.confirm({
                    title: "提示",
                    content: "离开当前页面不会保存修改内容，确定离开吗？",
                    okText: "确认离开",
                    cancelText: "留在此页",
                    onOk() {
                      props.onCancel();
                    },
                  });
                } else {
                  props.onCancel();
                }
              } else {
                history.goBack();
              }
            }}
          >
            取消
          </Button>
        </div>
      </div>
    </div>
  );
}
