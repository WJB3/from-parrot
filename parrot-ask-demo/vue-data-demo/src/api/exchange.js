import request from '@/utils/request'
export function getList(){
    return request({
        url:'api/convert/convertList',
        method:"get"
    })
}
// 兑换
export function convert(pet_id) {
    return request({
      url: 'api/convert/convert',
      method: 'post',
      data:{pet_id}
    })
  }
// 兑换记录
export function convertRecord(params) {
    return request({
      url: 'api/convert/convertRecord',
      method: 'get'
    })
  }


// WEBPACK FOOTER //
// ./src/api/exchange.js