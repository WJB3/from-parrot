import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './vuex/store'
// import weig from './graph/weig'
import App from './components/App.vue' 

require('./static/initial.styl')
// require('bootstrap-webpack')
// require('./static/no-gutter.css')

Vue.use(VueRouter)
// Vue.use(require('vue-resource'))
import F from './components/content/overview/Overview.vue';
import A from './components/content/realtime/Realtime.vue';
import C from './components/content/statistic/Statistic.vue';
import D from './components/content/leaflet/Leaflet.vue';

// var vm = new Vue({
//     store, //inject store to all components
//     el: 'body',
//     components: {
//         App
//     },
//     mounted: function() {
//         // d3.select('#loader').remove()
//         // d3.select('body').style('background-color', '')
//     }
//
// })  
const routes = [
    { path: '/', component: F }, 
    { path: '/overview', component: F }, 
    { path: '/realtime', component: A }, 
    { path: '/statistic', component: C }, 
    { path: '/leaflet', component: D }, 

]

const router = new VueRouter({
    routes
    //启用如下选项，浏览器访问路由路径404,需要nginx设置try file解决
    // history: true,
    // saveScrollPosition: true
})

// configRouter(router)

// const App = Vue.extend(require('./components/App.vue'))

 new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#root') 

 