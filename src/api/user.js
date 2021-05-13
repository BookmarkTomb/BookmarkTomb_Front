import request from '@/lib/instance/request'

export function getCodeImg() {
  return request({
    url: '/api/code/img',
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: '/api/user',
    method: 'get'
  })
}

export function login(data) {
  return request({
    url: 'api/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: "/api/user/logout",
    method: 'delete'
  })
}

export function logoff() {
  return request({
    url: "/api/user",
    method: 'delete'
  })
}

export function register(data) {
  return request({
    url: '/api/user',
    method: 'post',
    data
  })
}

export function setUserComInfo(data) {
  return request({
    url: '/api/user',
    method: 'put',
    data
  })
}

export function resetUserPwd(data) {
  return request({
    url: '/api/user/pwd',
    method: 'put',
    data
  })
}

export function getEmailVerifyCode(email) {
  return request({
    url: '/api/code/email/'+email,
    method: 'get',
  })
}

export function resetUserEmail(data) {
  return request({
    url: '/api/user/email',
    method: 'put',
    data
  })
}

export function setUserAvatar(data) {
  return request({
    url: '/api/user/avatar',
    method: 'put',
    headers: { "Content-Type": 'multipart/form-data' },
    data
  })
}

export function getUserAvatar() {
  return request({
    url: '/api/user/avatar',
    method: 'get',
  })
}

export function forgetPasswd(data) {
  return request({
    url: '/api/user/forget/password',
    method: 'put',
    data
  })
}
