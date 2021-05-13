import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';

export default {
  getPermissions: (params?: GT.Model.MenuSearchParams, config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Menu[]>('/foundation/permissions', {
      ...config,
      params: {
        ...params,
        ...config?.params,
      },
    }),
  create: (data: GT.DTO.CreatePermissionDto, config?: AxiosRequestConfig) =>
    request.post('/foundation/permissions', data, config),
  delete: (id: any, config?: AxiosRequestConfig) =>
    request.delete(`/foundation/permissions/${id}`, config),
  update: (data: GT.Model.Menu, config?: AxiosRequestConfig) =>
    request.put('/foundation/permissions', data, config),
  getCommons: (
    params: {
      rootId: number;
    },
    config?: AxiosRequestConfig,
  ) =>
    request.get<any, GT.Model.Menu[]>('/foundation/permissions/me/commonly_used', {
      ...config,
      params,
    }),
  createCommon: (
    params: { permissionId: number; sort: number; rootId: number },
    config?: AxiosRequestConfig,
  ) =>
    request.post(
      '/foundation/permissions/me/commonly_used',
      {},
      {
        ...config,
        params,
      },
    ),
  deleteCommon: (id: number) => request.delete(`/foundation/permissions/me/commonly_used/${id}`),
};
