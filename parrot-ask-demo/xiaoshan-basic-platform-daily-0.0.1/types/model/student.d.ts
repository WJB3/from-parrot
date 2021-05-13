export interface Student {
  id: number;
  gender?: number;
  name: string;
  phone: string;
  classId: number;
  /**
   * 年级
   */
  enrollmentYear: number;
  /**
   * 年段
   * */
  sectionId: number;
  /**
   * 班级名称
   */
  className: string;
  /**
   * 年纪名称
   */
  gradeName: string;
  /**
   *  IC卡号
   */
  icCardNo: string;
  /**
   * 住校
   */
  livingCondition: number;
  /**
   * 年段名称
   */
  sectionName: string;
  /**
   * 学生状态
   */
  state: number;
  /**
   * 学号
   */
  studentNo: number;
  /**
   * 学生类型
   */
  studentType: number;

  idNo: string;
  idType: number;
  parents?: Parent[];
}
export interface Parent {
  id: number;
  name: string;
  phone: string;
  relation: string;
  unit: string;
  number: number; // 家长1 家长2
}
export interface StudentFace {
  id: number;
  description: string;
  fileId?: number;
  url?: string;
  className: string;
  gradeName: string;
  sectionName: string;
  studentNo: string;
  gender: number;
  icCardNo: string;
  name: string;
  passResult: number;
  deleteStatus: number;
  downloadStatus: number;
}
export interface PreStudentFace {
  id: number;
  description: string;
  fileId?: number;
  url?: string;
  className: string;
  idNo: string;
  gender: number;
  idTypeName: string;
  passResult: number;
  deleteStatus: number;
  downloadStatus: number;
}
