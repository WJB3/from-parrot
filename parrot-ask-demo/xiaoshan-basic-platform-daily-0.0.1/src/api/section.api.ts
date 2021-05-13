// 学段
import request from './request';
import Axios, { AxiosRequestConfig } from 'axios';
import GT from 'types';

export default {
  /**
   * @param all 是否包含预备班
   */
  getAll: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Section[]>('/foundation/sections/types', config),
  getGrades: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Grade[]>(`/foundation/students/grades`, config),
  /**
   *
   */
  getClasses: (params: GT.DTO.SearchClassParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Class[]>('/foundation/students/classes', {
      ...config,
      params,
    }),
  /**
   * @param all 是否包含预备班
   */
  getTree: (
    params: { all: boolean; containStudents?: boolean; containParents?: boolean, containsAdmin?: boolean;},
    // query?: any,
    config?: AxiosRequestConfig,
  ) =>
    request.get<any, any[]>('/foundation/students/classes/tree', {
      ...config,
      params: {
        ...params,
        // ...query,
      }
    }),

  getAllStatistics: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.SectionStatistic[]>('/foundation/students/statistics', config),

  getStatistics: (sectionId: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.SectionStatistic[]>(
      `/foundation/students/statistics/${sectionId}`,
      config,
    ),

  create: (data: GT.DTO.CreateSectionDto[], config?: AxiosRequestConfig) =>
    request.post('/foundation/sections', data, config),

  delete: (config: AxiosRequestConfig) => request.delete('/foundation/sections', config),

  /**
   * @param sectionId
   * @param enrollmentYear
   */
  getGradeLeaders: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.GradeLeader[]>('/foundation/grade_group_members', config),
    getGradeLeadersMaster: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.GradeLeader[]>('/foundation/grade_group_members/master', config),
    getGradeLeadersAll: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.GradeLeader[]>('/foundation/grade_group_members/all', config),
  createGradeLeader: (data: GT.DTO.CreateGradeLeaderDto, config?: AxiosRequestConfig) =>
    request.post('/foundation/grade_group_members', data, config),
  deleteGradeLeader: (id: number, config?: AxiosRequestConfig) =>
    request.delete(`/foundation/grade_group_members/${id}`, config),
};
