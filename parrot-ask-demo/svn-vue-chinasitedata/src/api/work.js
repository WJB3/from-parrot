import request from '@/utils/request'

export default{
    getDetail(id) {
        return request({
            url: `/api/PretreatmentOrder/PretreatmentOrder_List/?worksheetcode=${id}`,
            method: 'post'
        })
    },
    getList(params) {
        return request({
            url: `/api/WorkSheet/WorkSheet_PageList`,
            method: 'post',
            data: params
        })
    }
    
}