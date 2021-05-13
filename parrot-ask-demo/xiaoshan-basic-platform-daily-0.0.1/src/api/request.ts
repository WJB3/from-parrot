import axios from 'axios';
import { token } from '../utils';
import { message, Modal } from 'antd';
import qs from 'qs';
import api from './index';

function onError(msg: string) {
  const msgMap: Record<string, string> = {
    'Network Error': '网络异常，请检查网络设置',
  };
  message.error(msgMap[msg] || msg);
}
let visible = false;
export function onRelogin(message?: string) {
  if (visible) return;
  visible = true;
  Modal.error({
    title: '提示',
    content: message || '会话失效，请重新登录',
    onOk() {
      token.remove();
      window.location.reload();
    },
    onCancel() {
      visible = false;
    },
  });
}
const baseURL = (window as any).BaseApp.baseURL || 'https://test.xszx.china95059.com.cn';
const instance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});
export function refreshToken() {
  return api.base
    .login(
      {
        grant_type: 'refresh_token',
        refresh_token: token.getRefresh(),
      },
      {
        // auth: {
        //     username: 'web',
        //     password: 'pin',
        // },
        params: {},
        headers: {
          Authorization: 'Basic Zm91bmRhdGlvbjpwaW4=',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    .then((ret) => {
      token.set(`${ret.token_type} ${ret.access_token}`);
      token.setRefresh(ret.refresh_token);
      return ret;
    });
}

const on401 = (error: any) => {
  const { config, data } = error.response;
  if (data.message.includes("Invalid token does not contain resource id")) {
    onRelogin("权限已变更");
    return Promise.reject(error);
  }
  switch (data.message) {
    case '用户已禁用':
    case '密码已经重置':
    case '角色已经重置':
      onRelogin(error.response.data.message);
      return Promise.reject(error);
    default:
      if ((config.data && config.data.indexOf('refresh_token') === -1) || !config.data) {
        return refreshToken().then((ret) => {
          token.set(`${ret.token_type} ${ret.access_token}`);
          token.setRefresh(ret.refresh_token);
          config.headers.Authorization = token.get();
          return instance(config);
        });
      } else {
        onRelogin();
        return Promise.reject(error);
      }
  }
};
instance.interceptors.request.use(
  (config) => {
    const hash = window.location.hash.substr(2);

    if (config.url === '/sso/oauth/token') {
      config.headers['Authorization'] = 'Basic Zm91bmRhdGlvbjpwaW4=';
    } else {
      config.headers.Authorization = token.get();
    }
    if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      if (config.data && config.data.toString() !== '[object FormData]') {
        config.data = qs.stringify(config.data);
      }
    }
    // app应用内调用接口增加参数 appid,pageId,tabId
    if (/^app/.test(hash) && config.url !== '/sso/oauth/token') {
      const [path, query] = hash.split('?');
      const [pre, id, pageId] = path.split('/');
      const params = qs.parse(query);
      id && (config.headers['X-Permission'] = [id].join(','));
      id && Number(pageId) && (config.headers['X-Permission'] = [id, pageId, params.tab].join(','));
    }
    if (config.responseType === 'blob') {
      config.headers = {};
    }
    return config;
  },
  (err) => Promise.reject(err),
);

instance.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data);
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return on401(error);
          // onRelogin(error.response.data.message);
          break;
        default:
          onError(error.response.data.message);
          break;
      }
    } else {
      onError(error.message);
    }
    return Promise.reject(error);
  },
);
const iotInstance = axios.create({
  baseURL: 'http://172.16.90.36:8011',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});
iotInstance.interceptors.request.use(
  (config) => {
    const hash = window.location.hash.substr(2);

    if (config.url === '/sso/oauth/token') {
      config.headers['Authorization'] = 'Basic Zm91bmRhdGlvbjpwaW4=';
    } else {
      config.headers.Authorization = token.get();
    }
    if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      if (config.data && config.data.toString() !== '[object FormData]') {
        config.data = qs.stringify(config.data);
      }
    }
    // app应用内调用接口增加参数 appid,pageId,tabId
    if (/^app/.test(hash) && config.url !== '/sso/oauth/token') {
      const [path, query] = hash.split('?');
      const [pre, id, pageId] = path.split('/');
      const params = qs.parse(query);
      id && (config.headers['X-Permission'] = [id].join(','));
      id && Number(pageId) && (config.headers['X-Permission'] = [id, pageId, params.tab].join(','));
    }
    if (config.responseType === 'blob') {
      config.headers = {};
    }
    return config;
  },
  (err) => Promise.reject(err),
);
iotInstance.interceptors.response.use(
  (response) => {
    if (response.data.code === 0) {
      return Promise.resolve(response.data.data);
    } else {
      onError(response.data.msg);
      return Promise.reject(response.data.data);
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return on401(error);
          // onRelogin(error.response.data.message);
          break;
        default:
          onError(error.response.data.message);
          break;
      }
    } else {
      onError(error.message);
    }
    return Promise.reject(error);
  },
);
export { iotInstance };
export default instance;
