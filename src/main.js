import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VueToast from 'vue-toast-notification';
// Import one of available themes
import 'vue-toast-notification/dist/theme-default.css';
Vue.config.productionTip = false
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
Vue.use(VueToast, {
  duration: 5000,
  dismissible: false,
  position: 'bottom-right',
})
