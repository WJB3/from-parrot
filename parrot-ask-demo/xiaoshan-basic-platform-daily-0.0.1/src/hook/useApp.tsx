/*
 * @Author: xuhansong
 * @Date: 2020-09-03 12:06:38
 * @Last Modified by:   xuhansong
 * @Last Modified time: 2020-09-03 12:06:38
 *
 */
import { useGlobalState } from 'src/store';
import GT from 'types';
export default function useApp() {
  const [state] = useGlobalState();
  const { permissions } = state;
  //  传入menuid，获取menu的路径
  const getMenuPath = (id: number) => {
    let current = permissions?.get(id);
    const path = [];
    while (current) {
      path.unshift(current);
      if (current.parentId) {
        current = permissions?.get(current.parentId);
      } else {
        current = undefined;
      }
    }
    return path;
  };
  // 获取menu下一级的menus
  const getSubMenus = (id?: number) => {
    const menus: GT.Model.Menu[] = [];
    [...(permissions?.values() || [])].forEach((menu) => {
      if (menu.parentId === id) {
        menus.push(menu);
      }
    });
    return menus;
  };
  // /app/:id/:pageId 在内置应用中，由于是写死id和pageId匹配路由，无法从match中获取，所以按设定解析url获取id和pageId
  const parseURL = (url: string) => {
    const array = url.split('/');
    return {
      id: array[2],
      pageId: array[3],
    };
  };
  const hasPermission = (id: number) => permissions?.has(Number(id));
  return {
    getMenuPath,
    getSubMenus,
    parseURL,
    hasPermission,
  };
}
