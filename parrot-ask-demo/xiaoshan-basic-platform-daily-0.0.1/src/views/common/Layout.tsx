/*
 * @Author: xuhansong
 * @Date: 2020-08-27 15:42:44
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-12-11 11:17:13
 * 通用Layout
 */
import React, { useState, Suspense, useEffect, useRef, useMemo } from 'react';
import { Layout, Menu, Row, Avatar, Modal, Spin, Alert, Space, Divider, Badge } from 'antd';
import { PoweroffOutlined, BellOutlined, SettingOutlined } from '@ant-design/icons';
import { Link, Switch, Route, RouteComponentProps, useHistory, Redirect } from 'react-router-dom';
import GuideTeacherModal from 'src/views/app/reportInfo/studentReport/component/GuideTeachers'
import SelectMemberModal, {tabType} from 'src/components/selectMember';
import { onRelogin } from 'src/api/request';

import * as style from './style';
import NotFound from './404';
import { token } from '../../utils';
import api from '../../api';
import routes from 'src/routes';
import GT from 'types';
import AppPage from '../app';
import { useGlobalState, ActionType } from 'src/store';
import { useRequest } from 'ahooks';
import AccountSetting from './SettingAccount';
import useSocket from 'src/hook/useSocket';
import IconFont from 'src/components/IconFont';
import BindWechat from './BindWechat';
const { Header, Sider, Content } = Layout;

