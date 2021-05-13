import request from './request';
import Axios, { AxiosRequestConfig } from 'axios';
import GT from 'types';

export default {
  getAll: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Semester[]>('/setting/semesters', config),
  getNext: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.NextSemester>('/setting/semesters/next', config),
  create: (data: GT.Model.Semester, config?: AxiosRequestConfig) =>
    request.post('/setting/semesters', data, config),
  update: (data: GT.Model.Semester, config?: AxiosRequestConfig) =>
    request.put('/setting/semesters/time', data, config),
  getLogPage: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.SemesterLog>>(
      '/setting/semesters/upgrade_logs',
      config,
    ),
  retry: () => request.post('/setting/semesters/retry'),
  getCurrentYear: () => request.get<any, number>('/setting/semesters/current_year'),
  getCurrent: () => request.get<any, GT.Model.Semester>('/setting/semesters/current_semester'),
  getById: (id: number) => request.get<any, GT.Model.Semester>(`/setting/semesters/${id}`),
};
