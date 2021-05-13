export interface SearchUserTeacherParams {
  keyword?: string;
  departmentId?: number;
  roleId?: number;
  state?: number;
  current?: number;
  size?: number;
}

export interface SearchUserParentParams {
  current?: number;
  size?: number;
  sectionType?: 1 | 2;
  enrollmentYear?: number;
  classId?: number;
  name?: string;
  username?: string;
  state?: -1 | 0 | 1;
}
