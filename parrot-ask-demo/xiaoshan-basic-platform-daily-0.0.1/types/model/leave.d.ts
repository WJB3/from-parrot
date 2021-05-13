import GT from "types";

// 请假名单model
export interface Leave {
  // 
  timeId: number;
  // 审批人
  approvalName?: string;
  // 销假日期
  clearDate?: string;
  // 返校日期
  cancelDate?: string;
  // 销假经办人
  cancelPerson?: string;
  // 班级
  className: string;
  // 发起时间
  createdTime: string;
  // 请假时间起
  startTime: string;
  // 请假时间止
  endTime: string;
  // 归寝设置
  goBed: number;
  // 是否周期请假：0是1否
  isCycle: boolean;
  // 请假类型
  leaveType: number;
  // 重复日期
  repeatDate?: string;
  // 重复请假时间段止
  repeatEnd?: string;
  // 重复请假时间段起
  repeatStart?: string;
  // 审批编号
  serialNumber: number;
  // 学生姓名
  studentName: string;
  // 学生类型 
  studentType: number;
  // 请假记录id
  recordId: number;
  // 日期
  recordTime: string;
}

// 请假记录
export interface LeaveHistory {
  // 班级
  className: string;
  // 审批编号
  serialNumber: number;
  // 发起时间
  createdTime: string;
  // 请假记录id
  id: number;
  // 归寝设置
  goBed: number;
  // 是否周期请假
  isCycle: boolean;
  // 请假时长
  leaveHours: number;
  // 请假事由
  leaveReason: string;
  // 请假类型
  leaveType: number;
  // 重复日期：例：周一周二重复，则1;2，以分号分割
  repeatDate: string;
  // 重复请假时间段止
  repeatEnd: string;
  // 重复请假时间段起
  repeatStart: string;
  // 请假开始时间
  startTime: string;
  // 请假结束时间
  endTime: string;
  // 审批状态：-1待审批0审批中1已通过2已驳回
  state: number;
  // 学生姓名
  studentName: string;
  // 学生类型
  studentType: number;
  // 学生类型名称
  studentTypeName: string;
  // 是否需要加签
  needCountersignature: boolean;
  // 是否还有未销假
  needEarlyBack: boolean;
  // 年级
  enrollmentYear: number;
  // 年段
  sectionId: number;
}

export interface LeaveDetail {
   // 当前节点是否活跃
   active: boolean;
   // 提交时间
   applyTime: string;
   // 发起人id
   bizId: number;
   // 发起人姓名
   bizName: string;
   // 抄送人信息
   copyNodes: GT.DTO.CarbonCopy[];
   // 审批人流程信息
   nodes: GT.DTO.Node[];
    
    // 归寝设置
    goBed: number;
    // 是否周期请假
    isCycle: boolean;
    // 请假时长
    leaveHours: number;
    // 请假事由
    leaveReason: string;
    // 请假类型
    leaveType: number;
    // 重复日期：例：周一周二重复，则1;2，以分号分割
    repeatDate: string;
    // 重复请假时间段止
    repeatEnd: string;
    // 重复请假时间段起
    repeatStart: string;
    // 请假开始时间
    startTime: string;
    // 请假结束时间
    endTime: string;
    // 学生姓名逗号拼接
    studentNames: string;
    // 流程审批状态
    state: number;
    // 学生信息
    studentInfos: GT.Model.Student[];
    // 加签人信息
    approverInfos: GT.Model.Teacher[];
    // 是否需要加签
    needCountersignature: boolean;
    // 是否显示审批按钮
    enableApproval: boolean;
    // 
    recordId: number;
}

// 统计信息
export interface LeaveCount {
  counts: LeaveSummary[];
  // 入学年份
  enrollmentYear: number;
  // 年级请假人数
  gradeLeaveCount: number;
  // 年级名称
  gradeName: string;
  // 年级下的班级列表
  classes: summayClassInfo[];
}

export interface LeaveSummary {
  classId: number;
  // 班级请假人数
  classLeaveCount: number;
  // 班级名称
  className: string;
  // 临时请假
  commLeave: number;
  // 周期请假
  cycleLeave: number;
  // 事假
  eventLeave: number;
  // 通校生
  generalStudent: number;
  // 归寝
  goBed: number;
  // 课间操
  intervalExercises: number;
  // 离寝
  notGoBed: number;
  // 班级序号
  orderNumber: number;
  // 住校生
  residentStudent: number;
  // 病假
  sickLeave: number;
  // 是否隐藏, 年级组试用
  isHidden: boolean;

  // 课间操-事假
  eventLeaveReason: number;
  // 课间操-长期病假
  loneTermSickReason: number;
  // 课间操-临时病假
  temporarySickReason: number;
  // 课间操-生理期假
  physiologicalPeriodReason: number;
  // 课间操-其他
  otherReason: number;
}

export interface summayClassInfo {
  name: string;
  id: number;
}