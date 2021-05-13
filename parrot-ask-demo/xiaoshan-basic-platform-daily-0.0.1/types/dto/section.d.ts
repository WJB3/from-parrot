export interface CreateSectionDto {
  /**
   * 1高中 2初中 3预备班级
   */
  type: 1 | 2 | 3;
  currentYear: number;
  namingMethod: number;
  numbers: number[];
}

export interface CreateClassDto {
  classType: number;
  enrollmentYear: number;
  headTeacherId?: number;
  id?: number;
  orderNumber: number;
  roomId?: number;
  sectionId: number;
}

export interface SearchClassParams {
  sectionId?: nmumber;
  sectionType?: number;
  enrollmentYear?: number | string;
  classType?: number;
  headTeacherName?: string;
  all?: boolean;
  prepare?: boolean;
  [key: string]: any;
}

export interface CreateGradeLeaderDto {
  id: number;
  teacherId: number;
  sectionId: number;
  enrollmentYear: number;
  position: string;
}
