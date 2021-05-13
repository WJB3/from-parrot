/*
 * @Author: xuhansong
 * @Date: 2020-08-27 15:40:56
 * @Last Modified by: xuhansong
 * @Last Modified time: 2020-09-02 09:12:33
 * 顶部导航路由定义
 *
 */

import GT from 'types';
import WorkspacePage from './views/workspace/Workspace';
import ManageAppPage from './views/workspace/App';
import MessagePage from './views/app/messageCenter';
const routes: GT.Model.Route[] = [
  {
    path: '/workspace',
    reg: /^\/workspace$/,
    name: '首页',
    exact: true,
    component: WorkspacePage,
  },
  {
    path: '/app',
    reg: /^\/app/,
    name: '智慧应用',
    component: ManageAppPage,
  },
  {
    path: '/message',
    reg: /^\/message$/,
    name: '消息中心',
    exact: true,
    component: MessagePage,
  },
];
export default routes;
