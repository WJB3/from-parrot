/*
 * @Author: xuhansong
 * @Date: 2020-08-27 16:34:01
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-10-19 16:21:04
 * 鉴权路由组件
 */
import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { useGlobalState } from 'src/store';
import { Empty, Button, Space } from 'antd';
interface PrivateRouteProps extends RouteProps {
  /**
   * 需要鉴权的id值
   */
  id: number | number[];
  every?: boolean;
  /**
   * 重定向可配置，如果配置，则会自动重定向
   */
  redirect?: string;
}

export default function PrivateRoute(props: PrivateRouteProps) {
  const [state] = useGlobalState();
  let hasPermission: boolean | undefined;
  if (Array.isArray(props.id)) {
    if (props.every) {
      hasPermission = props.id.every((id) => state.permissions?.has(id));
    } else {
      hasPermission = props.id.some((id) => state.permissions?.has(id));
    }
  } else {
    hasPermission = state.permissions?.has(props.id);
  }
  const replaceComponent = props.redirect
    ? () => <Redirect to={props.redirect || '/app'} />
    : () => (
        <Empty
          style={{ marginTop: '20vh' }}
          image='https://api.xshs.cn:8688/frontend/xszx/empty.svg'
          imageStyle={{
            height: 60,
          }}
          description={<span>您暂无该应用的权限，请联系管理员</span>}>
          <Space>
            <Button
              onClick={() => {
                window.history.go(-1);
              }}>
              返回
            </Button>
            <Button
              type='primary'
              onClick={() => {
                window.location.reload();
              }}>
              重试
            </Button>
          </Space>
        </Empty>
      );
  const component = hasPermission ? props.component : replaceComponent;
  return <Route {...props} component={component} />;
}
PrivateRoute.defaultProps = {
  every: false,
};
