import { produce } from 'immer';
import { ActionType } from './actions';
import * as utils from '../utils';

import GT from 'types';
const { token } = utils;

export const initialState: GlobalState = {
  count: 0,
  token: token.get(),
  user: null,
  permissions: null,
  breadcrumb: [],
  dictionary: new Map(),
  socketHandlers: [],
  tabId:undefined
};
export interface GlobalState {
  count: number;
  token: string | null;
  user: GT.Model.User | null;
  permissions: Map<number, GT.Model.Menu> | null;
  breadcrumb: { zhName: string }[];
  dictionary: Map<string, Map<number, string>>;
  socketHandlers: GT.Model.SocketHandler[];
  tabId?:string;
}

export type GlobalReducer = React.Reducer<GlobalState, GT.Model.Action<any>>;

// 登录成功
const loginSuccess = (state: GlobalState, action: GT.Model.Action<GT.Model.LoginRes>) =>
  produce(state, (draft) => {
    draft.token = action.payload.access_token;
    draft.user = action.payload.user_info;
    token.set(
      `${action.payload.token_type} ${action.payload.access_token}`,
      action.payload.expires_in,
    );
    token.setRefresh(action.payload.refresh_token);
  });

// 获取用户信息
const getUser = (state: GlobalState, action: GT.Model.Action<GT.Model.Menu[]>) =>
  produce(state, (draft) => {
    const map = new Map();
    action.payload.forEach((menu) => {
      map.set(menu.id, menu);
    });
    draft.permissions = map;
  });

// 在当前面包屑后增加自定义面包屑
const setBreadcrumb = (state: GlobalState, action: GT.Model.Action<{ zhName: string }[]>) =>
  produce(state, (draft) => {
    draft.breadcrumb = action.payload;
  });

// 初始化接口 获取用户权限、字典
const init = (
  state: GlobalState,
  action: GT.Model.Action<{
    permissions: GT.Model.Menu[];
    dictionary: GT.Model.Dictionary[];
    user: GT.Model.User;
    instance?: any;
  }>,
) =>
  produce(state, (draft) => {
    const map = new Map();
    action.payload.permissions.forEach((menu) => {
      map.set(menu.id, menu);
    });
    const dictionary = new Map();
    action.payload.dictionary.forEach((dic) => {
      const m = new Map();
      dic.list?.forEach((item) => {
        m.set(item.value, item.name);
      });
      dictionary.set(dic.dicCode, m);
    });
    draft.dictionary = dictionary;
    draft.permissions = map;
    draft.user = action.payload.user;
  });
const addSocketHandler = (state: GlobalState, action: GT.Model.Action<GT.Model.SocketHandler>) =>
  produce(state, (draft) => {
    draft.socketHandlers = [...draft.socketHandlers, action.payload];
  });
const removeSocketHandler = (state: GlobalState, action: GT.Model.Action<number>) =>
  produce(state, (draft) => {
    draft.socketHandlers.splice(action.payload, 1);
  });
  const updateTabId = (state: GlobalState, action: GT.Model.Action<string|undefined>) =>
  produce(state, (draft) => {
    draft.tabId = action.payload
  });
  
export const reducer = (state: GlobalState = initialState, action: GT.Model.Action<any>) => {
  switch (action.type) {
    case ActionType.LOGINSUCCESS:
      return loginSuccess(state, action);
    case ActionType.GetUser:
      return getUser(state, action);
    case ActionType.SetBreadcrumb:
      return setBreadcrumb(state, action);
    case ActionType.INIT:
      return init(state, action);
    case ActionType.AddSocketHandler:
      return addSocketHandler(state, action);
    case ActionType.RemoveSockerHandler:
      return removeSocketHandler(state, action);
    case ActionType.UpdateTabId:
      return updateTabId(state,action)
    default:
      return state;
  }
};
