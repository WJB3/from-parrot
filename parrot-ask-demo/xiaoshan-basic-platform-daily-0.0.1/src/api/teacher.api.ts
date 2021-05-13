import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';
export default {
  get: (id: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Teacher>(`/foundation/teachers/${id}`, config),
  getAll: (data: GT.DTO.SearchTeacherParams, config?: AxiosRequestConfig) =>
    request.post<any, GT.Response.Page<GT.Model.Teacher>>(
      '/foundation/teachers/post',
      data,
      config,
    ),
  getPage: (data: GT.DTO.SearchTeacherParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.Teacher>>('/foundation/teachers', {
      ...config,
      params: {
        ...data,
        ...config?.params,
      },
    }),
  create: (data: GT.DTO.CreateTeacherDto, config?: AxiosRequestConfig) =>
    request.post('/foundation/teachers', data, config),
  update: (data: GT.DTO.CreateTeacherDto, config?: AxiosRequestConfig) =>
    request.put('/foundation/teachers', data, config),
  delete: (config?: AxiosRequestConfig) => request.delete('/foundation/teachers', config),
  export: (data: GT.DTO.SearchTeacherParams, config?: AxiosRequestConfig) =>
    request.get<string, GT.Model.ExportRes>('/foundation/teachers/excels', {
      ...config,
      params: {
        ...data,
        ...config?.params,
      },
    }),
  importFace: (params: { fileId: number }, config?: AxiosRequestConfig) =>
    request.put(
      '/foundation/teachers/avatars',
      {},
      {
        ...config,
        params,
      },
    ),
  getImportRecordPage: (params: { current: number; size: number }, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.ImportFaceRecord>>(
      '/foundation/teachers/avatars/records',
      {
        ...config,
        params,
      },
    ),
  getFaceStatus: (config?: AxiosRequestConfig) =>
    request.get<any, 0 | 1>('/foundation/teachers/avatars/status', config),
  getFacePage: (params: GT.DTO.SearchTeacherFaceParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.TeacherFace>>('/foundation/teachers/avatars', {
      ...config,
      params,
    }),
  deleteFace: (data: number[], config?: AxiosRequestConfig) =>
    request.delete('/foundation/teachers/avatars', {
      ...config,
      data,
    }),
  exportFace: (params: GT.DTO.SearchTeacherFaceParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.ExportRes>('/foundation/teachers/avatars/excel', {
      ...config,
      params,
    }),
  updateFace: (id: number, params: { fileId: number }, config?: AxiosRequestConfig) =>
    request.put(
      `/foundation/teachers/${id}/avatar`,
      {},
      {
        ...config,
        params,
      },
    ),
  getExcelTpl: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.ExportRes>('/foundation/teachers/excels/template', config),
  importExcel: (data: FormData, config?: AxiosRequestConfig) =>
    request.post<any, GT.Model.ImportExcelRes<GT.Model.Teacher>>(
      '/foundation/teachers/excels',
      data,
      {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    ),
};
