import request from '@/lib/instance/request'

export function getCollections() {
  return request({
    url: '/api/collection/owner',
    method: 'get'
  })
}

export function deleteCollection(collectionId) {
  return request({
    url: '/api/collection/'+collectionId,
    method: 'delete',
  })
}

export function updateCollectionInfo(data) {
  return request({
    url: '/api/collection',
    method: 'put',
    data
  })
}export function getDeletedCollections() {
  return request({
    url: '/api/collection/deleted',
    method: 'get',
  })
}

export function restoreCollection(collectionId) {
  return request({
    url: '/api/collection/restore/'+collectionId,
    method: 'put'
  })

}

export function insertCollection(data) {
  return request({
    url: '/api/collection',
    method: 'post',
    data
  })
}

export function getCollectionByParent(parentId) {
  return request({
    url: '/api/collection/parent/'+ parentId,
    method: 'get',
  })
}