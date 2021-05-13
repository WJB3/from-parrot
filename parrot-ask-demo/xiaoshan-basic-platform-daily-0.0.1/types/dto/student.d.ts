export interface CreateStudentDto {
  id?: string;
  classId: number;
  name: string;
  studentNo: number;
  icCardNo: number;
  idNo: string;
  idType: number;
  gender: number;
  studentType?: number;
  livingCondition?: number;
}
export interface SearchStudentFaceParams {
  current?: number;
  size?: number;
  keyWord?: string;
  sectionType?: number;
  enrollmentYear?: number;
  classId?: number;
  passResult?: number;
}

export interface SearchStudentParams {
  sectionType?: number;
  sectionId?: number;
  enrollmentYear?: number;
  classId?: number;
  studentNo?: number;
  icCardNo?: number;
  name?: string;
  gender?: number;
  state?: number;
  studentType?: number;
  livingCondition?: number;
  all?: boolean;
  parentName?: string;
  parentPhone?: string;
  current?: number;
  size?: number;
  /**
   * 1:基本数据 2：包含家长数据 3:包含人脸数据 4：住校情况
   */
  scope?: 1 | 2 | 3 | 4;
}
