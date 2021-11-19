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

let isRefreshing = false;

axios.interceptors.request.use((config) => {
  const isAuthenticated = store.getters["auth/isAuthenticated"];
  if (isAuthenticated == null) {
    return config;
  }

  const tokens = store.getters["auth/getTokens"];
  config.headers.common["Authorization"] = `bearer ${tokens.token}`;
  return config;
});

axios.interceptors.response.use(

  (response) => {
    return response;
  },

  async (error) => {
    if (error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        const tokens = store.getters["auth/getTokens"];
        const payload = {
          refresh_token: tokens.refreshToken,
        };

        var response = await axios.post('auth/refresh',
          payload
        );

        await store.dispatch("auth/refreshTokens", response.data.data);

        if (response.data.data) {
          isRefreshing = false;
        }

        error.config.headers[
          "Authorization"
        ] = `Bearer ${response.data.data.access_token}`;

        return axios(error.config);
      } else {
        store.dispatch('auth/LogOut')
        return router.push('/login')
      }

    } else {
      return Promise.reject(error);
    }
  }
);

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
