import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';

import { GlobalProvider, initialState, reducer } from './store';
moment.locale('zh-cn');

ReactDOM.render(
  <GlobalProvider initialState={initialState} reducer={reducer}>
    <ConfigProvider
      locale={zhCN}
      componentSize='middle'
      input={{ autoComplete: 'off' }}
      getPopupContainer={() => document.querySelector('.app_container') || document.body}>
      <App />
    </ConfigProvider>
  </GlobalProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
