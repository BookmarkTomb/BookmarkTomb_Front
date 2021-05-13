import request from '@/lib/instance/request'

export function getFavor(data) {
  return request({
    url: '/api/bookmark/favor',
    method: 'get',
    params: data
  })
}

export function getOwner(data) {
  return request({
    url: '/api/bookmark/owner',
    method: 'get',
    params: data
  })
}

export function deleteBookmarkById(data) {
  return request({
    url: '/api/bookmark',
    method: 'delete',
    data
  })
}

export function addBookmark(data) {
  return request({
    url: '/api/bookmark',
    method: 'post',
    data
  })
}

export function getDeletedBookmarks() {
  return request({
    url: '/api/bookmark/deleted',
    method: 'get',
  })
}

export function restoreBookmark(data) {
  return request({
    url: '/api/bookmark/restore',
    method: 'put',
    data
  })
}

export function bookmarkTop(data) {
  return request({
    url: '/api/bookmark/top',
    method: 'put',
    data
  })
}

export function bookmarkTopCancel(data) {
  return request({
    url: '/api/bookmark/top/cancel',
    method: 'delete',
    data
  })
}

export function updateBookmarkInfo(data) {
  return request({
    url: '/api/bookmark',
    method: 'put',
    data
  })
}

export function getBoomark(data) {
  return request({
    url: '/api/bookmark/collection/' + data.collectionId,
    method: 'get',
    params: data.sortAndOrder
  })
}

export function updateParentCollection(data) {
  return request({
    url: '/api/bookmark/parent',
    method: 'put',
    data
  })
}