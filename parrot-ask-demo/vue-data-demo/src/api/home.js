import request from '@/utils/request'
export function petList(params) {
  return request({
    url: '/api/Pet/petList',
    method: 'get',
    params
  })
}
export function create(params) {
  return request({
    url: 'index/index/create',
    method: 'post',
    data: params
  })
}
export function appoint(params) {
  return request({
    url: '/api/Pet/appoint',
    method: 'post',
    data: params
  })
}
export function addOrder(params) {
  return request({
    url: '/api/Pet/addOrder',
    method: 'post',
    data: params
  })
}
export function Adoption(params) {
  return request({
    url: '/api/Pet/Adoption',
    method: 'get',
    params
  })
}
export function pets(params) {
  return request({
    url: '/api/Pet/pets',
    method: 'get',
    params
  })
}
export function appointList(params) {
  return request({
    url: '/api/Pet/appointList',
    method: 'get',
    params
  })
}
export function saleList(params) {
  return request({
    url: '/api/Pet/saleList',
    method: 'get',
    params
  })
}
export function onSaleList(params) {
  return request({
    url: '/api/Pet/onSaleList',
    method: 'get',
    params
  })
}
export function orderInfo(params) {
  return request({
    url: '/api/Pet/orderInfo',
    method: 'get',
    params
  })
}
export function pay(params) {
  return request({
    url: '/api/Pet/pay',
    method: 'post',
    data: params
  })
}
export function fileUpload(params) {
  return request({
    url: 'api/upload/fileUpload',
    method: 'post',
    data: params
  })
}
export function confirm(params) {
  return request({
    url: '/api/Pet/confirm',
    method: 'post',
    data: params
  })
}
export function appeal(params) {
  return request({
    url: '/api/Pet/appeal',
    method: 'post',
    data: params
  })
}
export function cancelOrder(params) {
  return request({
    url: '/api/Pet/cancelOrder',
    method: 'post',
    data: params
  })
}
export function recommendInfo(params) {
  return request({
    url: 'api/login/recommendInfo',
    method: 'post',
    data: params
  })
}
export function sendSms(params) {
  return request({
    url: 'api/login/sendSms',
    method: 'post',
    data: params
  })
}
export function registerCommit(params) {
  return request({
    url: 'api/login/registerCommit',
    method: 'post',
    data: params
  })
}
export function forgetPassword(params) {
  return request({
    url: 'api/login/forgetPassword',
    method: 'post',
    data: params
  })
}
export function sendSms1(params) {
  return request({
    url: 'api/user/sendSms',
    method: 'post',
    data: params
  })
}
export function resetPassword(params) {
  return request({
    url: 'api/user/resetPassword',
    method: 'post',
    data: params
  })
}
export function resetPayPassword(params) {
  return request({
    url: 'api/user/resetPayPassword',
    method: 'post',
    data: params
  })
}
export function gathering(params) {
  return request({
    url: 'api/user/gathering',
    method: 'post',
    data: params
  })
}
export function gatheringCommit(params) {
  return request({
    url: 'api/user/gatheringCommit',
    method: 'post',
    data: params
  })
}
export function remittanceCommit(params) {
  return request({
    url: 'api/remittance/remittanceCommit',
    method: 'post',
    data: params
  })
}
export function userInfoCommit(params) {
  return request({
    url: 'api/user/userInfoCommit',
    method: 'post',
    data: params
  })
}
export function loginOut(params) {
  return request({
    url: '/api/login/loginOut',
    method: 'post',
    data: params
  })
}
export function account(params) {
  return request({
    url: 'api/account/account',
    method: 'post',
    data: params
  })
}
export function userInfo(params) {
  return request({
    url: 'api/user/userInfo',
    method: 'post',
    data: params
  })
}
export function gatheringList(params) {
  return request({
    url: 'api/remittance/gatheringList',
    method: 'post',
    data: params
  })
}
export function configRemittanceList(params) {
  return request({
    url: 'api/remittance/configRemittanceList',
    method: 'post',
    data: params
  })
}
export function petBill(params) {
  return request({
    url: 'api/user/petBill',
    method: 'post',
    data: params
  })
}
export function userAccount(params) {
  return request({
    url: 'api/user/userAccount',
    method: 'post',
    data: params
  })
}
export function configTransferList(params) {
  return request({
    url: 'api/transfer/configTransferList',
    method: 'post',
    data: params
  })
}
export function transferCommit(params) {
  return request({
    url: 'api/transfer/transferCommit',
    method: 'post',
    data: params
  })
}
export function totalInfo(params) {
  return request({
    url: 'api/user/totalInfo',
    method: 'post',
    data: params
  })
}
export function teaminfo(params) {
  return request({
    url: 'api/user/teaminfo',
    method: 'post',
    data: params
  })
}
export function userSend(params) {
  return request({
    url: 'api/mail/userSend',
    method: 'post',
    data: params
  })
}
export function sendMail(params) {
  return request({
    url: 'api/mail/sendMail',
    method: 'post',
    data: params
  })
}
export function userReceive(params) {
  return request({
    url: 'api/mail/userReceive',
    method: 'post',
    data: params
  })
}
export function noticeList(params) {
  return request({
    url: 'api/mail/noticeList',
    method: 'post',
    data: params
  })
}
export function bannerList(params) {
  return request({
    url: 'api/index/bannerList',
    method: 'post',
    data: params
  })
}
// 累计收益
export function inBillList(params) {
  return request({
    url: 'api/user/inBillList',
    method: 'post',
    data: params
  })
}
// 动态收益
export function dynamicList(params) {
  return request({
    url: 'api/user/incomeList',
    method: 'get',
    params: params
  })
}
export function feed(params) {
  return request({
    url: 'api/Pet/feed',
    method: 'post',
    data: params
  })
}
export function checkPayPassword(params) {
  return request({
    url: 'api/user/checkPayPassword',
    method: 'post',
    data: params
  })
}
// export function sendMail(params) {
//   return request({
//     url: 'api/mail/sendMail',
//     method: 'post',
//     data: params
//   })
// }
export function inRecord(page, pagesize) {
  return request({
    url: 'api/bill/inBillList',
    method: 'get',
    params: {
      page,
      pagesize
    }
  })
}
// 支出收益
export function outRecord(page, pagesize) {
  return request({
    url: 'api/bill/outBillList',
    method: 'get',
    params: {
      page,
      pagesize
    }
  })
}

// 签到

export function signConfirm() {
  return request({
    url: 'api/user/signInTime',
    method: 'post',
  })
}
export function signCurDay() {
  return request({
    url: "api/user/signInInfo",
    method: "get"
  })
}



// WEBPACK FOOTER //
// ./src/api/home.js