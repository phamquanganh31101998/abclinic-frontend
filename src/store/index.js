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
    loadingMsg: '',
    newNotification: null,
    typeNoti: 0,
    payloadId: 0
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
    },
    setNewNotification(state, payload){
      state.newNotification = payload
    },
    setHandleNotification(state, payload){
      state.typeNoti = payload.typeNoti
      state.payloadId = payload.payloadId
    },
    resetHandleNotification(state){
      state.typeNoti = 0;
      state.payloadId = 0;
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
    },
    setNewNotification({commit}, data){
      commit('setNewNotification', data)
    },
    setHandleNotification({commit}, data){
      commit('setHandleNotification', data)
    },
    resetHandleNotification({commit}){
      commit('resetHandleNotification')
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
    },
    newNotification: state => {
      return state.newNotification
    },
    handleNotificationObj: state => {
      let obj = {
        payloadId: state.payloadId,
        typeNoti: state.typeNoti
      }
      return obj
    }
  }
})
