export interface CreateScheduleDto {
  id?: number;
  isEnable: 0 | 1;
  remark?: string;
  restName: string;
  restNameCopy?: string;
  gradeName?: string;
  restViewName?: string;
  restRange: ScheduleRange[];
  details: ScheduleDetail[];
}

interface ScheduleRange {
  enrollmentYear: number;
  gradeName: string;
  restName: string;
  sectionName: string;
  sectionType: number;
}

export interface ScheduleDetail {
  endTime: string;
  startTime: string;
  sectionName: string;
  sectionOrder: number;
  timeRange: 0 | 1 | 2;
  type: number;
}
