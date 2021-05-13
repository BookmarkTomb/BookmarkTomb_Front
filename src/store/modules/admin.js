import {
  getAllUsers,
  addUser,
  logoffUser,
  setUserPassw,
  restoreUser, getOnline,
  offlineAllUsers,
  offlineUser,
  setUserInfo,
  getSystemInfo,
  shutdownSystem,
} from '@/api/admin'

const state = {
  userInfo: [],
  onlineInfo: [],
  systemInfo: []
}

const mutations = {
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },

  ADD_USER: (state, addUserInfo) => {
    state.userInfo.push(addUserInfo)
  },

  LOGOFF_USER: (state, index) => {
    state.userInfo[index].isEnabled = false
  },

  RESTORE_USER: (state, index) => {
    state.userInfo[index].isEnabled = true
  },

  SET_ONLINE_INFO: (state, onlineInfo) => {
    state.onlineInfo = onlineInfo
    for(let i=0; i<state.onlineInfo.length; i++) {
      if(state.onlineInfo[i].rememberMe === 'true'){
        state.onlineInfo[i].rememberMe = '长期'
      }else{
        state.onlineInfo[i].rememberMe = '临时'
      }
    }
  },

  OFFLINE_USER: (state, userId) => {
    state.onlineInfo = state.onlineInfo.filter(item => item.id !== userId)
  },

  SET_SYSTEM_INFO: (state, systemInfo) => {
    state.systemInfo = systemInfo
  }

}

const actions = {
  getAllUsers({ commit }) {
    return new Promise ((resolve, reject) => {
      getAllUsers().then(resp => {
        const { data } = resp
        commit('SET_USER_INFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  addUser({ commit }, addUserParam) {
    return new Promise ((resolve, reject) => {
      addUser(addUserParam).then(resp => {
        const { data } = resp
        commit('ADD_USER', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  logoffUser({ commit }, logoffParam) {
    return new Promise((resolve, reject) => {
      logoffUser(logoffParam.userId).then(resp => {
        const { data } = resp
        commit('LOGOFF_USER', logoffParam.index)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  restoreUser({ commit }, restoreUserParam) {
    return new Promise((resolve, reject) => {
      restoreUser(restoreUserParam.userId).then(resp => {
        const { data } = resp
        commit('RESTORE_USER', restoreUserParam.index)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  setUserPassw(undefine, setUserPasswParam) {
    return new Promise((resolve, reject) => {
      setUserPassw(setUserPasswParam).then(resp => {
        const { data } = resp
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getOnline({ commit }) {
    return new Promise((resolve, reject) => {
      getOnline().then(resp => {
        const { data } = resp
        commit('SET_ONLINE_INFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  offlineAllUsers() {
    return new Promise((resolve, reject) => {
      offlineAllUsers().then(resp => {
        const { data } = resp
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  offlineUser({ commit }, id) {
    return new Promise((resolve, reject) => {
      offlineUser(id).then(resp => {
        const { data } = resp
        commit('OFFLINE_USER', id)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  setUserInfo(undefine, setUserInfoParam) {
    return new Promise((resolve, reject) => {
      setUserInfo(setUserInfoParam).then(resp => {
        const { data } = resp
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getSystemInfo({ commit }) {
    return new Promise((resolve,reject) => {
      getSystemInfo().then(resp => {
        const { data } = resp
        commit('SET_SYSTEM_INFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  shutdownSystem() {
    return new Promise((resolve, reject) => {
      shutdownSystem().then(resp => {
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },
}




export default {
  namespace: true,
  state,
  mutations,
  actions
}