export default function GtLayout(props: RouteComponentProps) {
  const [state, dispatch] = useGlobalState();
  const socket = useSocket();
  const [tabType, setTabType] = useState<tabType[]>([])
  const [teachers, setTeachers] = useState<GT.Model.Teacher[]>()
  const modal = useRef<GT.Modal.Ref>();
  const teacherModal = useRef<GT.Modal.Ref>();

  const init = () =>
    Promise.all([
      api.user.getPermissions({ style: 2, level: 1 }),
      api.dictionary.getAllUsed(),
      api.user.getMe(),
    ]);
  useEffect(() => {
    init().then(([permissions, dictionary, user]) => {
      dispatch({
        type: ActionType.INIT,
        payload: {
          permissions,
          dictionary,
          user,
          instance: api.request,
        },
      });
      //  如果用户未修改过密码
      if (user.passwordState) {
        props.history.push('/account/active');
      } else {
        socket.init();
      }
    });
    // socket.init();
  }, []);

  useEffect(() => {
    window.addEventListener(
      'message',
      (event) => {
        console.log(event, '收到打开弹窗的消息');
        if (event.data.type === 'selectMemberModal:init') {
          // 获取参数
          if (event.data.params) {
            if (event.data.params.type) {
              const selectType = event.data.params.type || 0;
              const data = event.data.params.data || new Map();
              switch (selectType) {
                case 1:
                  setTabType(['branch', 'personnel', 'role']);
                  break;
                case 2:
                  setTabType(['organization', 'group']);
                  break;
                case 3:
                  setTabType(['role']);
                  break;
                case 4:
                  setTabType(['organization', 'group']);
                  break;
                default:
                  setTabType([]);
                  break;
              }
              modal.current?.setMembers(data);
            } else {
              if (Array.isArray(event.data.params.tabType)) {
                // 传过来的是数组
                setTabType([...event.data.params.tabType]);
              } else {
                // 不是数组
                if (['organization', 'group', 'student', 'parent'].includes(event.data.params.tabType)) {
                  setTabType([event.data.params.tabType]);
                }
              }
            }
          }
          // 获取参数

          modal.current?.setVisible(true);
        } else if (event.data.type === 'teacherModalList:init') {
          // 收到打开列表的消息
          let choose = event.data.teachers as any[];
          // choose.forEach((value) => {
          //   console.log(value);
          //   value.departmentName = "12";
          //   return value;
          // })
          console.log(choose, "🍎");
          setTeachers(choose);
          setTimeout(() => {
            teacherModal.current?.setTitle('当前成员详情');
            teacherModal.current?.setButtonTitle('新增教师');
            teacherModal.current?.setTeachers(choose);
            teacherModal.current?.setVisible(true);
          }, 250);
        } else if (event.data.type === 'relogin') {
          // 需要退出 外部应用refreshToken过期 通知退出
          const tips = event.data.tips;
          onRelogin(tips);
        } else if (event.data.type === 'addCrub') {
          // 监听外部-成果申报 添加面包屑
          let titles = event.data.titleNames;
          if (typeof titles === 'string') {
            // 强转
            titles = [event.data.titleNames]
          }
          // 数组格式
          let titleLists = [];
          for (const key in titles) {
            // 数组
            titleLists.push({"zhName": titles[key]});
          }
          console.log('添加面包屑', titleLists, titles);
          dispatch({
            type: ActionType.SetBreadcrumb,
            payload: titleLists,
          });
        } else if (event.data.type === 'removeCrub') {
          // 外部跳转 -成果申报 删除面包屑
          console.log('删除面包屑');
          dispatch({
            type: ActionType.SetBreadcrumb,
            payload: [],
          });
        }
      },
      false,
    );
  }, []);

  const logout = () => {
    Modal.confirm({
      title: '退出',
      content: '确认退出系统？',
      onOk: () => {
        token.remove();
        window.location.reload();
      },
    });
  };
  const renderMenuItem = (route: GT.Model.Route) => {
    if (route.routes && route.routes.length) {
      return (
        <Menu.SubMenu key={route.path} icon={route.icon} title={route.name}>
          {route.routes.map((r) => renderMenuItem(r))}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={route.path} icon={route.icon} title={route.name}>
          <Link to={route.path} style={{fontSize: 16, color: '#FFFFFF'}}>{route.name}</Link>
        </Menu.Item>
      );
    }
  };

  // 通过路由正则匹配获取当前menu的选中，展开状态
  const getDefaultSelectedKeys = (list: GT.Model.Route[], keys: Array<any> = []) => {
    for (let i = 0, max = list.length; i < max; i++) {
      const current = list[i];
      if (current.reg.test(props.location.pathname)) {
        keys.push(current.path);
        if (current.routes && current.routes.length) {
          getDefaultSelectedKeys(current.routes, keys);
        }
        break;
      }
    }
    return keys;
  };
  const defaultSelectedKeys = getDefaultSelectedKeys(routes, []);
  const history = useHistory();
  // 角标处理
  const [count, setCount] = useState(0);
  const getCount = () => {
    api.message.unreadCount().then((value) => {
      setCount(value);
    });
  };
  useEffect(() => {
    getCount();
  }, [props.location.pathname]);

  const { listen } = useSocket();
  useEffect(() => {
    return listen({
      type: 4,
      handler: () => {
        getCount();
      },
    });
  }, []);

  const mainApp = useMemo(() =>              
   <Switch>
     {/* 渲染了顶部导航栏的路由 */}
     <Redirect exact path='/' to='/workspace' />
     {routes.map((route, i) => {
     return <Route key={i} {...route} exact />;
     })}
     <Route path='/app/:id/:pageId' component={AppPage} />
     <Route path='/app/:id' component={AppPage} />
     {!state.user?.isManager && (
       <Route path={'/account/setting'} component={AccountSetting}></Route>
     )}
     <Route path={'/account/bindwechat'} component={BindWechat}/>
     <Route path={'*'} component={NotFound} />
   </Switch>, [state.user]);

  return (
    <Layout style={style.layout}>
      <Header style={style.header}>
        <Row justify={'space-between'} align={'middle'} style={{ height: '100%' }}>
          <img width='200px' src='https://api.xshs.cn:8688/frontend/title_bg.png' alt='' />
          <div style={{ flex: 1, padding: '0 20px 0 50px' }}>
            <Menu
              mode='horizontal'
              theme='dark'
              style={{backgroundColor: '#262D3B', lineHeight: "79px",marginTop:"-3px"}}
              selectedKeys={defaultSelectedKeys}
              openKeys={defaultSelectedKeys}>
              {routes.slice(0, routes.length - 1).map((route) => renderMenuItem(route))}
            </Menu>
          </div>
          <Space size='large' align='center' style={{ fontSize: 20, color: '#fff' }}>
            {/* <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' /> */}
            {/* <BellOutlined /> */}

            <Badge
              count={count}
              size='small'
              style={{ fontSize: 10, maxWidth: 30, padding: 0, paddingLeft: 4, paddingRight: 4, boxShadow: 'none', }}>
                <IconFont type="iconbell" style={{ fontSize: 22 }} onClick={() => history.push('/message')}></IconFont>
            </Badge>

            {!state.user?.isManager ? (
              <IconFont type="iconsettings" style={{ fontSize: 22 }} onClick={() => props.history.push('/account/setting')}></IconFont>
            ) : null}

            <IconFont type="iconlog-in" style={{ fontSize: 22 }} onClick={logout}></IconFont>
            <Divider type='vertical' style={{ background: '#fff' }}></Divider>
            <span style={{fontSize: 14, color: '#FFFFFF'}}>{state.user?.name}</span>
          </Space>
        </Row>
      </Header>
      <Layout>
        <Content style={{ overflowY: 'hidden', position: 'relative' }}>
          <Row justify='center'>
            <Spin style={{ marginTop: '30vh' }} spinning={!state.permissions} size='large'></Spin>
          </Row>
          {state.permissions && (
            <Suspense
              fallback={
                <Row justify='center' style={{ marginTop: '30vh' }}>
                  <Spin size='large' />
                </Row>
              }>
              {mainApp}
            </Suspense>
          )}
      <SelectMemberModal
        tabs={tabType}
        onRef={(ref) => (modal.current = ref)}
        onOk={(data) => {
          console.log(data, '返回选中数据');
          (document.getElementById('iframe') as any).contentWindow.postMessage(
            { type: 'selectMemberModal:data', payload: data },
            '*',
          );
        }}></SelectMemberModal>
      {teachers && teachers.length > 0 && <GuideTeacherModal
        teacherLists={teachers}
        onRef={(ref) => (teacherModal.current = ref)}
        onOk={(data) => {
          // 回调
          console.log(data, '返回选中教师的数据');
          (document.getElementById('iframe') as any).contentWindow.postMessage(
            { type: 'chooseTeachers:data', payload: data ? data : [] },
            '*',
          );
        }}/>}
        </Content>
      </Layout>
    </Layout>
  );
}
