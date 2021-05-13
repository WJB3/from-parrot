import request from './request';
import Axios, { AxiosRequestConfig } from 'axios';
import GT from 'types';

export default {
  get: (id: number) => request.get<any, GT.Model.Role>(`/foundation/roles/${id}`),
  getPage: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.Role>>('/foundation/roles', config),
  create: (data: GT.DTO.CreateRoleDto, config?: AxiosRequestConfig) =>
    request.post('/foundation/roles', data, config),
  update: (data: GT.DTO.CreateRoleDto, config?: AxiosRequestConfig) =>
    request.put('/foundation/roles', data, config),
  delete: (id: any, config?: AxiosRequestConfig) =>
    request.delete(`/foundation/roles/${id}`, config),
  getPermissions: (id: any, config?: AxiosRequestConfig) =>
    request.get<any, number[]>(`/foundation/roles/${id}/permissions`, config),
  updatePermissions: (id: any, data: GT.DTO.UpdateRolePermissionDto, config?: AxiosRequestConfig) =>
    request.put(`/foundation/roles/${id}/permissions`, data, config),
  getDataScopes: (roleId: number, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.RoleDataScope[]>(`/foundation/roles/${roleId}/data_scopes`, config),
  updateDataScopes: (roleId: number, data: GT.Model.RoleDataScope[], config?: AxiosRequestConfig) =>
    request.put(`/foundation/roles/${roleId}/data_scopes`, data, config),

  // 获取系统角色和自定义角色
  getCustom: (config?: AxiosRequestConfig) => 
    request.get<any, {customRoles: GT.Model.Role[], sysRoles: GT.Model.Role[]}>("/foundation/roles/sys/Custom", config),
};
