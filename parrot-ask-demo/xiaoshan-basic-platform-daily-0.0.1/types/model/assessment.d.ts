// 任务
export interface MentTask {
  // id
  id: number;
  // 开始时间
  startTime: string;
  // 结束时间
  endTime: string;
  // 任务状态 0待开始 1进行中 2已结束
  progressState: number;
  // 是否发布
  published: boolean;
  // 考评年份
  year: number;
  // 发布时间
  publishedTime: string;
  // 任务名称
  name: string;
}

// 我的考核详情
export interface MentTaskResult {
  // 大于1表示更新发布
  publishedCount: number;
  // 发布时间
  publishedTime: string;
  // 任务名称
  taskName: string;
  // 姓名
  name: string;
  // 手机号
  phone: string;
  // 成绩
  resultScore: number;
  // 总分
  totalScore: number;
  // 考核项目列表
  items: MentTaskResultItem[];
  // 序号
  orderNumber: number;

  [key: number]: any;
}

// 考核项目列表
export interface MentTaskResultItem {
  // 考核组织
  assessmentOrg: string;
  // 项目id
  id: number;
  // 项目名称
  name: string;
  // 实际总分
  totalActualScore: number;
  // 总分
  totalScore: number;
  // 项目类型
  type: number;
  // 小计列表
  subItemActualScores: number[];
  // 子项列表
  subItems: MentTaskResultSubItem[];
  // 修改人
  updatedBy: string;
  // 修改时间
  updatedTime: string;
  // 任务名称
  taskName: string;
  // 任务年份
  year: string;
  //限制
  limited:boolean;
}

// 子项列表
export interface MentTaskResultSubItem {
  // 实际分数
  actualScore: number;
  // 项目id
  itemId: number;
  // 姓名
  name: string;
  // 正负
  plusMinus: boolean;
  // 分数
  score: number;
  // 学期序号
  semesterOrder: number;
}

//提交详情
export interface SubmitDetail {
  id: number;
  items: DetailItem[];
  // 任务名称
  name: string;
  // 执行状态
  progressState: number;
  // 模版备注
  templateRemark: string;
  // 任务备注
  taskRemark: string;
  // 模版id
  templateId: number;
  // 模版名称
  templateName:string;
  year:string
  // 是否需要更新
  needUpdate: boolean;
  // 是否发布
  published: boolean;
  // 开始时间
  startTime: string;
  // 结束时间
  endTime: string;
  // 更新时间
  updateTime: string;
  // 修改人姓名
  updaterName: string;
}

export interface DetailItem {
  //考核组织
  assessmentOrg: string;
  //是否已经提交
  committed: boolean;
  //项目id
  id: number;
  //限制
  limited:boolean;
  //项目名称
  name: string;
  //实际总分
  totalActualScore: number;
  //总分
  totalScore: number;
  //项目类型
  type: number;
}
