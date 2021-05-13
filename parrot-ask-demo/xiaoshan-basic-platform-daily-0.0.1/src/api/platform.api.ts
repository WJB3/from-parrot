import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';

export default {
  // 获取推送事项
  getPage:(config?: AxiosRequestConfig) => 
    request.get<any, GT.Response.Page<GT.Model.Platform>>("/setting/push_items", config),
  
  // 新增推送事项
  create: (data: GT.DTO.CreatePushItemParmas, config?: AxiosRequestConfig) => 
    request.post("/setting/push_items", data, config),

  // 删除推送事项
  delete: (id: number, config?: AxiosRequestConfig) =>
    request.delete(`/setting/push_items/${id}`, config),

  // 修改推送事项
  update: (id: number, data: GT.DTO.CreatePushItemParmas, config?: AxiosRequestConfig) =>
    request.put(`/setting/push_items/${id}`, data, config),

  // 模版开启状态修改
  edit: (id: number, data: {id?: number, openState: boolean}[], config?: AxiosRequestConfig) =>
    request.put(`/setting/push_items/${id}/open_state`, data, config),
}