import request from '@/utils/request'
export function getlist(params) {
  return request({
    url: '',
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
export function materialsList(params) {
  return request({
    url: '/api/Material/materialsList',
    method: 'post',
    data: params
  })
}
export function checkLogin(params) {
  return request({
    url: '/api/Login/checkLogin',
    method: 'post',
    data: params
  })
}
export function initMaterial(params) {
  return request({
    url: '/api/Material/initMaterial',
    method: 'post',
    data: params
  })
}

export function receiveTasks(params) {
  return request({
    url: '/api/Task/receiveTasks',
    method: 'post',
    data: params
  })
}

export function unreceiveGroup(params) {
  return request({
    url: '/api/Task/unreceiveGroup',
    method: 'post',
    data: params
  })
}
export function nextDealTasks(params) {
  return request({
    url: '/api/Task/nextDealTasks',
    method: 'post',
    data: params
  })
}
export function noneedFollow(params) {
  return request({
    url: '/api/Task/noneedFollow',
    method: 'post',
    data: params
  })
}
export function waitDialTasks(params) {
  return request({
    url: '/api/Task/waitDialTasks',
    method: 'post',
    data: params
  })
}
export function nextDealDetail(params) {
  return request({
    url: '/api/Task/nextDealDetail',
    method: 'post',
    data: params
  })
}
export function batchDelNoneed(params) {
  return request({
    url: '/api/Task/batchDelNoneed',
    method: 'post',
    data: params
  })
}
export function returnVisitPlan(params) {
  return request({
    url: '/api/Task/returnVisitPlan',
    method: 'post',
    data: params
  })
}
export function visitPlanDetail(params) {
  return request({
    url: '/api/Task/visitPlanDetail',
    method: 'post',
    data: params
  })
}
export function delVisitPlan(params) {
  return request({
    url: '/api/Task/delVisitPlan',
    method: 'post',
    data: params
  })
}
export function dealVisitPlan(params) {
  return request({
    url: '/api/Task/dealVisitPlan',
    method: 'post',
    data: params
  })
}
export function backMoneyList(params) {
  return request({
    url: '/api/Backmoney/backMoneyList',
    method: 'post',
    data: params
  })
}
export function addBack(params) {
  return request({
    url: '/api/Backmoney/addBack',
    method: 'post',
    data: params
  })
}
export function checkSeller(params) {
  return request({
    url: '/api/Sign/checkSeller',
    method: 'post',
    data: params
  })
}
export function signList(params) {
  return request({
    url: '/api/Sign/signList',
    method: 'post',
    data: params
  })
}
export function addSign(params) {
  return request({
    url: '/api/Sign/addSign',
    method: 'post',
    data: params
  })
}
export function initSign(params) {
  return request({
    url: '/api/Sign/initSign',
    method: 'post',
    data: params
  })
}
export function delSign(params) {
  return request({
    url: '/api/Sign/delSign',
    method: 'post',
    data: params
  })
}
export function editSign(params) {
  return request({
    url: '/api/Sign/editSign',
    method: 'post',
    data: params
  })
}
export function loginOut(params) {
  return request({
    url: '/api/Login/loginOut',
    method: 'post',
    data: params
  })
}
export function dialPhone(params) {
  return request({
    url: '/api/Task/dialPhone',
    method: 'post',
    data: params
  })
}
export function waitDialSub(params) {
  return request({
    url: '/api/Task/waitDialSub',
    method: 'post',
    data: params
  })
}
export function editVisitPlan(params) {
  return request({
    url: '/api/Task/editVisitPlan',
    method: 'post',
    data: params
  })
}
export function customersList(params) {
  return request({
    url: '/api/Customer/customersList',
    method: 'post',
    data: params
  })
}
export function initCustomer(params) {
  return request({
    url: '/api/Customer/initCustomer',
    method: 'post',
    data: params
  })
}
export function delCustomer(params) {
  return request({
    url: '/api/Customer/delCustomer',
    method: 'post',
    data: params
  })
}
export function dealCustomer(params) {
  return request({
    url: '/api/Customer/dealCustomer',
    method: 'post',
    data: params
  })
}
export function statisticsList(params) {
  return request({
    url: '/api/Statistics/statisticsList',
    method: 'post',
    data: params
  })
}
export function myInfo(params) {
  return request({
    url: '/api/My/myInfo',
    method: 'post',
    data: params
  })
}
export function newCustomerList(params) {
  return request({
    url: '/api/Customer/newCustomerList',
    method: 'post',
    data: params
  })
}























// WEBPACK FOOTER //
// ./src/api/index.js