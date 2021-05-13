import request from './request';
import Axios, { AxiosRequestConfig } from 'axios';
import GT from 'types';

export default {
  getPage: (params: GT.DTO.SearchStudentParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.Student>>('/foundation/students', {
      ...config,
      params,
    }),
  create: (data: GT.DTO.CreateStudentDto, config?: AxiosRequestConfig) =>
    request.post('/foundation/students', data, config),

  delete: (config?: AxiosRequestConfig) => request.delete('/foundation/students', config),
  exchange: (classId: number, studentIds: number[], config?: AxiosRequestConfig) =>
    request.put(`/foundation/students/${classId}`, studentIds, config),
  update: (data: GT.DTO.CreateStudentDto, config?: AxiosRequestConfig) =>
    request.put('/foundation/students', data, config),
  createPre: (data: GT.DTO.CreateStudentDto, config?: AxiosRequestConfig) =>
    request.post('/foundation/students/prepare', data, config),
  updatePre: (data: GT.DTO.CreateStudentDto, config?: AxiosRequestConfig) =>
    request.put('/foundation/students/prepare', data, config),
  updateParent: (id: number, parents: GT.Model.Parent[], config?: AxiosRequestConfig) =>
    request.put(`/foundation/students/${id}/parents`, parents, config),

  getFacePage: (params: GT.DTO.SearchStudentFaceParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.StudentFace>>('/foundation/students/faces', {
      ...config,
      params,
    }),
  getPreFacePage: (params: GT.DTO.SearchStudentFaceParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.PreStudentFace>>('/foundation/students/pre/faces', {
      ...config,
      params,
    }),
  deleteFace: (data: number[], config?: AxiosRequestConfig) =>
    request.delete('/foundation/students/avatars', {
      ...config,
      data,
    }),
  /**
   * 0:老师
   * 1:学生
   * 2:预备生
   */
  importFace: (params: { fileId: number; type: 1 | 2 }, config?: AxiosRequestConfig) =>
    request.put(
      '/foundation/students/avatars',
      {},
      {
        ...config,
        params,
      },
    ),
  getImportRecordPage: (
    params: { current: number; size: number; type: 1 | 2 },
    config?: AxiosRequestConfig,
  ) =>
    request.get<any, GT.Response.Page<GT.Model.ImportFaceRecord>>('/foundation/students/records', {
      ...config,
      params,
    }),
  exportFace: (params: GT.DTO.SearchStudentFaceParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.ExportRes>('/foundation/students/avatars/excels', {
      ...config,
      params,
    }),
  getFaceStatus: (config?: AxiosRequestConfig) =>
    request.get<any, 0 | 1>('/foundation/students/avatars/status', config),
  updateFace: (id: number, params: { fileId: number; type: 1 | 2 }, config?: AxiosRequestConfig) =>
    request.put(
      `/foundation/students/${id}/avatar`,
      {},
      {
        ...config,
        params,
      },
    ),
  export: (params: GT.DTO.SearchStudentParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.ExportRes>('/foundation/students/export/all', {
      ...config,
      params,
    }),
  exportPre: (params: GT.DTO.SearchStudentParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.ExportRes>('/foundation/students/pre/export', {
      ...config,
      params,
    }),
  exportParent: (params: GT.DTO.SearchStudentParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.ExportRes>('/foundation/students/parent/export', {
      ...config,
      params,
    }),
  getExcelTpl: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.ExportRes>('/foundation/students/template/all', config),
  getPreExcelTpl: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.ExportRes>('/foundation/students/pre/template', config),
  getParentExcelTpl: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.ExportRes>('/foundation/students/parent/template', config),
  importParentExcel: (data: FormData, config?: AxiosRequestConfig) =>
    request.post<any, GT.Model.ImportExcelRes<GT.Model.Student>>(
      '/foundation/students/parent/import',
      data,
      {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    ),
  importPreExcel: (data: FormData, config?: AxiosRequestConfig) =>
    request.post<any, GT.Model.ImportExcelRes<GT.Model.Student>>(
      '/foundation/students/pre/import',
      data,
      {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    ),
  importExcel: (data: FormData, config?: AxiosRequestConfig) =>
    request.post<any, GT.Model.ImportExcelRes<GT.Model.Student>>(
      '/foundation/students/import',
      data,
      {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    ),

      // 填报详情 获取所有学生
  getAllStudentsPage: (data: GT.DTO.SearchStudentParams, config?: AxiosRequestConfig) =>
  request.get<any, GT.Response.Page<GT.Model.Student>>('/foundation/students/all', {
    ...config,
    params: {
      ...data,
      ...config?.params,
    },
  }),
};
