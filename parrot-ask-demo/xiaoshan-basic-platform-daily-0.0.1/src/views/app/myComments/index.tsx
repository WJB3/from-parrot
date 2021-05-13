import React from 'react';
import { Switch, RouteComponentProps } from 'react-router-dom';
import PrivateRoute from 'src/components/PrivateRoute';
import TaskList from './list';
import ResultDetail from './componets/resultDetail';

export default function BaseDataApp(props: RouteComponentProps) {
  return (
    <Switch>
      <PrivateRoute id={428} path={'/app/427/428'} exact component={TaskList}></PrivateRoute>
      <PrivateRoute id={428} path={'/app/427/428/ResultDetail/:id'} exact render={(props)=>(<ResultDetail recordId={props.match.params.id}></ResultDetail>)} ></PrivateRoute>
    </Switch>
  );
}