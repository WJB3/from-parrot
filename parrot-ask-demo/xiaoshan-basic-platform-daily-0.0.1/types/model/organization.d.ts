import { Teacher } from './teacher';

export interface Organization {
  id: number;
  name: string;
  parentId?: number;
  sort: number;
  /**
   * 部门人数
   */
  count?: number;
  /**
   * 部门角色id
   */
  roleId: number;
  departments?: Organization[];
  teachers?: Teacher[];
  defaultState: 0 | 1;
  /**
   * 1:部门组 2:部门
   */
  type: 1 | 2;
}
