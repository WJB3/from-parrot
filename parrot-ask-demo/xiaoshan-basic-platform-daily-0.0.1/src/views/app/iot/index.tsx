import React from 'react';
import { Switch } from 'react-router-dom';
import PrivateRoute from 'src/components/PrivateRoute';
import DeviceListPage from './device/List';
export default function IotApp() {
  return (
    <Switch>
      <PrivateRoute id={355} path={'/app/354/355'} exact component={DeviceListPage}></PrivateRoute>
    </Switch>
  );
}
