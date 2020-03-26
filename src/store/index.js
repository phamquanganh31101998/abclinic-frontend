import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navDrawer: false
  },
  mutations: {
    toggleNavDrawer(state){
      state.navDrawer = !state.navDrawer
    }
  },
  actions: {
    toggleNavDrawer({commit}){
      commit('toggleNavDrawer')
    }
  },
  modules: {
  },
  getters: {
    navDrawer: state => {
      return state.navDrawer
    }
  }
})
