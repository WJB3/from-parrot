export interface Section {
  id: number;
  name: string;
}

export interface SectionStatistic {
  classCount: number;
  gradeCount: number;
  parentCount: number;
  studentCount: number;
  sectionId: number;
  /**
   * 1高中 2初中 3预备
   */
  sectionType: 1 | 2 | 3;
  enrollmentYear?: number;
  sectionName?: string;
  gradeName?: string;
}

export interface Grade {
  enrollmentYear: number;
  name: string;
}

export interface Class {
  id: number;
  name: string;
  classType: number;
  enrollmentYear: number;
  headTeacherName?: string;
  headTeacherId?: number;
  roomName: string;
  floorId?: number;
  buildingId?: number;
  roomId?: number;
  sectionId?: number;
  sectionName: string;
  studentCount: 0;
  orderNumber: number;
}

export interface GradeLeader {
  id: number;
  name: string;
  position: string;
  teacherId: number;
}

export interface Semester {
  id: number;
  endDate: Date;
  endYear: number;
  orderNo: 1 | 2;
  startDate: Date;
  startYear: number;
  state: number;
}
export interface SemesterLog {
  id: number;
  createdTime: Date;
  startYear: number;
  endYear: number;
  orderNo: 1 | 2;
  /**
   * 0:同步中
   * 1:同步成功
   * -1:同步失败
   */
  state: 0 | 1 | -1;
}
export interface NextSemester {
  nextEndYear: number;
  nextOrderNo: number;
  nextStartYear: number;
}
