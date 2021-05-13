/**
 * 1 管理应用
 * 2 个人应用
 */
export declare type AppType = 1 | 2;

export interface App {
  id: number;
  target: AppType;
  icon?: string;
  name: string;
  path: string;
  navBarIconUrl?:string;
  permissions?: App[];
  zhName: string;
}
