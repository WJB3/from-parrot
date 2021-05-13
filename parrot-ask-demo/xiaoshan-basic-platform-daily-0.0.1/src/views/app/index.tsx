/*
 * @Author: xuhansong
 * @Date: 2020-08-27 15:45:31
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-10-22 11:51:20
 * app容器应用页面，主要用与渲染左侧sidebar和自建应用，以及外部应用
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Layout, Spin, Menu, Row, Empty } from 'antd';
import { Switch, Route, RouteComponentProps, Link } from 'react-router-dom';
import { useRequest, useWhyDidYouUpdate } from 'ahooks';
import ReportAwardListPage from 'src/views/app/reportInfo/ReportAwardList';
import api from 'src/api';
import GT from 'types';
import qs from 'qs';
import PrivateRoute from 'src/components/PrivateRoute';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import IconFont from 'src/components/IconFont';
import { token } from 'src/utils';
import { useGlobalState, ActionType } from 'src/store';
const { Sider, Content } = Layout;

export default function AppPage(props: RouteComponentProps<{ id: string; pageId: string }>) {
  const { id, pageId } = props.match.params;
  const [state, dispatch] = useGlobalState();
  const searchParams = qs.parse(props.location.search.substr(1));
  const { data = [], error, loading } = useRequest(
    () =>
      api.user
        .getPermissions({
          level: 3,
          appId: id,
        })
        .then((res) => {
          // if (!Number(pageId)) {
          //   delete res[0]?.permissions?.[0]?.permissions;
          // }
          return res;
        }),
    {
      refreshDeps: [],
    },
  );
  const renderMenuItem = (app: GT.Model.Menu, path?: any) => {
    if (app.permissions && app.permissions.length) {
      return (
        <Menu.SubMenu
          key={app.id}
          icon={app.navBarIconUrl ? <IconFont type={app.navBarIconUrl}></IconFont> : null}
          title={app.zhName}>
          {app.permissions.map((r) => renderMenuItem(r, `${path || '/app'}/${app.id}`))}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={app.id} icon={app.navBarIconUrl ? <IconFont type={app.navBarIconUrl}></IconFont> : null} title={app.zhName}>
          <Link to={path ? `${path}/${app.id}` : `/app/${app.id}`}>{app.zhName}</Link>
        </Menu.Item>
      );
    }
  };
  const defaultSelectedKeys = [id, pageId];

  // 外部应用跳转到内部 面包屑统一清除 
  useEffect(() => {
    // 清空面包屑
    dispatch({ type: ActionType.SetBreadcrumb, payload: [] });
  }, [id])
  // 避免字典页面无限刷新的问题 应该是searchParams导致的刷新？？
  const BasicSettingApp = useMemo(() => React.lazy(() => import('./basicSetting')), [
    id,
    pageId,
    searchParams.tab,
  ]);
  const PermissionApp = useMemo(() => React.lazy(() => import('./permission')), [
    id,
    pageId,
    searchParams.tab,
  ]);
  const BaseDataApp = useMemo(() => React.lazy(() => import('./baseData')), [
    id,
    pageId,
    searchParams.tab,
  ]);
  const AwardInfoApp = useMemo(() => React.lazy(() => import('./awardInfo')), [
    id,
    pageId,
    searchParams.tab,
  ]);
  const IotApp = useMemo(() => React.lazy(() => import('./iot')), [id, pageId, searchParams.tab]);
  const ReportInfoApp = useMemo(() => React.lazy(() => import('./reportInfo')), [
    id,
    // pageId,
    searchParams.tab,
  ]);
  const leaveApp = useMemo(() => React.lazy(() => import('./students/leave')), [
    id,
    pageId,
    searchParams.tab,
  ]);

  // console.log('刷新iframe 🐿️',);
  // useWhyDidYouUpdate('useWhyDidYouUpdateComponent', { ...props, data, id, pageId, tab: searchParams.tab });

  const assessmentApp = useMemo(() => React.lazy(() => import('./assessment')), [id, pageId, searchParams.tab]);
  const myCommentsApp = useMemo(() => React.lazy(() => import('./myComments')), [id, pageId, searchParams.tab]);
  const externalApp = useMemo(() => {
    return <PrivateRoute
      id={Number(id)}
      path='/app/:id'
      exact
      component={(props: RouteComponentProps<any>) => { 
        return <iframe
        id='iframe'
        frameBorder={0}
        width={'100%'}
        style={{ height: 'calc(100vh - 155px)' }}
        src={`${state.permissions?.get(Number(props.match.params.id))?.path}?token=${token.get()}&refreshToken=${token.getRefresh()}${searchParams.id ? "&id="+ searchParams.id : ""}`}></iframe>}}>   
        </PrivateRoute>}, [data, id, pageId, searchParams.tab]);

    const externalApp2 = useMemo(() => {
      return <PrivateRoute
        id={Number(id)}
        path='/app/:id/:pageId'
        component={(props:RouteComponentProps<any>) => { 
          return <iframe
          id='iframe'
          frameBorder={0}
          width={'100%'}
          style={{ height: 'calc(100vh - 155px)' }}
          src={`${state.permissions?.get(Number(props.match.params.pageId))?.path}?token=${token.get()}&refreshToken=${token.getRefresh()}${searchParams.id ? "&id="+ searchParams.id : ""}`}></iframe>}}>   
          </PrivateRoute>}, [data, id, pageId, searchParams.tab]);

  return loading ? (
    <Row justify='center' style={{ marginTop: '30vh' }}>
      <Spin></Spin>
    </Row>
  ) : (
    <Layout className='App'>
      <Spin style={{ height: '100%' }} size={'large'} spinning={loading}></Spin>
      <Sider style={{ overflow: 'auto' }}>
        <Menu
          mode='inline'
          theme='dark'
          defaultSelectedKeys={defaultSelectedKeys}
          defaultOpenKeys={defaultSelectedKeys}>
          {data[0]?.permissions?.map((d) => renderMenuItem(d))}
        </Menu>
      </Sider>
      <Content style={{ padding: 10, background: '#eee' }}>
        <PageBreadcrumb
          id={
            Number(searchParams.tab) || Number(state.tabId) || Number(pageId) || Number(id)
          }></PageBreadcrumb>
        <div
          className='app_container'
          style={{
            background: '#fff',
            position: 'relative',
            padding: 10,
            minHeight: 'calc(100% - 43px)',
            overflow: 'auto',
          }}>
          {/* 定义了自建应用的路由 */}
          <Switch>
            {/* 基础设置应用 id:2 */}
            <PrivateRoute id={2} path='/app/2/:pageId' component={BasicSettingApp}></PrivateRoute>
            {/* 基础数据平台 id:8 */}
            <PrivateRoute id={8} path='/app/8/:pageId' component={BaseDataApp}></PrivateRoute>
            {/* 权限管理 id:14 */}
            <PrivateRoute id={14} path='/app/14/:pageId' component={PermissionApp}></PrivateRoute>
            {/* 信息采集 id:311 */}
            <PrivateRoute id={311} path='/app/311/:pageId' component={AwardInfoApp}></PrivateRoute>
            {/* 物联网  id:354 */}
            <PrivateRoute id={354} path='/app/354/:pageId' component={IotApp}></PrivateRoute>
            {/* 我的填报 id: 345 */}
            <PrivateRoute id={345} path='/app/345' component={ReportInfoApp}></PrivateRoute>
            {/* 学生管理 id：361 */}
            <PrivateRoute id={362} path='/app/362/:pageId' component={leaveApp}></PrivateRoute>
            {/* 教师评价管理 id: 407 */}
            <PrivateRoute id={407} path='/app/407/:pageId' component={assessmentApp}></PrivateRoute>
            {/* 我的评价 id：427 */}
            <PrivateRoute id={427} path='/app/427/:pageId' component={myCommentsApp}></PrivateRoute>
            {/* 如果只有appId，认定为三方应用 */}
            {externalApp}
            {externalApp2}
            {/* 招生系统 */}
            <Route
              path='*'
              component={() => (
                <Row align='middle' justify='center'>
                  <Empty description='该应用暂未开放' />
                </Row>
              )}></Route>
          </Switch>
          {/* 外部应用 iframe嵌套 todo */}
        </div>
      </Content>
    </Layout>
  );
}
