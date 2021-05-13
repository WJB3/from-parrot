import request from '@/utils/request'
/**
 * 预处理工单
 * 
 * 
 */

//预处理工单
export function workOrderData(params) {
  return request({
    url: '/WorkSheet/WorkSheet_PageList',
    method: 'post',
    params
  })
}