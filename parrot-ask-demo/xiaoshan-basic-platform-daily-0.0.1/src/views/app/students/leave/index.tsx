import React from 'react';
import { Switch, RouteComponentProps } from 'react-router-dom';
import LeaveList from './leaveList';
import LeaveHistory from './leaveHistory';
import SummaryPage from './summary';
import PrivateRoute from 'src/components/PrivateRoute';
import CreateLeave from './component/CreateLeave';
import LeaveDetail from './component/LeaveDetail';
import Workflow from './flow';
import LeavePassDetail from './component/LeavePassDetail';

export default function BaseDataApp(props: RouteComponentProps) {
  return (
    <Switch>
      <PrivateRoute id={365} path={'/app/362/365'} exact component={LeaveList}></PrivateRoute>
      <PrivateRoute id={366} path={'/app/362/366'} exact component={LeaveHistory}></PrivateRoute>
      <PrivateRoute id={367} path={'/app/362/367'} exact component={SummaryPage}></PrivateRoute>
      <PrivateRoute id={406} path={'/app/362/406'} exact component={Workflow}></PrivateRoute>

      <PrivateRoute id={366} path={'/app/362/366/createLeave'} exact render={(props)=>(<CreateLeave></CreateLeave>)} ></PrivateRoute>
      <PrivateRoute id={366} path={'/app/362/365/LeaveDetail/:id'} exact render={(props)=>(<LeaveDetail recordId={props.match.params.id} onRef={(ref) => console.log(ref)}></LeaveDetail>)} ></PrivateRoute>
      <PrivateRoute id={366} path={'/app/362/366/LeaveDetail/:id'} exact render={(props)=>(<LeaveDetail recordId={props.match.params.id} onRef={(ref) => console.log(ref)}></LeaveDetail>)} ></PrivateRoute>
      <PrivateRoute id={366} path={'/app/362/366/LeavePassDetail/:id'} exact render={(props)=>(<LeavePassDetail recordId={props.match.params.id}></LeavePassDetail>)} ></PrivateRoute>
      <PrivateRoute id={366} path={'/app/362/366/createLeave/:id'} exact render={(props)=>(<CreateLeave recordId={props.match.params.id}></CreateLeave>)} ></PrivateRoute>
    </Switch>
  );
}