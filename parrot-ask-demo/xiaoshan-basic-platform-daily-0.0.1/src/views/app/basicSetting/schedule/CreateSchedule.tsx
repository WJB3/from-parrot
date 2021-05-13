import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ActionType, useGlobalState } from 'src/store';
import ScheduleForm from './component/ScheduleForm';
import qs from 'qs';
export default function CreateSchedulePage(props: RouteComponentProps) {
  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({ type: ActionType.SetBreadcrumb, payload: [{ zhName: '新增作息时间' }] });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);
  const searchParams = qs.parse(props.location.search.substr(1));
  return (
    <div>
      <ScheduleForm copyId={searchParams.copyId}></ScheduleForm>
    </div>
  );
}
