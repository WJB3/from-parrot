import moment from "moment";
import { Teacher } from "types/model/teacher";
/**
 * 学生获奖列表查询
 */
export interface SearchAwardTaskParams {
  current?: number;
  size?: number;
  year?: number;
  name?: string;
  status?: number;
}

/**
 *  获奖接收对象接收
 */
export interface SearchAwardReceivePersonParams {
  current?: number;
  size?: number;
  departmentIds?: number;
  name?: string;
  taskId?: number;
}

/**
 *  得分搜索参数
 */
export interface SeacherAwardPointParams {
  // 获奖等级
  awardLevelId?: number;
  // 竞赛级别
  contestLevel?: number;
  contestName?: string;
  // 竞赛类型
  contestType?: number;
  taskId: number;
  current?: number;
  size?: number;
}

export interface SeacherAwardPointExptParams {
  // 获奖等级
  awardLevelName?: string;
  // 竞赛级别
  contestLevel?: number;
  contestName?: string;
  // 竞赛类型
  contestType?: number;
}

/**
 *  我的填报搜索参数
 */
export interface SeacherAwardReportParams {
  // 教师Id
  id: number;
  // 任务名称
  name?: number;
  state?: number;
  current?: number;
  size?: number;
}

export interface SearchMyAwardReportParams {
  current?: number;
  size?: number;
  taskId?: number;
}

/**
 *  汇总列表参数查询
 */
export interface SeacherAwardRecordParams {
  // taskId
  taskId: number;
  awardLevelId?: number;
  contestLevel?: number;
  contestName?: string;
  contestType?: number;
  state?: number;
  studentName?: string;
  teacherName?: string;
  current?: number;
  size?: number;
}

/**
 * 新增任务详情
 */
export interface CreateTaskParams {
  id?: string;
  allTeacher: boolean;
  name: string;
  year: string;
  startTime: string;
  endTime: string;
  teacherIds?: any[];
  type: number;
  num?: number;
  // 任务状态 0 1 2
  status?: number;
  teacherName?: string[];
  teacherVOS?: GT.Model.Teacher[];
}

/**
 *  学生竞赛填报信息info
 */
export interface CreateStudentReportAwardDto {
  // 任务id
  id?: number;
  // 填报id
  recordId?: number;
  // 上传奖状
  awardFileId: number;
  // 获奖等级
  awardLevelName: string;
  contestLevel: number;
  contestType: number;
  contestName: string;
  // 颁奖部门
  department: string;
  detailDate: string;
  // isCustom: number;
  students: string;
  teachers: string;
  type: number;
}

export interface VerifyAwardRecordParams {
  recordId: number;
  content: string;
  // 1通过 2驳回

  resultState: number;
  // 任务Id
  id?: number;
  // 上传奖状
  awardFileId?: number;
  // 获奖等级
  awardLevelName?: string;
  contestLevel?: number;
  contestType?: number;
  contestName?: string;
  // 颁奖部门
  department?: string;
  detailDate?: string;
  isCustom?: number;
  students?: string;
  teachers?: string;
  type?: number;
  // 是否有修改 0 无 1 有
  changed: number;
  resultState: number;
}

/**
 * 教师填报 接收详情 类
 */
export interface TeacherReportDetail {
  //判断是否需要审批
  active: boolean;
  //id(判断是否提交过，存在就是提交过)
  id?: number;
  //任务名称
  taskName: string;
  //教师姓名
  teacherName: string;
  //ic卡号
  icCardNo?: string;
  //教研组id
  groupId?: number;
  //提交时间
  publishTime?: string;
  //提交编号
  serialNumber?: string;
  //当前填报状态  -2未提交、-1待审批、0审批中、1已通过、2已驳回
  state?: number;
  //任务当前状态  0:待开始 1:进行中 2:已结束
  taskState?: number;
  //业务比赛参与和获奖
  teacherAwardRecords?: TeacherAwardRecord[];
  //课题申报和立项
  projectApplicationRecords?: ProjectApplicationRecord[];
  //课题获奖
  projectAwardRecords?: ProjectAwardRecord[];
  //论文送审和获奖
  paperSubmitRecords?: PaperSubmitRecord[];
  //论文发表
  paperPublishRecords?: PaperPublishRecord[];
  //校内外公开课
  openCourseRecords?: OpenCourseRecord[];
  //校内外讲座
  lectureRecords?: LectureRecord[];
  //各类荣誉
  honorRecords?: HonorRecord[];
  //年度荣誉加分情况
  bonusRecords?: BonusRecord[];

