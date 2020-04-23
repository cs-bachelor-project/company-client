import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        alerts: {
            type: 'success',
            data: '',
        },
        loading: false,
    },
    mutations: {
        alerting(state, payload) {
            state.alerts = payload
        },
        clearAlerting(state) {
            state.alerts.data = ''
        }
    },
})