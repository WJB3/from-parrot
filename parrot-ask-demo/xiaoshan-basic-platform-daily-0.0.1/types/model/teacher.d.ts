import { BaseUser } from './user';

export interface Teacher {
  id: number;
  gender?: number;
  name: string;
  phone: string;
  /**
   * 编制
   */
  budgetedPost: number;
  /**
   * 部门ids
   */
  departmentIds: number[];
  departmentName: string;
  /**
   * 职工号
   */
  employeeNo: string;
  /**
   * IC卡号
   */
  icCardNo: string;
  /**
   * 证件号
   */
  idNo: string;
  /**
   * 证件类型
   */
  idType: number;
  /**
   * 职位
   */
  position?: string;
  // 兼容群组中的教师Id
  memberId?: number;
  parentIds?: number[];
}

export interface TeacherFace {
  id: number;
  departmentIds: number[];
  departmentName: string;
  description: string;
  employeeNo?:string;
  fileId?: number;
  url?: string;
  icCardNo: string;
  idNo?: string;
  name: string;
  passResult: number;
  phone: string;
  deleteStatus:number;
  downloadStatus:number;
  nickname?:string;
}
