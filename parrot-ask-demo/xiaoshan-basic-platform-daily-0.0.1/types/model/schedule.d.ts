export interface Schedule {
  id: number;
  /**
   * 0:启用 1禁用
   */
  isEnable: 0 | 1;
  ranges: ScheduleRange[];
  remark: string;
  restName: string;
  beginTime: string;
}
export interface ScheduleRange {
  enrollmentYear: number;
  gradeName: string;
  restName: string;
  restId: number;
  sectionName: string;
  sectionType: number;
}

export interface ScheduleCheckResult {
  checkResult: 0 | 1;
  sections: ScheduleRange[];
}
