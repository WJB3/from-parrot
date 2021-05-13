/**
 * state 1:开启 0：关闭
 * defaultState: 0:自建角色 1:系统内置角色
 */
export interface Role {
  id: number;
  name: string;
  zhName: string;
  state: 0 | 1;
  count: number;
  defaultState: 0 | 1;
  remarks: string;
}

export interface RoleDataScope {
  /**
   * 1:老师
   * 2:学生
   */
  dataType: 1 | 2;
  /**
   * 0:无
   * 1:全部
   * 2:学段
   */
  scope: 0 | 1 | 2;
  sectionType?: number;
}
