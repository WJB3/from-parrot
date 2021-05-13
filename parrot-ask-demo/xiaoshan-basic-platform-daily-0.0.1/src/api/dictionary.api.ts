import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';
export default {
  getAllUsed: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.Dictionary[]>('/foundation/dictionary_keys/all', config),
  getPage: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.Dictionary>>(
      '/foundation/dictionary_keys/page',
      config,
    ),
  update: (data: GT.DTO.CreateDictionaryDto, config?: AxiosRequestConfig) =>
    request.post('/foundation/dictionary_keys/saveOrUpdate', data, config),
  delete: (id: any, config?: AxiosRequestConfig) =>
    request.delete(`/foundation/dictionary_keys/${id}`, config),
  getValues: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Model.DictionaryValue[]>(
      `/foundation/dictionary_values/findValueByCode`,
      config,
    ),
  getAllValuePage: (config?: AxiosRequestConfig) =>
    request.get<any, GT.Response.Page<GT.Model.DictionaryValue>>(
      '/foundation/dictionary_values',
      config,
    ),
  updateValue: (data: GT.DTO.CreateDictionaryValueDto, config?: AxiosRequestConfig) =>
    request.post('/foundation/dictionary_values/saveOrUpdate', data, config),
  deleteValue: (id: number, config?: AxiosRequestConfig) =>
    request.delete(`/foundation/dictionary_values/${id}`, config),
  getMaxSort: (id: number) =>
    request.get<any, number>(`/foundation/dictionary_values/sort/max/${id}`),
};
