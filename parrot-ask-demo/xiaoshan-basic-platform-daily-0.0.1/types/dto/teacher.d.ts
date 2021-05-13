export interface SearchTeacherParams {
  name?: string;
  icCardNo?: string;
  phone?: string;
  gender?: number;
  budgetedPost?: number;
  teacherNames?: string[];
  departmentIds?: string | number;
  current?: number;
  size?: number;
  /**
   * 是否只查询未分配部门的老师
   */
  flag?: boolean;
  singleDepartment?: boolean; // 是否单部门导出
}
export interface SearchTeacherFaceParams {
  current?: number;
  size?: number;
  keyWord?: string;
  departmentIds?: string;
  passResult?: number;
}

export interface CreateTeacherDto {
  id?: number;
  name: string;
  phone: number;
  budgetedPost?: number;
  departmentIds: number[];
  employeeNo?: string;
  gender: number;
  icCardNo: string;
  idType: number;
  idNo: string;
}