  //抄送对象
  carbonCopies?: CarbonCopy[];
  //审批节点
  nodes?: Node[];
}

/**
 * 教师填报 提交详情类
 */
export interface TeacherReportSubmit {
  //id记录id
  id?: number;
  //任务id
  taskId?: number;
  //教研组id
  groupId?: string;
  //审核状态 审批时必传
  state?: number;
  //内容
  content?: string;
  //业务比赛参与和获奖
  teacherAwardRecords?: TeacherAwardRecord[];
  //课题申报和立项
  projectApplicationRecords?: ProjectApplicationRecord[];
  //课题获奖
  projectAwardRecords?: ProjectAwardRecord[];
  //论文送审和获奖
  paperSubmitRecords?: PaperSubmitRecord[];
  //论文发表
  paperPublishRecords?: PaperPublishRecord[];
  //校内外公开课
  openCourseRecords?: OpenCourseRecord[];
  //校内外讲座
  lectureRecords?: LectureRecord[];
  //各类荣誉
  honorRecords?: HonorRecord[];
  //年度荣誉获奖加分情况
  bonusRecords?: BonusRecord[];
}

//照片上传返回的
export interface RecordFile {
  id: number;
  filePath: string;
}

// 年度荣誉加分情况(教师填报子项)
export interface BonusRecord {
  //记录id
  id?: number;
  //类型 0-10
  itemId?: number;
  //加分项id（判断有没有勾选checkbox）
  bonusId?: number;
  //第几作者
  chargeOrderNo?: number;
  //总人数
  chargeTotalNo?: number;
  //获奖日期
  detailDate?: string;
  //举办单位、发表刊物
  hostUnit?: string;
  //年度荣誉名称
  itemName?: string;
  //form表单类型
  itemType?: number;
  //返回的照片列表
  recordFilePaths?: RecordFile[];

  /**
   * 以下是表单绑定字段
   */
  //和form绑定的勾选状态
  flag?: boolean;
  //获奖日期
  awardData?: moment;
  //排名（1/3）
  rank?: string;
  //照片
  photoList?: any[];

  //提交的照片id
  recordFileIds?: number[];
}

//抄送对象（教师填报子项）
export interface CarbonCopy {
  //抄送对象id
  targetId: number;
  //抄送对象名字
  targetName: string;
  //抄送类型
  targetType: number;
}

//各类荣誉（教师填报子项）
export interface HonorRecord {
  //颁发日期
  detailDate?: string;
  //荣誉名称
  honorName?: string;
  //主办单位
  hostUnit?: string;
  //id
  id?: number;
  //返回的照片列表
  recordFilePaths?: RecordFile[];

  //颁发日期
  awardData?: moment;
  //照片
  photoList?: any[];

  //提交的照片id
  recordFileIds?: number[];
}

//校内外讲座（教师填报子项）
export interface LectureRecord {
  //举办日期
  detailDate?: string;
  //讲座名称
  lectureName?: string;
  //主办单位
  hostUnit?: string;
  //id
  id?: number;
  //返回的照片列表
  recordFilePaths?: RecordFile[];

  //讲座日期
  awardData?: moment;
  //照片
  photoList?: any[];

  //提交的照片id
  recordFileIds?: number[];
}

//审批节点（教师填报子项）
export interface Node {
  //审批人列表
  approvers: Approver[];
  //节点类型 1个人 2角色
  nodeType: number;
  //状态 -1 阻塞 0 活跃 1 通过 2 拒绝
  resultState: number;
  //角色列表
  roles?: Role[];
  //审批类型 0 单人 1或签 2会签
  signType: number;
  //结点结束时间
  updatedTime: string;
}

//审核人
export interface Approver {
  //审批人id
  approverId: number;
  //审批人名字
  approverName: string;
  //审批人类型 1教师 2学生 3家长
  approverType: number;
  //审批内容
  content: string;
  //id
  id: number;
  //审批人状态
  resultState: number;
  //审批时间
  updatedTime: string;
}

//角色
export interface Role {
  //角色列表
  approvers: Approver[];
  //角色id
  id: number;
  //角色名称
  name: string;
}

