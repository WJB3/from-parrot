import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ActionType, useGlobalState } from 'src/store';
import ScheduleForm from './component/ScheduleForm';
export default function EditSchedulePage(props: RouteComponentProps<{ id: any }>) {
  const [, dispatch] = useGlobalState();
  useEffect(() => {
    dispatch({ type: ActionType.SetBreadcrumb, payload: [{ zhName: '编辑作息时间' }] });
    return () => {
      dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
    };
  }, []);
  return (
    <div>
      <ScheduleForm id={props.match.params.id}></ScheduleForm>
    </div>
  );
}
