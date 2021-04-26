import 'core-js/stable'
import 'regenerator-runtime/runtime';
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import axios from 'axios'

require('dotenv').config()

Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.prototype.$log = console.log.bind(console)

axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.VUE_APP_API_BASE

axios.interceptors.response.use(undefined, function (error) {
  if (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
  
        originalRequest._retry = true;
        store.dispatch('auth/LogOut')
        return router.push('/login')
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})
