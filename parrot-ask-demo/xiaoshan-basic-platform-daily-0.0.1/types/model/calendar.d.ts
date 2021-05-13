import { Calendar } from 'antd';

export interface CalendarDay {
  id: number;
  detailDate: string;
  items?: CalendarEvent[]; // 事项
  adjustment?: CalendarAdjustment; // 调休
}

export interface CalendarWeek {
  id?: number;
  number: number;
  weekSize?: 1 | 2;
  startDay: string;
  endDay: string;
}
export interface CalendarEvent {
  adjustments?: CalendarAdjustment[];
  id: number;
  dayId: number;
  /**
   * 1:日常
   * 2:周末
   * 3：节假日
   * 4:考试
   * 5:日程
   * 6：调休
   */
  type: 1 | 2 | 3 | 4 | 5 | 6;
  notes: string;
  startDate: string;
  endDate: string;
}

export interface CalendarAdjustment {
  itemId: number;
  dayOfWeek: number;
  detailDate: string;
}
