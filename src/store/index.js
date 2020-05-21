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
    alertMessage: '',
    alertColor: 'error',
    loadingDialog: false,
    loadingMsg: ''
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
      state.alertMessage = '';
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
    },
    turnOnLoadingDialog(state, payload){
      state.loadingMsg = payload;
      state.loadingDialog = true;
    },
    turnOffLoadingDialog(state){
      state.loadingDialog = false;
      state.loadingMsg = ''
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
    },
    turnOnLoadingDialog({commit}, data){
      commit('turnOnLoadingDialog', data)
    },
    turnOffLoadingDialog({commit}){
      commit('turnOffLoadingDialog')
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
    },
    loadingDialog: state => {
      return state.loadingDialog
    },
    loadingMsg: state => {
      return state.loadingMsg
    },
    user: state => {
      return state.user
    }
  }
})
