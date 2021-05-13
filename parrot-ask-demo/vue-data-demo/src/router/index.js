import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/Main'
import home from '@/pages/home/home'
import Login from '@/pages/login/index.vue';

Vue.use(Router)
const router = new Router({
    linkActiveClass: 'cur',
    routes: [{
        path: '/login',
        name: 'login',
        component: () => import('@/pages/login/index.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/login/register.vue'),
    },
    {
        path: '/reg',
        name: 'reg',
        component: () => import('@/pages/login/setting.vue'),
    },
    {
        path: '/',
        //name: 'Main',
        redirect: '/home',
        component: Main,
        children: [
            {
                path: '',
                redirect: '/login',
                name: 'Main',
                component: home,
                meta: {
                    auth: true
                }
            },
            {
                path: '/home',
                name: 'home',
                component: home,
                meta: {
                    auth: true
                }
            },
            {
                path: '/situation',
                name: 'situation',
                component: () => import('@/pages/conditon.vue'),
                meta: {
                    auth: true
                }
            },
            {
                path: '/serveCenter',
                name: 'serveCenter',
                component: () => import('@/pages/serve/serveCenter.vue'),
                meta: {
                    auth: true
                }
            },
            {
                path: '/my',
                name: 'my',
                component: () => import('@/pages/my/index.vue'),
            }
        ]
    },
    {
        path: '/exchange',
        name: 'exchange',
        component: () => import('@/pages/exchange/index.vue'),
    },
    {
        path: '/exchangeRecord',
        name: 'exchangeRecord',
        component: () => import('@/pages/exchange/exchangeRecord.vue'),
    },
    {
        path: '/infoReal',
        name: 'infoReal',
        component: () => import('@/pages/my/infoReal.vue'),
    },
    {
        path: '/feed',
        name: 'feed',
        component: () => import('@/pages/feed/index.vue'),
    },
    {
        path: '/profit',
        name: 'profit',
        component: () => import('@/pages/feed/profit.vue'),
    },
    {
        path: '/dynamic',
        name: 'dynamic',
        component: () => import('@/pages/feed/dynamic.vue'),
    },
    {
        path: '/feed-charge',
        name: 'feed-charge',
        component: () => import('@/pages/feed/charge.vue'),
    },
    {
        path: '/feed-output',
        name: 'feed-output',
        component: () => import('@/pages/feed/output.vue'),
    },
    {
        path: '/adopt-record',
        name: 'adopt-record',
        component: () => import('@/pages/adopt/index.vue'),
    },
    {
        path: '/adopt-detail/:id',
        name: 'adopt-detail',
        component: () => import('@/pages/adopt/detail.vue'),
    },
    {
        path: '/tranform-record',
        name: 'tranform-record',
        component: () => import('@/pages/adopt/tranform.vue'),
    },
    {
        path: '/appointment-record',
        name: 'appointment-record',
        component: () => import('@/pages/adopt/appointment.vue'),
    },
    {
        path: '/popularize',
        name: 'popularize',
        component: () => import('@/pages/popularize/index.vue'),
    },
    {
        path: '/safe',
        name: 'safe',
        component: () => import('@/pages/safe/index.vue'),
    },
    {
        path: '/lower',
        name: 'lower',
        component: () => import('@/pages/safe/lower.vue'),
    },
    {
        path: '/high',
        name: 'high',
        component: () => import('@/pages/safe/high.vue'),
    },
    {
        path: '/confirm',
        name: 'confirm',
        component: () => import('@/pages/safe/confirm.vue'),
    },
    {
        path: '/setting',
        name: 'setting',
        component: () => import('@/pages/my/setting.vue'),
    },
    {
        path: '/info',
        name: 'info',
        component: () => import('@/pages/my/info.vue'),
    },
    {
        path: '/article',
        name: 'article',
        component: () => import('@/pages/article/index.vue'),
    },
    {
        path: '/email',
        name: 'email',
        component: () => import('@/pages/article/email.vue'),
    },
    {
        path: '/email-detail',
        name: 'email-detail',
        component: () => import('@/pages/article/email-detail.vue'),
    },
    {
        path: '/sending',
        name: 'sending',
        component: () => import('@/pages/article/sending.vue'),
    },
    {
        path: '/article-detail/:id',
        name: 'article-detail',
        component: () => import('@/pages/article/detail.vue'),
    },
    {
        path: '/receipt-manage',
        name: 'receipt-manage',
        component: () => import('@/pages/receipt-manage/index.vue'),
    },
    {
        path: '/receipt-add',
        name: 'receipt-add',
        component: () => import('@/pages/receipt-manage/add.vue'),
    },
    {
        path: '/team',
        name: 'team',
        component: () => import('@/pages/team/index.vue'),
    },
    {
        path: '/teamDetail',
        name: 'teamDetail',
        component: () => import('@/pages/team/detail.vue'),
    },
    {
        path: '/order',
        name: 'order',
        component: () => import('@/pages/order-manage/index.vue'),
    },
    {
        path: '/order-add',
        name: 'order-add',
        component: () => import('@/pages/order-manage/add.vue'),
    },
    {
        path: '/order-detail/:id',
        name: 'order-detail',
        component: () => import('@/pages/order-manage/detail.vue'),
    },
    {
        path: '/back-fund',
        name: 'back-fund',
        component: () => import('@/pages/back-fund/index.vue'),
    },
    {
        path: '/add-fund',
        name: 'add-fund',
        component: () => import('@/pages/back-fund/add.vue'),
    },
    {
        path: '/client',
        name: 'client',
        component: () => import('@/pages/client/index.vue'),
    },
    {
        path: '/client-add',
        name: 'client-add',
        component: () => import('@/pages/client/add.vue'),
    },
    {
        path: '/client-detail/:id',
        name: 'client-detail',
        component: () => import('@/pages/client/detail.vue'),
    },
    {
        path: '/unhandle',
        name: 'unhandle',
        component: () => import('@/pages/handle/index.vue'),
    },
    {
        path: '/unproess',
        name: 'unproess',
        component: () => import('@/pages/handle/unproess.vue'),
    },
    {
        path: '/handle-detail',
        name: 'handle-detail',
        component: () => import('@/pages/handle/detail.vue'),
    },
    {
        path: '/mission',
        name: 'mission',
        component: () => import('@/pages/mission/index.vue'),
    },
    {
        path: '/know',
        name: 'know',
        component: () => import('@/pages/know/know.vue'),
    },
    {
        path: '/product',
        name: 'product',
        component: () => import('@/pages/know/product.vue'),
    },
    {
        path: '/knowDetail',
        name: 'knowDetail',
        component: () => import('@/pages/know/detail.vue'),
    },
    {
        path: '/review',
        name: 'review',
        component: () => import('@/pages/review/index.vue'),
    },
    {
        path: '/reviewdetail/:id',
        name: 'reviewdetail',
        component: () => import('@/pages/review/detail.vue'),
    },
    {
        path: '/reviewedit',
        name: 'reviewedit',
        component: () => import('@/pages/review/edit.vue'),
    },
    {
        path: '/statistics',
        name: 'statistics',
        component: () => import('@/pages/statistics/index.vue'),
    },
    {
        path: '/billMange',
        name: 'billMange',
        component: () => import('@/pages/billMange/index.vue'),
    }
    ]
})

const whiteList = ['/register', '/reg']

router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        if (localStorage.getItem('usertoken')) {
            next('/home');
        } else {
            next();
        }
    } else {
        if (whiteList.indexOf(to.path) < 0 && !localStorage.getItem('usertoken')) {
            next('/login');
        } else {
            next();
        }
    }
})
router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
})
export default router;



// WEBPACK FOOTER //
// ./src/router/index.js