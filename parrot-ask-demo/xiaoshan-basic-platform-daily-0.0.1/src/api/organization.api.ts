import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';
export default {
  getAll: (config?: AxiosRequestConfig) =>{
   
    return request.get<any, GT.Model.Organization[]>('/foundation/departments/tree', config)
  },
  getPage: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.Organization>>('/foundation/departments', config),
  create: (data: GT.DTO.CreateOrganizationDto, config?: AxiosRequestConfig) =>
    request.post('/foundation/departments', data, config),
  update: (data: GT.DTO.CreateOrganizationDto, config?: AxiosRequestConfig) =>
    request.put('/foundation/departments', data, config),
  delete: (config?: AxiosRequestConfig) => request.delete('/foundation/departments', config),
  getTeacherPage: (orgId: number, config?: AxiosRequestConfig) =>{
    console.log('--orgId--',orgId)
    if(orgId===0){
      return ;
    }
    return request.get<any, GT.Response.Page<GT.Model.Teacher>>(
      `/foundation/departments/teacher/group/${orgId}`,
      config,
    )
  },
  deleteTeachers: (config?: AxiosRequestConfig) =>
    request.delete('/foundation/departments/teacher', config),
  getLeaders: (orgId: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Teacher[]>(`/foundation/departments/leader/${orgId}`, config),

  createLeader: (data: GT.DTO.CreateOrganizationLeaderDto, config?: AxiosRequestConfig) =>
    request.put('/foundation/departments/leader', data, config),

    createAdminLeader: (data: GT.DTO.CreateOrganizationLeaderDto, config?: AxiosRequestConfig) =>
    request.put('/foundation/departments/management', data, config),

    deleteAdminLeader: (data: GT.DTO.CreateOrganizationLeaderDto, config?: AxiosRequestConfig) =>
    request.put('/foundation/departments/management', data, config),
    
    getAdminLeader:  (departmentId: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Teacher[]>(`/foundation/departments/management/${departmentId}`, config),

  /**
   * @param teacherId
   * @param departmentId
   */
  deleteLeader: (config?: AxiosRequestConfig) =>
    request.delete('/foundation/departments/leader', config), 

  /**
   * 查询当前部门可以设置成leader的教师
   * @param name  // 查询条件
   * @param departmentId  用于过滤当前部门的领导
   */
  getTeachersByName: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Teacher[]>('/foundation/departments/name', config),
  getTeacherTree: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Organization[]>('/foundation/departments/teachers/tree', config),
  selectTeachers: (
    data: { departmentId: number; teacherIds: number[] },
    config?: AxiosRequestConfig,
  ) => request.post('/foundation/departments/selected', data, config),
  getMaxSort: (params?: { departmentId?: number }) =>
    request.get<any, number>('/foundation/departments/maxSort', {
      params,
    }),
};
