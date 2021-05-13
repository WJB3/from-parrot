/** 学生竞赛获奖api */
import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';

export default {
  // 任务列表
  getPage: (parmas: GT.DTO.SearchTaskParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.MentTask>>("/assessment/tasks", {
      ...config,
      params: {
        ...parmas,
        ...config?.params,
      },
    }),

  // 删除
  delete: (id: number, config?: AxiosRequestConfig) => 
    request.delete(`/assessment/tasks/${id}`, config),

  // 创建任务
  create: (data: GT.DTO.CreateAssessmentTaskDto, config?: AxiosRequestConfig) => 
    request.post("/assessment/tasks", data, config),

  // 任务详情
  getTaskDetail: (id: number, config?: AxiosRequestConfig) => 
    request.get<any, GT.Model.SubmitDetail>(`/assessment/tasks/${id}`, config),

  // 编辑任务
  update: (data: GT.DTO.CreateAssessmentTaskDto, config?: AxiosRequestConfig) =>
    request.put("/assessment/tasks", data, config),

  // 获取分项详情 : 查看提交审核结果的项目信息、提交审核查看的动态标题
  getItemDetail: (taskId: number, id: number, config?: AxiosRequestConfig) => 
    request.get<any, GT.Model.MentTaskResultItem>(`/assessment/tasks/${taskId}/items/${id}`, config),

  // 获取单个任务单个项目汇总列表, 提交审核结果
  itemResult: (id: number, parmas: GT.DTO.SearchAssessmentItemResultParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.MentTaskResult>>(`/assessment/results/${id}`, {
      ...config,
      params: {
        ...parmas,
        ...config?.params,
      },
    }),

  // 我的评价任务列表
  getMyPage: (parmas: GT.DTO.SearchTaskParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.MentTask>>("/assessment/tasks/me", {
      ...config,
      params: {
        ...parmas,
        ...config?.params,
      },
    }),
  
  // 我的考评结果
  getMyDetail: (id: number, config?: AxiosRequestConfig) => 
    request.get<any, GT.Model.MentTaskResult>(`/assessment/results/me/${id}`, config),

    //获取提交详情
    getSubmitDetail:(id:number,config?: AxiosRequestConfig) => 
    request.get<any, GT.Model.SubmitDetail>(`/assessment/tasks/${id}`, config),
    
  // 任务 考评结果列表
  getAssessResultList: (parmas: GT.DTO.SearchAssessParams, config?: AxiosRequestConfig) =>
  request.get<any, GT.Response.Page<GT.Model.MentTaskResult>>("/assessment/results", {
    ...config,
    params: {
      ...parmas,
      ...config?.params,
    },
  }),

  // 考评结果 - 导出汇总表
  exportAssessResultPoint: (params: GT.DTO.SearchAssessParams, config?: AxiosRequestConfig) =>
  request.get<any, GT.Model.ExportRes>(`/assessment/results/export`, {
    ...config,
    params: {
      ...params,
      ...config?.params,
    },
  }),

 //批量导入
 importAssessmentExcel: (data: FormData, config?: AxiosRequestConfig) =>
    request.post<any, GT.Model.ImportExcelRes<GT.Model.Student>>(
      '/assessment/tasks/excels',
      data,
      {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    ),


  // 获取导入模板
  getTemplate: (itemId:number,taskId:number, conifg?: AxiosRequestConfig) =>
  request.get<any, GT.Model.ExportRes>(`/assessment/tasks/template/${itemId}/${taskId}`, conifg),
  // 发布教师考评结果
  updateAccessResults: (id: number, config?: AxiosRequestConfig) => 
  request.put(`/assessment/tasks/publish_state/published/${id}`, config),
}