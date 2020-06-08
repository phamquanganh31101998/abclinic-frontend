import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Notification from '../views/Notification.vue'
import Login from '../views/Auth/Login.vue'
import Info from '../views/UserInfo.vue'
import Staff from '../views/Staff/Staff.vue'
import Coordinator from '../views/Staff/Coordinator'
import Practitioner from '../views/Staff/Practitioner'
import Doctor from '../views/Staff/Doctor'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/notification',
    beforeEnter: (to, from, next) => {
      const isLogin = localStorage.getItem('ac_uid');
      if(!isLogin){
        next('/login')
      }
      else {
        next()
      }
    },
    children: [
      {
        path: '/notification',
        name: 'Notification',
        component: Notification,
      },
      {
        path: '/staff',
        name: 'Staff',
        component: Staff,
      },
      {
        path: '/coordinator',
        name: 'Coordinator',
        component: Coordinator,
      },
      // {
      //   path: '/patient/:idPatient',
      //   name: 'Patient',
      //   component: Patient,
      //   props(route) {
      //     const props = {
      //         ...route.params
      //     }
      //     props.idPatient
      //     return props
      //   },
      // },
      {
        path: '/practitioner',
        name: 'Practitioner',
        component: Practitioner,
      },
      {
        path: '/doctor',
        name: 'Doctor',
        component: Doctor,
      },
      {
        path: '/info',
        name: 'Info',
        component: Info,
      }
    ]
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
        next()
      }
    }
  },
  {
    path: '*',
    redirect: '/'
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
