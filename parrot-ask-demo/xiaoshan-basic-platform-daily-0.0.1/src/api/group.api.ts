import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';
export default {
  getPage: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.Group>>('/foundation/groups/custom', config),
  create: (data: GT.DTO.CreateGroupDto, config?: AxiosRequestConfig) =>
    request.post('/foundation/groups/custom', data, config),
  update: (data: GT.DTO.CreateGroupDto, config?: AxiosRequestConfig) =>
    request.put('/foundation/groups/custom', data, config),
  delete: (id: number, config?: AxiosRequestConfig) =>
    request.delete(`/foundation/groups/custom/${id}`, config),
  getLessonGroupPage: (params: GT.DTO.SearchLessonGroupParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.Group>>('/foundation/groups/lesson_prepare', {
      ...config,
      params,
    }),
  updateLessonGroup:(data:GT.DTO.CreateGroupDto,config?:AxiosRequestConfig)=>request.put('/foundation/groups/lesson_prepare',data,config)
};