//校内外公开课（教师填报子项）
export interface OpenCourseRecord {
  //公开课课题
  courseName?: string;
  //开课日期
  detailDate?: string;
  //主办单位
  hostUnit?: string;
  //公开课ID
  id?: number;
  //证书照片
  recordFilePaths?: RecordFile[];

  //开课日期
  awardData?: moment;
  //照片
  photoList?: any[];

  //提交的照片id
  recordFileIds?: number[];
}

//论文发表（教师填报子项）
export interface PaperPublishRecord {
  //第几作者
  chargeOrderNo?: number;
  //总人数
  chargeTotalNo?: number;
  //发布日期
  detailDate?: string;
  //论文id
  id?: number;
  //发表刊物名称
  journalName?: string;
  //论文名称
  paperName?: string;
  //返回的照片列表
  recordFilePaths?: RecordFile[];

  //发布日期
  awardData?: moment;
  //第几负责人/共几人
  rank?: string;
  //照片
  photoList?: any[];

  //提交的照片id
  recordFileIds?: number[];
}

//论文送审和获奖（教师填报子项）
export interface PaperSubmitRecord {
  //获奖等级
  awardGradeName?: string;
  //获奖级别
  awardLevel?: number;
  //授奖单位
  awardUnit?: string;
  //第几负责人
  chargeOrderNo?: number;
  //共几人
  chargeTotalNo?: number;
  //获奖时间
  detailDate?: string;
  //论文id
  id?: number;
  //论文名称
  paperName?: string;
  //参评项目
  project?: string;
  //返回的照片列表
  recordFilePaths?: RecordFile[];

  //获奖日期
  awardData?: moment;
  //第几负责人/共几人
  rank?: string;
  //照片
  photoList?: any[];

  //提交的照片id
  recordFileIds?: number[];
}

//课题申报和立项（教师填报子项）
export interface ProjectApplicationRecord {
  //第几负责人
  chargeOrderNo?: number;
  //共几人
  chargeTotalNo?: number;
  //立项状态 0 不立项 1 区级立项 2 市级立项 3省级立项 4国家级立项
  establishmentState?: number;
  //课题id
  id?: number;
  //课题名称
  projectName?: string;
  //课题参与人数
  projectTotalNo?: string;

  //第几负责人/共几人
  rank?: string;
}

//课题获奖（教师填报子项）
export interface ProjectAwardRecord {
  //获奖等级
  awardGradeName?: string;
  //获奖级别
  awardLevel?: number;
  //授奖单位
  awardUnit?: string;
  //获奖时间
  detailDate?: string;
  //课题获奖id
  id?: number;
  //参评项目
  project?: string;
  //课题名称
  projectName?: string;
  //返回的照片列表
  recordFilePaths?: RecordFile[];

  //获奖日期
  awardData?: moment;
  //照片
  photoList?: any[];

  //提交的照片id
  recordFileIds?: number[];
}
//业务比赛参与和获奖（教师填报子项）
export interface TeacherAwardRecord {
  //获奖等级
  awardGradeName?: string;
  //授奖单位
  awardUnit?: string;
  //第几负责人
  chargeOrderNo?: number;
  //共几人
  chargeTotalNo?: number;
  //参评内容
  contestContent?: string;
  //比赛类别
  contestLevel?: number;
  //比赛名称
  contestName?: string;
  //获奖时间
  detailDate?: string;
  //比赛id
  id?: number;
  //返回的照片列表
  recordFilePaths?: RecordFile[];

  //获奖日期
  awardData?: moment;
  //第几负责人/共几人
  rank?: string;
  //提交的照片id
  recordFileIds?: number[];
  //照片
  photoList?: any[];
}

// 证书文件数据
export interface AwardPdfExtra {
  url: string;
  name: string;
  fileSize: number;
}

// 教师填报汇总记录
export interface SearchTeacherSummaryParam {
  // 页码
  current: number;
  // 每页大小
  size: number;
  // 教研组id
  groupId?: number;
  // ic卡号
  icCardNo?: string;
  // 教师姓名
  name?: string;
  // 审批状态 -1待审批、0审批中、1已通过、2已驳回
  state?: number;
  // 提交状态 1未提交 2:已提交
  status?: number;
  // 任务id
  taskId?: number;
  // 教师ids
  teacherIds?: number[];
}

// 查询所有学生
export interface SearchAwardAllStudentsParams {
  full?: boolean;
  scope?: number;
  size?: number;
  current?: number;
  name?: string;
}
