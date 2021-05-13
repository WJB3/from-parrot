import request from './request';
import { AxiosRequestConfig } from 'axios';
import GT from 'types';
export default {
  getDayConfig: (id: number) =>
    request.get<any, GT.Model.CalendarDay[]>(`/setting/semesters/${id}/day_config`),
  createEvent: (id: number, data: GT.DTO.CreateCalendarEvent) =>
    request.post(`/setting/semesters/${id}/items`, data),
  updateEvent: (id: number, data: GT.DTO.CreateCalendarEvent) =>
    request.put(`/setting/semesters/${id}/items`, data),
  getEvent: (id: number) =>
    request.get<any, GT.Model.CalendarEvent>(`/setting/semesters/items/${id}`),
  deleteEvent: (id: number) => request.delete(`/setting/semesters/items/${id}`),
  getWeekConfig: (id: number) =>
    request.get<any, GT.Model.CalendarWeek[]>(`/setting/semesters/${id}/week_config`),
  updateWeekConfig: (id: number, data: GT.Model.CalendarWeek[]) =>
    request.put(`/setting/semesters/${id}/week_config`, data),
};
