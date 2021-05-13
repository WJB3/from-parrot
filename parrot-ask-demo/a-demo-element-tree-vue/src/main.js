import Vue from 'vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import Vuex from 'vuex'

Vue.use(ElementUI);
Vue.use(Vuex)

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    treeData: [
      {
        title: 'A',
        key: 'A',
        children: [
          {
            title: '0-0-0',
            key: '0-0-0',
            children: [
              { title: '0-0-0-0', key: '0-0-0-0' },
              { title: '0-0-0-1', key: '0-0-0-1' },
              { title: '0-0-0-2', key: '0-0-0-2' },
            ],
          },
          {
            title: '0-0-1',
            key: '0-0-1',
            children: [
              { title: '0-0-1-0', key: '0-0-1-0' },
              { title: '0-0-1-1', key: '0-0-1-1' },
              { title: '0-0-1-2', key: '0-0-1-2' },
            ],
          },
          {
            title: '0-0-2',
            key: '0-0-2',
          },
        ],
      },
      {
        title: 'B',
        key: 'B',
        children: [
          { title: '0-1-0-0', key: '0-1-0-0' },
          { title: '0-1-0-1', key: '0-1-0-1' },
          { title: '0-1-0-2', key: '0-1-0-2' },
        ],
      },
      {
        title: 'C',
        key: 'C',
      },
    ],
    defaultProps: {
      children: 'children',
      label: 'title'
    },
    selectData:[],
    mutexConfig:{
      "A":["B"],
      "B":["A","C"],
      "C":["A","B"]
    },
    initConfig:1,//采用第一种配置方式 
  },
  mutations: {
    setSelectedData(state,payload){
      state.selectData=payload;
    }
  }
})

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
