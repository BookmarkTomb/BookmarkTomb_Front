import {
    getFavor,
    deleteBookmarkById,
    addBookmark,
    getDeletedBookmarks,
    restoreBookmark,
    bookmarkTop,
    bookmarkTopCancel,
    updateBookmarkInfo,
    getBoomark,
    updateParentCollection
} from '@/api/bookmark'

const state = {
    favor: [],
    showChose: false,
    selectedBM: [],
    newBookmarkInfo: '',
    deletedBookmarkInfo: '',
    bookmark: [],
    drawerSelected: null,
    updParentCollectionParam: {
        fromParentId: 0,
        ids: [],
        toParentId: 0
    }
}

const mutations = {
    SET_FAVOR: (state, data) => {
        state.favor = data
    },

    SET_DELETED_BOOKMARK_INFO: (state, deletedBookmarkInfo) => {
        state.deletedBookmarkInfo = deletedBookmarkInfo
    },

    ADD_BOOKMARK: (state, newBookmark) => {
        if(state.drawerSelected === newBookmark.parentId) {
            let i;
            for (i = 0; i < state.bookmark.length; i++) {
                if (state.bookmark[i].topTime === undefined) {
                    break
                }
            }
            state.bookmark.splice(i, 0, newBookmark)
        }
    },

    DELETE_BOOKMARK: (state, index) => {
        state.bookmark.splice(index, 1)
    },

    SET_BOOKMARK_TOP: (state, respAndIndex) => {
        state.bookmark = respAndIndex.resp.concat(state.bookmark)
        state.bookmark.splice(respAndIndex.index + 1, 1)
    },

    SET_BOOKMARK_TOP_CANCEL: (state, respAndIndex) => {
        state.bookmark.splice(respAndIndex.index, 1)
        state.bookmark.splice(parseInt(respAndIndex.resp), 0, respAndIndex.data)
    },

    UPDATE_BOOKMARK_INFO: (state, respAndIndex) => {
        state.bookmark.splice(respAndIndex.index, 1, respAndIndex.resp)
    },

    RESTORE_BOOKMARK: (state, index) => {
        state.deletedBookmarkInfo.splice(index, 1)
    },

    SET_BOOKMARK_IN_COLLECTION: (state, bookmarkInfo) => {
        state.bookmark = bookmarkInfo
        for(let collection of state.bookmark) {
            collection.createdTime = collection.createdTime.substr(0, 10)
        }
    },

    SET_DRAWER_SELECTED: (state, selected) => {
        state.drawerSelected = selected
    },
    SET_SELECTED_BM: (state, data) => {
        if(data.selected.length) {
            if(state.selectedBM.indexOf(data.id) === -1)
                state.selectedBM.push(data.selected[0])
        }else {
            state.selectedBM = state.selectedBM.filter(item => item !== data.id)
        }
    },

    SET_UPD_PARENT_ID: (state, fromParentId) => {
        state.updParentCollectionParam.fromParentId = fromParentId
        state.updParentCollectionParam.ids = state.selectedBM

    },

    SET_UPD_TO_PARENT_ID: (state, id) => {
        if(id === 0 || id === undefined) {
            state.updParentCollectionParam.toParentId = null
        }else {
            state.updParentCollectionParam.toParentId = id
        }
    },

    REMOVE_SELECTED_BM: () => {
        state.selectedBM = []
    },

    REMOVE_SELECTED: (state) => {
        for(let id of state.selectedBM) {
            state.bookmark = state.bookmark.filter(item => item.id !== id)
        }
        state.selectedBM = []
    },

    SET_SHOW_CHOSE: (state) => {
        state.showChose = !state.showChose
    }
}

const actions = {
    getFavor({commit}, sortAndPage) {
        return new Promise((resolve, reject) => {
            getFavor(sortAndPage).then(resp => {
                const {data} = resp
                commit('SET_BOOKMARK_IN_COLLECTION', data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    deleteBookmark(undefine, bookmarkIds) {
        return new Promise((resolve, reject) => {
            deleteBookmarkById(bookmarkIds).then(resp => {
                const {data} = resp
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    addBookmark({commit}, newBookmarkInfo) {
        return new Promise((resolve, reject) => {
            addBookmark(newBookmarkInfo).then(resp => {
                const {data} = resp
                commit('ADD_BOOKMARK', data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getDeletedBookmarks({commit}) {
        return new Promise((resolve, reject) => {
            getDeletedBookmarks().then(resp => {
                const {data} = resp
                commit('SET_DELETED_BOOKMARK_INFO', data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    restoreBookmark({commit}, restoreBookmarkParam) {
        return new Promise((resolve, reject) => {
            restoreBookmark(restoreBookmarkParam.restoreBookmarkArr).then(resp => {
                commit('RESTORE_BOOKMARK', restoreBookmarkParam.index)
                const {data} = resp
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    bookmarkTop({commit}, bookmarkParam) {
        return new Promise((resolve, reject) => {
            bookmarkTop(bookmarkParam.bookmarkArr).then(resp => {
                const {data} = resp
                bookmarkParam.respAndIndex.resp = data
                commit('SET_BOOKMARK_TOP', bookmarkParam.respAndIndex)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    bookmarkTopCancel({commit}, bookmarkParam) {
        return new Promise((resolve, reject) => {
            bookmarkTopCancel(bookmarkParam.bookmarkArr).then(resp => {
                const {data} = resp
                bookmarkParam.respAndIndex.resp = Object.keys(data)[0]
                bookmarkParam.respAndIndex.data = data[Object.keys(data)[0]]
                commit('SET_BOOKMARK_TOP_CANCEL', bookmarkParam.respAndIndex)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    updateBookmarkInfo({commit}, updatedBookmarkInfo) {
        return new Promise((resolve, reject) => {
            updateBookmarkInfo(updatedBookmarkInfo.bookmarkInfo).then(resp => {
                const {data} = resp
                updatedBookmarkInfo.respAndIndex.resp = data
                commit('UPDATE_BOOKMARK_INFO', updatedBookmarkInfo.respAndIndex)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getBookmark({commit}, getBmInCollectionParam) {
        return new Promise((resolve, reject) => {
            getBoomark(getBmInCollectionParam).then(resp => {
                const {data} = resp
                commit('SET_BOOKMARK_IN_COLLECTION', data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    updateParentCollection({commit}) {
        return new Promise((resolve, reject) => {
            updateParentCollection(state.updParentCollectionParam).then(resp => {
                const { data } = resp
                commit('REMOVE_SELECTED')
                resolve(data)
            }).catch(error => {
                reject(error)
            })

        })
    },

    setDrawerSelected({commit}, selected) {
        commit('SET_DRAWER_SELECTED', selected)
    },
}

export default {
    namespace: true,
    state,
    mutations,
    actions
}