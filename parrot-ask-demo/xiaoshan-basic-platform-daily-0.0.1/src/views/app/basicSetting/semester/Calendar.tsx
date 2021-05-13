import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import SchoolCalendarPage from '../calendar';
export default function SemesterCalendar(props: RouteComponentProps<{ semesterId: any }>) {
  const id = Number(props.match.params.semesterId) || undefined;
  return <SchoolCalendarPage id={id}></SchoolCalendarPage>;
}
