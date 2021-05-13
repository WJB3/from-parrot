import axios from 'axios'
import {
    Toast
} from 'vant';
import router from '@/router/index'
// create an axios instance
var url = ""
if (process.env.NODE_ENV === "development") {
    url = '/api'
} else {
    url = '/public/index.php'
}
const service = axios.create({
    baseURL: url, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})
service.interceptors.request.use(
    config => {
        config.headers['token'] = localStorage.getItem('usertoken') || '';
        return config
    },
    error => {
        return Promise.reject(error)
    }
)


//zzw

// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.errcode != 0) {
            //抢购限制
            if (response.config.url.indexOf('api/Pet/addOrder') > 0) {
                Toast({
                    message: res.msg || '错误',
                })
                if (res.errcode == 4001) {
                    //登录失效
                    localStorage.removeItem('usertoken');
                    router.push({
                        path: '/login'
                    })
                }
                return res
            } else {
                Toast({
                    message: res.msg || '错误',
                })
                if (res.errcode == 4001) {
                    //登录失效
                    localStorage.removeItem('usertoken');
                    router.push({
                        path: '/login'
                    })
                } else if (res.errcode == 1000) {
                    //未激活
                    router.push({
                        path: '/active',
                    })
                }
                return Promise.reject(res.msg || 'error')
            }
        } else {
            if (response.config.url.indexOf('api/Pet/addOrder') > 0) {
                return res;
            } else {
                return res.res;
            }
        }
    },
    error => {
        Notify({
            message: error.msg || '错误',
            duration: 3 * 1000,
        });
        return Promise.reject(error)
    }
)


//wyy
// service.interceptors.response.use(
//     response => {
//         const res = response.data
//         //抢购返回状态
//         if (response.config.url == '/public/index.php/api/Pet/addOrder') {
//             ///public/index.php
//             return res;
//         }
//         if (response.config.url == '/public/index.php/api/pet/addRobOrder') {
//             return res;
//             // return Promise.reject();
//         }
//         if (res.errcode === 0) {
//             if (res.msg !== '请求成功~' && res.msg !== '请求成功' && res.msg !== '' && res.msg !== 'success') {
//                 Toast({
//                     message: res.msg,
//                     duration: 1000
//                 });
//             }
//             return res.res
//         } else if (res.errcode == 4001) {
//             localStorage.removeItem('usertoken');
//             Router.push({
//                 path: '/login'
//             })
//         } else {
//             Toast({
//                 message: res.msg,
//                 duration: 1000
//             });
//             return Promise.reject()
//         }
//     },
//     error => {
//         return Promise.reject(error)
//     }
// )

export default service



// WEBPACK FOOTER //
// ./src/utils/request.js