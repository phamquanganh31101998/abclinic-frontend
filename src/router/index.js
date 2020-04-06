import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Auth/Login.vue'
import Info from '../views/UserInfo.vue'
import Staff from '../views/Staff/Staff.vue'
import Coordinator from '../views/Staff/Coordinator'
import Practitioner from '../views/Staff/Practitioner'
import Specialist from '../views/Staff/Specialist'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      const isLogin = localStorage.getItem('ac_uid');
      if(!isLogin){
        alert('Vui lòng đăng nhập lại')
        next('/login')
      }
      else {
        next()
      }
    }
  },
  {
    path: '/staff',
    name: 'Staff',
    component: Staff,
    beforeEnter: (to, from, next) => {
      const isLogin = localStorage.getItem('ac_uid');
      if(!isLogin){
        alert('Vui lòng đăng nhập lại')
        next('/login')
      }
      else {
        next()
      }
    }
  },
  {
    path: '/coordinator',
    name: 'Coordinator',
    component: Coordinator,
    beforeEnter: (to, from, next) => {
      const isLogin = localStorage.getItem('ac_uid');
      if(!isLogin){
        alert('Vui lòng đăng nhập lại')
        next('/login')
      }
      else {
        next()
      }
    }
  },
  {
    path: '/practitioner',
    name: 'Practitioner',
    component: Practitioner,
    beforeEnter: (to, from, next) => {
      const isLogin = localStorage.getItem('ac_uid');
      if(!isLogin){
        alert('Vui lòng đăng nhập lại')
        next('/login')
      }
      else {
        next()
      }
    }
  },
  {
    path: '/specialist',
    name: 'Specialist',
    component: Specialist,
    beforeEnter: (to, from, next) => {
      const isLogin = localStorage.getItem('ac_uid');
      if(!isLogin){
        alert('Vui lòng đăng nhập lại')
        next('/login')
      }
      else {
        next()
      }
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      const isLogin = localStorage.getItem('ac_uid');
      if(isLogin){
        next('/')
      }
      else {
        alert('Bắt đầu đăng nhập')
        next()
      }
    }
  },
  {
    path: '/info',
    name: 'Info',
    component: Info,
    beforeEnter: (to, from, next) => {
      const isLogin = localStorage.getItem('ac_uid');
      if(!isLogin){
        alert('Vui lòng đăng nhập lại')
        next('/login')
      }
      else {
        next()
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
