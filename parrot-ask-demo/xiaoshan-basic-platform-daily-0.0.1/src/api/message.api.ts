// 消息中心
import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';

export default {
    // 新建消息
    create: (params: any, config?: AxiosRequestConfig) => 
        request.post("/message/messages", params, config),

    // 获取我的消息列表
    getPage: (data: GT.DTO.SearchMessageDto, config?: AxiosRequestConfig) =>
        request.get<any, GT.Response.Page<GT.Model.Message>>("/message/messages/me", {...config, params: {...data, ...config?.params}}),

    // 删除消息
    delete: (config?: AxiosRequestConfig) =>
        request.delete("/message/messages/me", config),
    
    // 阅读消息
    read: (data: {all?: Boolean, ids?: number[]} ,config?: AxiosRequestConfig) =>
        request.put("/message/messages/me/state/read", data, config),

    // 获取未读消息数量
    unreadCount: (config?: AxiosRequestConfig) =>
        request.get<any, number>("/message/messages/me/unread_count", config),
}