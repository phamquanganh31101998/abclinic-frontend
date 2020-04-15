import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navDrawer: false,
    ac_uid: null,
    user: null,
    alertSnackbar: false,
    alertMessage: 'asdfasdasdasdasdasdasdasdasdasdas',
    alertColor: 'error'
  },
  mutations: {
    toggleNavDrawer(state){
      state.navDrawer = !state.navDrawer
    },
    turnOnAlert(state, payload){
      state.alertMessage = payload.message;
      state.alertColor = payload.color;
      state.alertSnackbar = true;

    },
    turnOffAlert(state){
      state.alertSnackbar = false;
    },
    setAuthData(state, payload){
      state.ac_uid = localStorage.getItem('ac_uid')
      state.user = payload
    },
    clearAuthData(state){
      state.ac_uid = null;
      state.user = null;
      localStorage.removeItem('ac_uid')
      router.replace('/login')
    }
  },
  actions: {
    toggleNavDrawer({commit}){
      commit('toggleNavDrawer')
    },
    turnOnAlert({commit}, data){
      commit('turnOnAlert', data)
    },
    turnOffAlert({commit}){
      commit('turnOffAlert')
    },
    setAuthData({commit}, data){
      commit('setAuthData', data)
    },
    clearAuthData({commit}){
      commit('clearAuthData')
    }
  },
  modules: {
  },
  getters: {
    navDrawer: state => {
      return state.navDrawer
    },
    alertSnackbar: state => {
      return state.alertSnackbar
    },
    alertMessage: state => {
      return state.alertMessage
    },
    alertColor: state => {
      return state.alertColor
    }
  }
})
