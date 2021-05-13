import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';

export default {
  // 查询请假名单
  getPage: (parmas: GT.DTO.SearchLeaveListParmas, config?: AxiosRequestConfig) => 
    request.get<any, GT.Response.Page<GT.Model.Leave>>("/leave/leave_records/students", {...config, params: {...parmas, ...config?.params}}),

  // 导出请假名单
  exportExcel: (parmas: GT.DTO.SearchLeaveListParmas, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.ExportRes>("/leave/leave_records/students/excel", {...config, params: {...parmas, ...config?.params}}),

  // 发起请假
  createLeave: (parmas: GT.DTO.CreateLeaveDto, config?: AxiosRequestConfig) => 
    request.post<any, any>("/leave/leave_records", parmas, config),

  // 查询请假详情
  getDetail: (id: number, config?: AxiosRequestConfig) => 
    request.get<any, GT.Model.LeaveDetail>(`/leave/leave_records/${id}`, config),

  // 通过记录id获取请假名单
  getDetailPage: (id: number, parmas: {current: number, size: number}, config?: AxiosRequestConfig) => 
    request.get<any, GT.Response.Page<GT.Model.Leave>>(`/leave/leave_records/${id}/students`, {...config, params: {...parmas, ...config?.params}}),

  // 获取当前登录人审批待办
  getApproval: (parmas: {current: number, size: number}, config?: AxiosRequestConfig) => 
  request.get<any, GT.Response.Page<GT.Model.LeaveHistory>>("/leave//leave_records/approval/records", {...config, params: {...parmas, ...config?.params}}),

  // 批量审批
  approvalBatch: (data: any, config?: AxiosRequestConfig) =>
    request.put("/leave/leave_records/approval", data, config),

  // 删除请假记录
  delete: (id: number, config?: AxiosRequestConfig) =>
    request.delete(`/leave/leave_records/${id}`, config),

  // 查询请假记录
  getHistoryPage: (parmas: GT.DTO.SearchLeaveHistoryParmas, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.LeaveHistory>>("/leave/leave_records", {...config, params: {...parmas, ...config?.params}}),

  // 请假记录导出  
  historyExportExcel: (parmas: GT.DTO.SearchLeaveHistoryParmas, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.ExportRes>("/leave/leave_records/export", {...config, params: {...parmas, ...config?.params}}),

  // 提前销假记录查询
  foreList: (id: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.LeaveHistory>>(`/leave/leave_records/${id}/early_back_records`, config),

  // 提前销假 
  cancelHistory: (parmas: {goBackTime: string, goBed: number, ids: string}, config?: AxiosRequestConfig) => 
    request.post("/leave/leave_records/early_back_records", parmas, config),

  // 请假统计
  summary: (parmas: GT.DTO.SearchLeaveSummaryParmas, config?: AxiosRequestConfig) => 
    request.get<any, GT.Model.LeaveCount[]>("/leave/leave_records/statistics", {...config, params: {...parmas, ...config?.params}}),

  // 获取权限详情， 用于发起请假时判断选择的班级是属于年级组下面还是班主任下面
  getRoleDetails: (config?: AxiosRequestConfig) => 
    request.get<any, {[key: string]: any}>("/foundation/users/role/details", config),
}