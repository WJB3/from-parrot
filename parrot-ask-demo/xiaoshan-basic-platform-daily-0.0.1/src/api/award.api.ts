/** 学生竞赛获奖api */
import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';
import { config } from 'process';

export default {
  getPage: (data: GT.DTO.SearchAwardTaskParams, config?: AxiosRequestConfig) =>
  request.get<any, GT.Response.Page<GT.Model.AwardTaskModel>>('/gathering/tasks', {
    ...config,
    params: {
      ...data,
      ...config?.params,
    },
  }),

  // 获取对象的api
  getReceivePage: (data: GT.DTO.SearchAwardReceivePersonParams, config?: AxiosRequestConfig) =>
  request.get<any, GT.Response.Page<GT.Model.Teacher>>('/gathering/tasks/teacher', {
    ...config,
    params: {
      ...data,
      ...config?.params,
    },
  }),

  // 获取获奖得分list
  getAwardPointPage: (data: GT.DTO.SeacherAwardPointParams, config?: AxiosRequestConfig) =>
  request.get<any, GT.Response.AwardPointPage<GT.Model.AwardPointModel>>('/gathering/students/scores', {
    ...config,
    params: {
      ...data,
      ...config?.params,
    },
  }),

  // 得分考评汇出表
  exportScorePoint: (params: GT.DTO.SeacherAwardPointParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.ExportRes>(`/gathering/students/scores/export`, {
      ...config,
      params: {
        ...params,
        ...config?.params,
      },
    }),

  // 证书下载
  downloadAwardCert: (data: GT.DTO.SeacherAwardPointExptParams, config?: AxiosRequestConfig) =>
  request.get<any, GT.Model.ExportRes>('/gathering/students/credentials', {
    ...config,
    params: {
      ...data,
      ...config?.params,
    },
  }),

  // 获取获奖等级
  getByRecordId: (params?: { recordId?: number }) => 
  request.get<any, GT.Model.AwardLevelModel[]>(`/gathering/students/award/level`, {
    params,
  }),

  // 获取我的填报列表
  getAwardReportPage: (data: GT.DTO.SeacherAwardReportParams, config?: AxiosRequestConfig) =>
  request.get<any, GT.Response.AwardPointPage<GT.Model.ReportListModel>>('/gathering/students/award', {
    ...config,
    params: {
      ...data,
      ...config?.params,
    },
  }),

  // 填报详情 获取所有学生
  getAllStudentsPage: (data: GT.DTO.SearchAwardAllStudentsParams, config?: AxiosRequestConfig) =>
  request.get<any, GT.Response.Page<GT.Model.Student>>('/foundation/students', {
    ...config,
    params: {
      ...data,
      ...config?.params,
    },
  }),

  // 填报 我的填报记录 personal
  getMyAwardReportList: (data: GT.DTO.SearchMyAwardReportParams, config?: AxiosRequestConfig) =>
  request.get<any, GT.Response.Page<GT.Model.ReporAwardDetailModel>>('/gathering/students/records/personal', {
    ...config,
    params: {
      ...data,
      ...config?.params,
    },
  }),

  // 学生汇总记录- 列表
  getRecordPage: (data: GT.DTO.SeacherAwardRecordParams, config?: AxiosRequestConfig) =>
  request.get<any, GT.Response.Page<GT.Model.ReporAwardDetailModel>>('/gathering/students/records', {
    ...config,
    params: {
      ...data,
      ...config?.params,
    },
  }),

  // 导出上报汇总表
  exportAllRecord: (params: {taskId: number}, config?: AxiosRequestConfig) =>
  request.get<any, GT.Model.ExportRes>(`/gathering/students/${params.taskId}/records`, config),

  // 导出汇总表
  exportSearchRecord: (params: GT.DTO.SeacherAwardRecordParams, config?: AxiosRequestConfig) =>
  request.get<any, GT.Model.ExportRes>(`/gathering/students/records/summary`, {
    ...config,
    params: {
      ...params,
      ...config?.params,
    },
  }),

  // 下载汇总的证书
  downloadRecordCert: (params: {taskId: number}, config?: AxiosRequestConfig) =>
  request.get<any, GT.Model.ExportRes[]>(`/gathering/students/${params.taskId}/certs`, config),

  // 删除汇总记录
  deleteRecords: (recordId: number) => request.delete(`/gathering/students/${recordId}`),

  // 新增任务接收对象
  addReceivers: (taskId: number, data: number[], config?: AxiosRequestConfig) =>
  request.put(`/gathering/tasks/teacher/${taskId}`, data, config),

  // 删除任务
  delete: (id: number) => request.delete(`/gathering/tasks/${id}`),

  // 删除任务接收对象
  deleteReceivers: (taskId: number, data: number[], config?: AxiosRequestConfig) => 
    request.delete(`/gathering/tasks/teacher/${taskId}`, {
      ...config,
      data,
    }),

  //新增任务
  createTask:(data:GT.DTO.CreateTaskParams, config?: AxiosRequestConfig) =>
  request.post('/gathering/tasks', data, config),

   //新增任务
   updateTask:(data:GT.DTO.CreateTaskParams, config?: AxiosRequestConfig) =>
   request.put('/gathering/tasks', data, config),

  //获取任务详情
  getTaskDetail: (taskId: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.DTO.CreateTaskParams>(`/gathering/tasks/${taskId}`, config),


  // 获奖登记填报
  createReportAward:(data:GT.DTO.CreateStudentReportAwardDto, config?: AxiosRequestConfig) =>
  request.post('/gathering/students', data, config),

  // 获奖登记填报修改
  updateReportAward:(data:GT.DTO.CreateStudentReportAwardDto, config?: AxiosRequestConfig) =>
  request.put('/gathering/students', data, config),

  // 获奖登记详情查询
  getRecordDetail: (recordId: number, config?: AxiosRequestConfig) =>
  request.get<any, GT.Model.ReporAwardDetailModel>(`/gathering/students/${recordId}/award`, config),

  // 填报审核
  verifyAwardRecord:(data:GT.DTO.VerifyAwardRecordParams, config?: AxiosRequestConfig) =>
  request.put('/gathering/students/records', data, config),

  //获取教师填报详情
  getTeacherReportDetail:(config?:AxiosRequestConfig)=>
  request.get<any,GT.DTO.TeacherReportDetail>(`/gathering/teachers`,config),

  //教师填报暂存
  saveTeacherRecord:(data:GT.DTO.TeacherReportSubmit,config?: AxiosRequestConfig) =>
  request.post('/gathering/teachers/staging', data, config),

  //教师填报提交
  submitTeacherRecord:(data:GT.DTO.TeacherReportSubmit,config?: AxiosRequestConfig) =>
  request.post('/gathering/teachers', data, config),

  //教师填报修改
  updateTeacherRecord:(data:GT.DTO.TeacherReportSubmit,config?: AxiosRequestConfig) =>
  request.put('/gathering/teachers', data, config),

  //审批教师填报
  approvalTeacherRepor:(data:GT.DTO.TeacherReportSubmit,config?: AxiosRequestConfig) =>
  request.put('/gathering/teachers/approval', data, config),

  //获取最新的证书文件
  getLastestCert:(config?:AxiosRequestConfig)=>
  request.get<any,GT.DTO.AwardPdfExtra>(`/gathering/students/certs/pdf`,config),

  // 汇总记录
  getSummary: (param: GT.DTO.SearchTeacherSummaryParam, config?: AxiosRequestConfig) =>
  request.get<any, GT.Response.Page<GT.Model.TearchSummary>>("/gathering/teachers/summary", {...config, params: {...param, ...config?.params}}),

  // 删除记录
  deleteSummary: (id: number, config?: AxiosRequestConfig) =>
  request.delete(`/gathering/teachers/records/${id}`, config),

  // 导出汇总表
  exportSummary: (param: GT.DTO.SearchTeacherSummaryParam, config?: AxiosRequestConfig) =>
  request.get<any, GT.Model.ExportRes>("/gathering/teachers/export/summary",  {
    ...config,
    params: {
      ...param,
      ...config?.params,
    },
  }),

  // 导出年检
  exportYearBook: (taskId: number, config?: AxiosRequestConfig) =>
  request.get<any, GT.Model.ExportRes>(`/gathering/teachers/export/yearBook/${taskId}`, config),


}