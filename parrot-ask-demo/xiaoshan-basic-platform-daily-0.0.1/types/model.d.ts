import { CSSProperties } from 'react';
import { ActionType } from 'src/store';
import { User } from './model/user';

export interface Good {
  id: String;
}

export interface LoginRes {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  user_info: User;
}

export interface Action<T> {
  type: ActionType;
  payload: T;
}

export interface Route {
  path: string;
  component: any;
  name?: string;
  icon?: any;
  routes?: Route[]; // 子路由
  siblings?: Route[]; //  不现显示在左侧菜单中，但是与当前路由选中状态一致，通过reg配置
  reg: RegExp;
  exact?: boolean;
}
// }

export interface ExportRes {
  url: string;
  fileName: string;
}

export interface Style {
  [key: string]: CSSProperties;
}

export interface OperateLog {
  application: string;
  createTime: Date;
  ip: string;
  messageDetail: string;
  operationLocation: string;
  operationName: string;
  permissionIds: string;
  url: string;
  username: string;
}
export interface ImportFaceRecord {
  createDate: string;
  date: string;
  failed: number;
  fileName: string;
  success: number;
  url: string;
}

export interface ImportExcelRes<T> {
  correctData: number;
  wrongData: number;
  exportDTO: ExportRes;
  failDTOS: T[];
  fieldExportDTOS: T[];
  importHeader:any;
}

export interface SocketHandler {
  type?: number;
  handler: (e: any) => void;
}
export interface SocketMessage {
  /** 消息内容 */
  content: string;
  createdTime: number;
  id: number;
  /**
   * 1:通知
   * 2:透传
   */
  pushType: 1 | 2;
  /** 来源id*/
  sourceId: number;
  /** 来源类型 */
  sourceType: number;
  /** 跳转路径 */
  url?: string;
  /** 来源名称 */
  sourceName?: string;
  /** 消息标题 */ 
  title: string;
  /**
   * 1:系统消息
   * 2:通知公告
   * 3:业务消息
   * 4:待办
   */
  type: 1 | 2 | 3 | 4;
  /** 用户id */
  userId: number;
  /** 附加信息 */
  extra?: string;
  /** 业务类型 */
  businessType: number;
  /** 读取状态 */
  readState?: boolean;
  /** 审批状态 */
  state: number;
  /** 关联id */
  relatedId?: number;
  /** 关联类型 */
  relatedType?: number;
}

export * from './model/app';
export * from './model/menu';
export * from './model/role';
export * from './model/dictionary';
export * from './model/user';
export * from './model/teacher';
export * from './model/student';
export * from './model/section';
export * from './model/organization';
export * from './model/building';
export * from './model/group';
export * from './model/calendar';
export * from './model/schedule';
export * from './model/award';
export * from './model/services';
export * from './model/message';
export * from './model/task';
export * from './model/iot';
export * from './model/leave';
export * from './model/platform';
export * from './model/assessment';
export * from "./dto/collection";