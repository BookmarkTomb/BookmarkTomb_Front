import request from '@/lib/instance/request'

export function initSystem(data) {
    return request({
        url: '/api/public/init',
        method: 'post',
        data
    })
}

export function createAdmin(data) {
    return request({
        url: '/api/public/admin',
        method: 'post',
        data
    })
}

export function getVersion() {
    return request({
        url: '/api/public/system',
        method: 'get',
    })
}

