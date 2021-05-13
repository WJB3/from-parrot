export interface Platform {
  // 应用id 
  applicationId: number;
  // 应用名称 
  applicationName: string;
  // 事项编码
  code: string;
  // 推送描述
  detail: string;
  // 事项id 
  id: number;
  // 推送事项
  name: string;
  // 是否开启
  openState: boolean;
  // 模版列表
  templates: PushTemplate[];
}

export interface PushTemplate {
  // 模版内容
  content: string;
  // 表单id
  formId?: number;
  // 模版id
  id?: number;
  // 是否开启 
  openState: boolean;
  // 推送类型 1 微信消息 2短信消息 3站内消息
  pushType: number;
  // 站内信标题
  title?: string;
}
