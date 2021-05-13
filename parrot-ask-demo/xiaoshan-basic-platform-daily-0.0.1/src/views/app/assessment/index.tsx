import React from 'react';
import { Switch, RouteComponentProps } from 'react-router-dom';
import PrivateRoute from 'src/components/PrivateRoute';
import TaskList from './task';
import CreateTask from './componet/CreateTask';

import AssessResult from './AssessResult'
import SubmitList from './submit';
import SubmitDetail from './SubmitDetail';
import RecordDetail from './componet/RecordDetail';
import qs from "qs";


export default function BaseDataApp(props: RouteComponentProps) {
  return (
    <Switch>
      <PrivateRoute id={408} path={'/app/407/408'} exact component={TaskList}></PrivateRoute>
      <PrivateRoute id={417} path={'/app/407/417'} exact component={SubmitList}></PrivateRoute>
      <PrivateRoute id={419} path={'/app/407/417/detail/:id'} exact component={SubmitDetail}></PrivateRoute>
      <PrivateRoute id={410} path={'/app/407/408/create'} exact render={(props)=>(<CreateTask></CreateTask>)} ></PrivateRoute>      
      <PrivateRoute id={410} path={'/app/407/408/detail/:id'} exact render={(props)=>(<CreateTask id={props.match.params.id}></CreateTask>)} ></PrivateRoute>

      {/* 任务考评结果 */}
      <PrivateRoute
        id={411}
        path='/app/407/408/accessResult/:id/:name'
        exact
        component={AssessResult}></PrivateRoute>

      {/* 查看提交考核 */}
      <PrivateRoute id={417} path={'/app/407/417/detail/:id/submitResultDetail/:taskId/:id/:taskName'} exact component={RecordDetail} ></PrivateRoute>
    </Switch>
  );
}