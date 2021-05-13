import request from '@/utils/request'


//用户登录接口    // url: '/vue-element-admin/user/login',
export function login(data) {
  const url="/api/Account/LogIn?"
  return request({
    url: url,
    method: 'post',
    data  
  })
}
//获取用户信息接口     这些是模拟数据不用
// export function getInfo(token) {
//   return request({
//     url: '/vue-element-admin/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
//用户登出   这些是模拟数据不用
// export function logout() {
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
// }
