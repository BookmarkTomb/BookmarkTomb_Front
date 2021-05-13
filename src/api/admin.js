import request from '@/lib/instance/request'

export function getAllUsers() {
  return request({
    url: '/api/admin/users',
    method: 'get',
  })
}

export function addUser(data) {
  return request({
    url: '/api/admin/user',
    method: 'post',
    data
  })
}

export function logoffUser(userId) {
  return request({
    url: '/api/admin/user/'+userId,
    method: 'delete',
  })
}

export function restoreUser(userId) {
  return request({
    url: '/api/admin/user/restore/'+userId,
    method: 'put',
  })
}

export function setUserPassw(data) {
  return request({
    url: '/api/admin/user/password',
    method: 'put',
    data
  })
}

export function getOnline() {
  return request({
    url: 'api/admin/online',
    method: 'get'
  })
}

export function offlineAllUsers() {
  return request({
    url: '/api/admin/offline/all',
    method: 'delete'
  })
}

export function offlineUser(id) {
  return request({
    url: '/api/admin/offline/user/'+id,
    method: 'delete'
  })
}

export function offlineToken(token) {
  return request({
    url: '/api/admin/offline/token/'+token,
    method: 'delete'
  })
}

export function setUserInfo(data) {
  return request({
    url: '/api/admin/user',
    method: 'put',
    data
  })
}

export function getSystemInfo() {
  return request({
    url: '/api/admin/system',
    method: 'get'
  })
}

export function shutdownSystem() {
  return request({
    url: '/api/admin/shutdown',
    method: 'post'
  })
}

export function getDatabaseConf() {
  return request({
    url: '/api/admin/system/db',
    method: 'get'
  })
}

export function updDatabaseConf(data) {
  return request({
    url: '/api/admin/system/db',
    method: 'put',
    data
  })
}

export function getEmailConf() {
  return request({
    url: '/api/admin/system/email',
    method: 'get'
  })
}

export function updEmailConf(data) {
  return request({
    url: '/api/admin/system/email',
    method: 'put',
    data
  })
}

export function disableEmailConf() {
  return request({
    url: '/api/admin/system/email',
    method: 'delete',
  })
}

export function getPortConf() {
  return request({
    url: '/api/admin/system/port',
    method: 'get'
  })
}

export function updPortConf(port) {
  return request({
    url: '/api/admin/system/port/'+port,
    method: 'put',
  })
}

export function getRegisterConf() {
  return request({
    url: '/api/admin/system/register',
    method: 'get'
  })
}

export function enableRegisterConf() {
  return request({
    url: '/api/admin/system/register',
    method: 'put'
  })
}

export function disableRegisterConf() {
  return request({
    url: '/api/admin/system/register',
    method: 'delete'
  })
}