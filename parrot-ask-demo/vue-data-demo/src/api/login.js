import request from '@/utils/request'
export function login(params) {
  return request({
    url: 'api/login/login',
    method: 'post',
    data: params
  })
}


// WEBPACK FOOTER //
// ./src/api/login.js