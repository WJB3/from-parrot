import { MentTaskResultItem } from "types/model/assessment";

// 查询任务列表
export interface SearchTaskParams {
  current?: number;
  size?: number;
  // 任务名称
  name?: string;
  // 任务状态 0待开始 1进行中 2已结束
  progressState?: number;
  // 结果状态
  published?: boolean;
  // 年份
  year?: number;
}

export interface SearchAssessParams {
  current?: number;
  size?: number;
  // 教师名称
  name?: string;
  // 任务Id
  taskId: number;
  // 教师电话
  phone?: string;
}

// 创建任务
export interface CreateAssessmentTaskDto {
  // 任务名称
  name?: string;
  // 年份
  year?: number;
  startTime?: string;
  endTime?: string;
  // 模版id
  templateId?: number;
  // 备注
  remark?: string;
  id?: number;
  // 模版详情
  items?: MentTaskResultItem[];
  // 是否已经发布考核结果
  published?: boolean;

  // 任务备注
  taskRemark?: string;
}

// 查看考核分数
export interface SearchAssessmentItemResultParams {
  current?: number;
  size?: number;
  // 姓名
  name: string;
  // 手机号码
  phone: string;
  // 任务id
  taskId: number;
}

//导入审核表
export interface ImportAssessMentParams {
  file?: FormData;
  itemId?: number;
  taskId?: number;
}
