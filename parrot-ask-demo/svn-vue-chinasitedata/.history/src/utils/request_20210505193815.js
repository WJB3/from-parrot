import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  //baseURL: process.env.VUE_APP_BASE_API,      // url = base url + request url   // baseURL: 'http://120.53.244.200:5656/api/',
  baseURL: 'http://120.53.244.200:5656/',  
  // withCredentials: true, // send cookies when cross-domain requests  （跨域请求时发送cookies）
  timeout: 5000 
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    
    console.log(error) 
    return Promise.reject(error)  //抛出异常信息
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    console.log('res',res)

    // if the custom code is not 2000, it is judged as an error.    原始代码是2000状态码
    if (res.code !== 200 || res.code!==0) { 
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
