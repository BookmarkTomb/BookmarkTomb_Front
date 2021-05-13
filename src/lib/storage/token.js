import Config from '@/settings'
import jwtDecoder from 'jwt-decode'

export function getToken() {
  let token = localStorage.getItem(Config.tokenName)
  token = judgeToken(token)
  return token
}

export function setToken(token) {
  localStorage.setItem(Config.tokenName, token)
}

export function removeToken() {
  localStorage.removeItem(Config.tokenName)
}

export function judgeToken(token) {
  try {
    jwtDecoder(token)
  } catch (error) {
    removeToken()
    return null
  }
  return token
}

export function setRememberMe(rememberMe) {
  localStorage.setItem('rememberMe', rememberMe)
}

export function getRememberMe() {
  return localStorage.getItem('rememberMe') === 'true'
}