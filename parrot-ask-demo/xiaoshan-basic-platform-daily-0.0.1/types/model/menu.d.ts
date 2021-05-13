export interface MenuSearchParams {
  /**
   * 1 type
   * 2 app
   * 3 nav_bar
   * 4 tab
   * 5 operation
   */
  level?: 1 | 2 | 3 | 4 | 5;
  /**
   * 1 管理
   * 2 个人
   */
  target?: 1 | 2;
  /**
   * 1 tree
   * 2 flat
   */
  style?: 1 | 2;
  appId?: number | string;
  /**
   *  查询parentId下的菜单
   */
  rootId?: number;
  /**
   *  接口返回的tree层数
   */
  size?: number;
}
export interface Menu {
  id: number;
  parentId?: number;
  icon?: string;
  name: string;
  path?: string;
  icon?: string;
  iconUrl?: string;
  navBarIconUrl?:string;
  permissions?: Menu[];
  zhName: string;
}
