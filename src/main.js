import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import moment from 'moment'
import decode from 'jwt-decode'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import Toast, { TYPE } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import cityData from './assets/city.json'
import Echo from 'laravel-echo'
window.io = require('socket.io-client')

Vue.config.productionTip = false

const AUTH_TOKEN_KEY = 'token'

window.Echo = new Echo({
  broadcaster: 'socket.io',
  host: window.location.hostname + ':6001',
  auth: {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
    }
  }
})

Vue.prototype.$axios = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 30000,
})

Vue.use(Toast, {
  toastDefaults: {
    [TYPE.ERROR]: {
      timeout: 5000,
    },
    [TYPE.INFO]: {
      timeout: 4000,
    },
    [TYPE.SUCCESS]: {
      timeout: 3000,
    }
  },
})
Vue.component('datetime', Datetime)

Vue.prototype.$axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`

Vue.mixin({
  data: function () {
    return {
      get moment() {
        return moment
      },
      get cities() {
        return cityData
      },
      meta: {
        currentPage: 1,
        nextPageUrl: null,
        totalPages: 0,
        ready: false,
      },
    }
  },
  methods: {
    getPostal(city) {
      return this.cities[city]
    },
    getCity(postal) {
      return Object.keys(this.cities).find(k => this.cities[k] == postal)
    },
    utcToLocal: function (time) {
      return this.moment.utc(time).local()
    },
    logout: function () {
      this.clearAuthToken()
      this.$router.push({ name: 'index' })
    },
    setAuthToken: function (token) {
      Vue.prototype.$axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    },
    getAuthToken: function () {
      return localStorage.getItem(AUTH_TOKEN_KEY)
    },
    clearAuthToken: function () {
      Vue.prototype.$axios.defaults.headers.common['Authorization'] = ''
      localStorage.removeItem(AUTH_TOKEN_KEY)
    },
    isLoggedIn: function () {
      let authToken = this.getAuthToken()
      return !!authToken && !this.isTokenExpired(authToken)
    },
    getUserInfo: function () {
      if (this.isLoggedIn()) {
        return decode(this.getAuthToken())
      }
    },
    hasAnyRole: function (roles) {
      let userRoles = this.getUserInfo().roles

      for (let i = 0; i < roles.length; i++) {
        let has = userRoles.includes(roles[i])

        if (has === true) {
          return true
        }
      }

      return false
    },
    getTokenExpirationDate: function (encodedToken) {
      let token = decode(encodedToken)
      if (!token.exp) {
        return null
      }

      let date = new Date(0)
      date.setUTCSeconds(token.exp)

      return date
    },
    isTokenExpired: function (token) {
      let expirationDate = this.getTokenExpirationDate(token)
      return expirationDate < new Date()
    }
  }
})

Vue.component('loading', require('./components/loading.vue').default)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
