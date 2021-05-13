import { initSystem, createAdmin, getVersion } from "@/api/publicInfo"

const state = {
    systemColor: 'blue darken-2',
    name: '',
    version: '',
    language: '',
    errorCode: '' //记录初始化项目过程中后端返回的错误信息
}

const mutations = {
    SET_SYSTEM_COLOR: (state, color) => {
        state.systemColor = color
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_VERSION: (state, version) => {
        state.version = version
    },
    SET_INIT_MESSAGE: (state, message) => {
        state.errorCode = message
    },
    SET_LANGUAGE: (state, language) => {
        state.language = language
    }
}

const actions = {
    initSystem(undefine, initSystemParam) {
        return new Promise((resolve, reject) => {
            initSystem(initSystemParam).then(resp => {
                const { data } = resp
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    createAdmin(undefine, createAdminParam) {
        return new Promise((resolve, reject) => {
            createAdmin(createAdminParam).then(resp => {
                const { data } = resp
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getVersion({commit}) {
        return new Promise((resolve, reject) => {
            getVersion().then(resp => {
                const { data } = resp
                commit('SET_NAME', data.name)
                commit('SET_VERSION', data.version)
                resolve(data)
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