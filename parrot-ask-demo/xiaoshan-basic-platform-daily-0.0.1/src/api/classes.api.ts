import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';
export default {
  getPage: (params: GT.DTO.SearchClassParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.Class>>('/foundation/classes', {
      ...config,
      params,
    }),
  create: (data: GT.DTO.CreateClassDto, config?: AxiosRequestConfig) =>
    request.post('/foundation/classes', data, config),
  update: (data: GT.DTO.CreateClassDto, config?: AxiosRequestConfig) =>
    request.put('/foundation/classes', data, config),
  delete: (config?: AxiosRequestConfig) => request.delete('/foundation/classes', config),
  get: (id: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Class>(`/foundation/classes/${id}`, config),
  export:(params: GT.DTO.SearchClassParams, config?: AxiosRequestConfig)=>request.get<any,GT.Model.ExportRes>('/foundation/classes/excel',{
    ...config,
    params,
  }),
  getLeaderCandidatePage: (params: GT.DTO.SearchTeacherParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.Teacher>>('/foundation/classes/teachers/unselected', {
      ...config,
      params,
    })
};
