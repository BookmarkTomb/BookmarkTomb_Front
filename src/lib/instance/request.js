import axios from 'axios'
import Config from '@/settings'
import {getToken, removeToken, getRememberMe} from '@/lib/storage/token'
import router from '@/router'
import store from '@/store'

const service = axios.create({
    baseURL: Config.baseURL,
    timeout: Config.timeout
})

service.interceptors.request.use(
    config => {
        config.headers['Authorization'] = getToken()
        config.headers['rememberMe'] = getRememberMe()
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        return response
    },
    async error => {
        await store.commit('SET_INIT_MESSAGE', error.response.data.code)
        if (error.response.data.code === 4108) {
            await router.push('/login')
            removeToken()
        }else if(error.response.data.code === 5001) {
            await router.push('/init')
        }else if(error.response.data.code === 5002) {
            await router.push('/create')
        }
        return Promise.reject(error);
    }
)

export default service