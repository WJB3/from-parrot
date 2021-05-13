import request from '@/utils/request'

/**
 * 基础建模数据接口
 */
// 基础建模---人员基本
export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}
