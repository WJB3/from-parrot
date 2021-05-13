import request from './request';
import Axios, { AxiosRequestConfig } from 'axios';
import GT from 'types';

export default {
  getAll: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Schedule[]>('/setting/rest', config),
  get: (id: number) => request.get<any, GT.DTO.CreateScheduleDto>(`/setting/rest/${id}`),
  create: (data: GT.DTO.CreateScheduleDto, config?: AxiosRequestConfig) =>
    request.post<any, 0 | 1>('/setting/rest', data, config),
  forceCreate: (data: GT.DTO.CreateScheduleDto, config?: AxiosRequestConfig) =>
    request.post('/setting/rest/section/detail', data, config),
  check: () => request.get<any, GT.Model.ScheduleCheckResult>('/setting/rest/school'),
  delete: (id: number) => request.delete(`/setting/rest/${id}`),
  restart: (id: number) => request.put<any, 0 | 1>(`/setting/rest/${id}`),
  forceRestart: (id: number) => request.put(`/setting/rest/${id}/detail`),
  update: (data: GT.DTO.CreateScheduleDto) =>
    request.post<any, 0 | 1>('/setting/rest/detail', data),
  forceUpdate: (data: GT.DTO.CreateScheduleDto) => request.post('/setting/rest/detail/time', data),
  getTemplates: (id: any) =>
    request.get<any, { id: number; templateName: string }[]>(`/setting/rest/${id}/templates`),
  updateBeginTime: (params: { id: number; beginTime: string }) =>
    request.put('/setting/rest', {}, { params }),
};
