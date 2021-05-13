export interface BaseUser {
  lastLoginTime?: string;
  loginCount?: string;
  /**
   * -1 禁用 0未激活 1启用
   */
  state: -1 | 0 | 1;
  roles: string[];
  userId: number;
  username: string;
  name: string;
}
export interface User extends BaseUser {
  isManager: boolean;
  passwordState: boolean;
  roleIds: [];
}
export interface UserTeacher extends BaseUser {
  departments: string[];
  avatarUrl?:string|null
}

export interface UserParent extends BaseUser {
  students: SimpleStudent[];
  id: number;
  avatarUrl?:string|null
}
export interface SimpleStudent {
  className: string;
  gradeName: string;
  name: string;
  studentNo: string;
}
export interface UserTeacherStatistic {
  activeCount: number;
  todayLoginCount: number;
  totalCount: number;
}

export interface UserParentStatistic {
  activeCount: number;
  todayLoginCount: number;
  parentCount: number;
  studentCount: number;
}
