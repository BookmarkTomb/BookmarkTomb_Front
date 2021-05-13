import request from '@/lib/instance/request'

export function getNoteByOwner() {
  return request({
    url: '/api/note/owner',
    method: 'get',
  })
}

export function addNote(data) {
  return request({
    url: '/api/note',
    method: 'post', 
    data
  })
}

export function deleteNoteById(data) {
  return request({
    url: '/api/note',
    method: 'delete',
    data
  })
}

export function getDeletedNotes() {
  return request({
    url: '/api/note/deleted',
    method: 'get',
  })
}

export function restoreNote(data) {
  return request({
    url: '/api/note/restore',
    method: 'put',
    data
  })
}

export function getNoteOfBookmark(bookmarkId) {
  return request({
    url: '/api/note/bookmark/'+bookmarkId,
    method: 'get',
  })
}

export function updateNoteInfo(data) {
  return request({
    url: '/api/note',
    method: 'put',
    data
  })
}