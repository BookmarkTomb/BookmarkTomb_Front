import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/user/Login'
import Register from '@/views/user/Register'
import ForgetPassword from '@/views/user/ForgetPassword'
import InitSystem from '@/views/InitSystem'
import CreateAdmin from "@/views/CreateAdmin";
import Admin from '@/views/personal/Admin'
import PersonalCenter from '@/views/personal/PersonalCenter'
import { getToken } from '@/lib/storage/token'
import jwtDecode from 'jwt-decode'

Vue.use(VueRouter)

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const whiteRouter = ['/login', '/register', '/forgetpassword', '/init', '/create']

const routes = [
  {
    path: '/',
    component: () => import('@/views/Main'),
    children: [
      {
        path: '/',
        name: 'MyCollection',
        component: () => import('@/views/drawer/pages/MyCollection')
      },
      {
        path: '/my/note',
        name: 'MyNote',
        component: () => import('@/views/drawer/pages/MyNote')
      },
      {
        path: '/folder',
        name: 'folder',
        component: () => import('@/views/drawer/pages/Folder')
      },
      {
        path: '/recycle',
        name: 'recycleBin',
        component: () => import('@/views/drawer/pages/RecycleBin')
      }
    ]
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    children: [
      {
        path: 'user',
        name: 'admin',
        component: () => import('@/views/personal/admin/pages/UserAdmin')
      },
      {
        path: 'monitor',
        name: 'admin',
        component: () => import('@/views/personal/admin/pages/SystemInfo')
      },
      {
        path: 'online',
        name: 'admin',
        component: () => import('@/views/personal/admin/pages/OnlineState')
      },
      {
        path: 'system',
        name: 'admin',
        component: () => import('@/views/personal/admin/pages/SetSystem')
      },
    ]
  },
  {
    path: '/myinfo',
    name: 'personalcenter',
    component: PersonalCenter,
    children: [
      {
        path: '/myinfo',
        component: () => import('@/views/personal/personalcenter/pages/MyInfo')
      },
      {
        path: '/changepassword',
        component: () => import('@/views/personal/personalcenter/pages/Security')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/forgetpassword',
    component: ForgetPassword
  },
  {
    path: '/init',
    component: InitSystem
  },
  {
    path: '/create',
    component: CreateAdmin
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes: routes,
})

router.beforeEach((to, from, next) => {
  if(getToken()) {
    if(!jwtDecode(getToken()).isAdmin && to.name === 'admin') {
      next('/')
    }
    next()
  }else{
    if(whiteRouter.indexOf(to.path) !== -1) { //存在
      next()
    }else{
      next('/login')
    }
  }
})

export default router
