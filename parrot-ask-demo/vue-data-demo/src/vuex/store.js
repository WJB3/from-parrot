import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
     data:{
        market_value:'',
        all_profit:'',
        t_profit:"",
        profit:'',
        current_price:''
     }
}

const mutations = {
    change(state, data) {
    localStorage.setItem("data", JSON.stringify(data));  //添加到localStorage
    state.data=data;
  },
}

const actions = {
  addGoods({
    commit
  }, data) {
    commit('add', data)
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions

});



// WEBPACK FOOTER //
// ./src/vuex/store.js