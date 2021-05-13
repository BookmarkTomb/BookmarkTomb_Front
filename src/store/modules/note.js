import { getNoteByOwner, addNote, deleteNoteById, getDeletedNotes, restoreNote, getNoteOfBookmark, updateNoteInfo } from "@/api/note"

const state = {
  noteInfo: [],
  deletedNoteInfo: [],
  noteOfBookmark: []
}

const mutations = {
  SET_NOTE_INFO: (state, noteInfo) => {
    state.noteInfo = noteInfo
  },

  SET_DELETED_NOTE_INFO: (state, deletedNoteInfo) => {
    state.deletedNoteInfo = deletedNoteInfo
  },

  SET_NOTE_OF_BOOKMARK: (state, noteOfBookmark) => {
    state.noteOfBookmark = noteOfBookmark
  },

  DELETE_NOTE: (state, index) => {
    state.noteInfo.splice(index, 1)
  },

  RESTORE_NOTE: (state, index) => {
    state.deletedNoteInfo.splice(index, 1)
  },

  UPDATE_NOTE: (state, newInfo) => {
    state.noteInfo.splice(newInfo.index,1,newInfo.data)
  }
}

const actions = {
  getNoteOwner ({ commit }) {
    return new Promise ((resolve, reject) => {
      getNoteByOwner().then(resp => {
        const { data } = resp
        commit('SET_NOTE_INFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  addNote(undefine, newNoteInfo) {
    return new Promise ((resolve, reject) => {
      addNote(newNoteInfo).then(resp => {
        const { data } = resp
        // commit('ADD_NOTE', resp)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  deleteNote ({ commit }, noteParam) {
    return new Promise ((resolve, reject) => {
      deleteNoteById(noteParam.delArr).then(resp => {
        const { data } = resp
        commit('DELETE_NOTE', noteParam.index)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  deleteNoteOfBookmark (undefine, delNoteArr) {
    return new Promise ((resolve, reject) => {
      deleteNoteById(delNoteArr).then(resp => {
        const { data } = resp
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getDeletedNotes({ commit }) {
    return new Promise ((resolve, reject) => {
      getDeletedNotes().then(resp => {
        const { data } = resp
        commit('SET_DELETED_NOTE_INFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  restoreNote({ commit }, restorNoteParam){
    return new Promise((resolve,reject) => {
      restoreNote(restorNoteParam.restoreNoteArr).then(resp => {
        commit('RESTORE_NOTE',restorNoteParam.index)
        const { data } = resp
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getNoteOfBookmark ({ commit }, bookmarkId) {
    return new Promise ((resolve, reject) => {
      getNoteOfBookmark(bookmarkId).then(resp => {
        const { data } = resp
        commit('SET_NOTE_OF_BOOKMARK', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateNoteInfo({ commit }, updatedNote) {
    return new Promise((resolve, reject) => {
      updateNoteInfo(updatedNote).then(resp => {
        const { data } = resp
        let noteInfo = {
          data: data,
          index: updatedNote.index
        }
        commit('UPDATE_NOTE', noteInfo)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespace: true,
  state,
  mutations,
  actions
}