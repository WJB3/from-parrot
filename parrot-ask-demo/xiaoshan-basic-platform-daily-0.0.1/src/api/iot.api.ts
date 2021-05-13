import request, { iotInstance } from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';
export default {
  getPage: (data: any, config?: AxiosRequestConfig) =>
    iotInstance.post<any, GT.Response.Page<GT.Model.IoT_Device>>('/eqp/v1/dev/page', data, config),
  getProductPage: (config?: AxiosRequestConfig) =>
    iotInstance.post('/eqp/v1/product/type/page', config),
  getProducts: (data?: { typeName: string }, config?: AxiosRequestConfig) =>
    iotInstance.post('/eqp/v1/product/type/list', data, config),
};
