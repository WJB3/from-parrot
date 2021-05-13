import Push from '../model/platform';

export interface CreatePushItemParmas {
  // 应用id
  applicationId?: number;
  // 事项编码 
  code?: string;
  // 推送描述 
  detail?: string;
  // 事项名称
  name?: string;
  // 模版列表
  templates?: Push.PushTemplate[];
  // 其他参数
  extra?: string;
}

export interface EditPushItemParmas {
  // 应用id
  applicationId?: number;
  // 事项编码 
  code?: string;
  // 推送描述 
  detail?: string;
  // 事项名称
  name?: string;
  //
  openState: number;
  // 模版列表
  templates?: string[];
  // 其他参数
  extra?: string;
}