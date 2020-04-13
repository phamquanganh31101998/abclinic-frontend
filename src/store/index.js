import Vue from 'vue'
import Vuex from 'vuex'

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
