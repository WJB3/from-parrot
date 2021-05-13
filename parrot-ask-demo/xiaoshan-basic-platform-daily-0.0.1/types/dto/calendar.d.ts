export interface CreateCalendarEvent {
  endDate: string;
  id?: number;
  notes: string;
  startDate: string;
  /**
   * 1:日常
   * 2:周末
   * 3：节假日
   * 4:考试
   * 5:日程
   * 6:调休
   */
  type: 1 | 2 | 3 | 4 | 5 | 6;
  adjustments?: { dayOfWeek: number; detailDate: string; itemId: number }[];
}
