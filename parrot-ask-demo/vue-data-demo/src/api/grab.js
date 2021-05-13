import request from '@/utils/request'

export function grabList() {
    return request({
        url: 'api/pet/grabSinglePoolList',
        method: "get"
    })
}

// 预约
export function grabOrderSubmit(type) {
    return request({
        url: 'api/pet/appointRob',
        method: "post",
        data: {
            type
        }
    })
}

// 抢购
export function grabSubmit(type) {
    return request({
        url: 'api/pet/addRobOrder',
        method: "post",
        data: {
            type
        }
    })
}



// WEBPACK FOOTER //
// ./src/api/grab.js