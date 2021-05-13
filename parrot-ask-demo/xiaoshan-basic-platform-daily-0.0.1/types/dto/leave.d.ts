import GT from "types";

// 查询请假名单
export interface SearchLeaveListParmas {
  // 学生姓名
  studentName?: string;
  // 入学年份
  enrollmentYear?: number;
  // 学段id
  sectionId?: number;
  // 班级id
  classId?: number;
  // 归寝设置
  goBed?: number;
  // 请假类型
  leaveType?: number;
  // 请假时间起
  startTIme?: string;
  // 请假时间止
  endTime?: string;
  current?: number;           // 页码
  size?: number;              // 每页大小
}

// 发起请假
export interface CreateLeaveDto {
  // 归寝设置
  goBed: number;
  // 是否周期请假:0是1否
  isCycle: number;
  // 请假事由
  leaveReason: string;
  // 请假类型
  leaveType: number;
  // 请假时长
  leaveHours: number;
  // 请假结束时间
  endTime: string;
  // 请假开始时间
  startTime: string;
  // 重复日期
  repeatDate: string;
  // 重复请假时间段止
  repeatEnd: string;
  // 重复请假时间段起
  repeatStart: string;
  // 审批人员
  teacherId: number;
  // 学生
  studentIds: {id: number, type: number}[];
  // 学生
  studentNames: string;
}

// 查询请假记录
export interface SearchLeaveHistoryParmas {
  // 学生姓名
  studentName?: string;
  // 入学年份
  enrollmentYear?: number;
  // 学段id
  sectionId?: number;
  // 班级id
  classId?: number;
  // 审批编号
  serialNumber?: string;
  // 请假类型
  leaveType?: number;
  // 请假时间起
  startTIme?: string;
  // 请假时间止
  endTime?: string;
  // 审批状态：-1待审批0审批中1已通过2已驳回
  state?: number;
  current?: number;           // 页码
  size?: number;              // 每页大小
}

// 查询请假统计
export interface SearchLeaveSummaryParmas {
  // 班级id
  classId?: number;
  // 时间范围：0昨天1今天2明天3本周4本月
  timeRange?: number;
  // 开始时间
  startTime?: string;
  // 结束时间
  endTime?: string;
}