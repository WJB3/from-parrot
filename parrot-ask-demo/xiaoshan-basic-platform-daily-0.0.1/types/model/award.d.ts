/**
 * 获奖列表model
 */

import GT from "types";

export interface AwardTaskModel {
  name: string;
  year: number;
  // 接收对象人数
  num: number;
  // 填报具体时间
  startTime: string;
  endTime: string;
  status: number;
  id: number;
}

/**
 * 填报列表model
 */

export interface ReportListModel {
  name: string;
  // 填报具体时间
  startTime: string;
  endTime: string;
  // 任务状态
  status: number;
  // 提交状态
  state: number;
  taskId: number;
  //1:学生 2:老师
  type:number;
  // 任务整体状态 true 一致
  taskState: boolean;
  // 任务传值
  title: string;
}


/**
 * 获奖评分列表
 */

 export interface AwardPointModel {
   // 获奖等级
  awardLevelName: string;
  // 竞赛级别
  contestLevel: number;
  contestName: string;
  // 竞赛类型
  contestType: number;
  id: number;
  recordCount: number;
  score: number;
 }

 /**
  *  学生竞赛获奖等级model
  */

  export interface AwardLevelModel {
    id: number;
    name: string;
  }

  /**
 * 我的填报详情
 */

export interface ReporAwardDetailModel {
  // recordId
  id: number;
  // 标题名称
  title: string;
  // 是否是当前审批人
  active: boolean;
  // 任务Id
  taskId?: number;
  // 教师
  applyTeacher: string;
  // 表单提交时间
  applyTime: string;
  // 获奖时间
  detailDate: string;
  // 获奖等级
  awardLevelName: string;
  contestLevel: number;
  contestType: number;
  contestName: string;
  // 获奖奖励 只有审批通过才有
  awardContent?: string;
  // 颁奖部门
  department: string;
  studentNames: string;
  students: GT.Model.Student[];
  teacherNames: string;
  teachers: GT.Model.Teacher[];
  // 获奖类型 1: 个人奖 2: 多人参与 3: 团体奖
  type: number;
  // 获奖照片
  awardFileId: number;
  awardFileUrl: string;
  // 提交编号
  serialNumber: string;
  // 审批人
  nodes: GT.DTO.Node[];
  // 抄送人
  carbonCopies: GT.DTO.CarbonCopy[];
    /**
   * -2:未提交
   * -1:待审批
   * 0:审批中
   * 1: 已通过
   * 2: 已驳回
   */
  state: -2 | -1 | 0 | 1 | 2;
    /**
   * 0: 未开始
   * 1: 进行中
   * 2: 已结束
   */
  status: 0 | 1 | 2;
}

// 审批节点
export interface NodesModel {
  approver: string;
  // 审批时间
  approvalTime?: string;
  state: number;
}

// 教师填报汇总
export interface TearchSummary {
  // 教研组
  groupId: number;
  // ic卡号
  icCardNo: string;
  // 记录id
  id: number;
  // 加分荣誉数量
  itemNum?: number;
  // -2未提交、-1待审批、0审批中、1已通过、2已驳回
  state?: number;
  // 提交状态 1:未提交 2:已提交
  status: number;
  // 考核提交数量
  submitNum?: number;
  // 教师名字
  teacherName?: string;
}