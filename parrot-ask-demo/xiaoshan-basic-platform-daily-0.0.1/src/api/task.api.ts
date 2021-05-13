import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';

export default {
    // 获取代办事项列表
    getPage: (data: GT.DTO.SearchTaskDto, config?: AxiosRequestConfig) => 
        request.get<any, GT.Response.Page<GT.Model.Task>>("/workflow/tasks/me", {...config, params: {...data, ...config?.params}}),

    // 获取代办事项数量
    toDoCount: (config?: AxiosRequestConfig) => 
        request.get<any, number>('/workflow/tasks/me/to_do_count', config),

    // 批量审批
    process: (data: any, config?: AxiosRequestConfig) =>
        request.put("/workflow/flows/process", data, config),

    // 获取成果申报的状态
    getMyDeclareDetail: (id: number, config?: AxiosRequestConfig) => 
    request.get<any, any>(`/achievement/results/${id}/status`, config),
}