import { getToken, setToken, setRememberMe } from '@/lib/storage/token'
import { getCodeImg, login, register, setUserComInfo, resetUserPwd, getUserInfo, getEmailVerifyCode, resetUserEmail, setUserAvatar, getUserAvatar } from '@/api/user'

const state = { 
  userToken: getToken(),
  username: '',
  nickname: '',
  id: '',
  email: '',
  userAvatar: '',
  isAdmin: '',
  isEnabled: ''
}

const mutations = {
  SET_USER_TOKEN: (state, userToken) => {
    state.userToken = userToken
  },

  SET_USERNAME: (state, username) => {
    state.username = username
  },

  SET_USER_ID: (state, id) => {
    state.id = id
  },

  SET_USER_AVATAR: (state, userAvatar) => {
    state.userAvatar = userAvatar
  },

  SET_USER_EMAIL: (state, email) => {
    state.email = email
  },

  SET_USER_NICKNAME: (state, nickname) => {
    state.nickname = nickname
  },

  SET_USER_ISADMIN: (state, isAdmin) => {
    state.isAdmin =isAdmin
  },

  SET_USER_ISENABLED: (state, isEnabled) => {
    state.isEnabled =isEnabled
  }
}

const actions = {
  async getVerifyCodeImg() {
    const {data} = await getCodeImg()
    return data
  },

  userLogin({ commit }, loginInfo) {
    // const { loginAccount, loginPassword, code, codeUid } = loginInfo
    return new Promise ((resolve, reject) => {
      login(loginInfo).then(resp => {
        const { data } = resp
        setToken(data.token)
        setRememberMe(loginInfo.rememberMe)
        commit('SET_USER_TOKEN', data.token)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  userRegister(undefine, registerInfo) {
    // const { userName, userPassword, userEmail } = registerInfo
    return new Promise ((resolve, reject) => {
      // register({userName: userName, userPassword: userPassword, userEmail: userEmail}).then(resp => {
      register(registerInfo).then(resp => {
        const { data } = resp
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  setUserComInfo({ commit }, userNickname) {
    return new Promise((resolve, reject) => {
      setUserComInfo(userNickname).then(resp => {
        commit('SET_USER_NICKNAME', userNickname.nickname)
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },

  resetUserPwd(undefine, resetPwdParam) {
    return new Promise((resolve, reject) => {
      resetUserPwd(resetPwdParam).then(resp => {
        resolve(resp)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(resp => {
        const { data } = resp
        commit('SET_USERNAME', data.username)
        commit('SET_USER_ID', data.id)
        commit('SET_USER_NICKNAME', data.nickname)
        commit('SET_USER_ISADMIN', data.isAdmin)
        commit('SET_USER_ISENABLED', data.isEnabled)
        commit('SET_USER_EMAIL', data.email)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getEmailVerifyCode(undefine, email) {
    return new Promise((resolve, reject) => {
      getEmailVerifyCode(email).then(resp => {
        const { data } = resp
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  resetUserEmail(undefine, resetUserEmailParam) {
    return new Promise((resolve, reject) => {
      resetUserEmail(resetUserEmailParam).then(resp => {
        const { data } = resp
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  setUserAvatar({ commit }, avatarData) {
    return new Promise((resolve, reject) => {
      setUserAvatar(avatarData.formData).then(resp => {
        const { data } = resp
        commit('SET_USER_AVATAR', avatarData.data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUserAvatar({ commit }) {
    return new Promise((resolve, reject) => {
      getUserAvatar().then(resp => {
        const { data } = resp
        commit('SET_USER_AVATAR', data)
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