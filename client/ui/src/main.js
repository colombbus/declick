import 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import Vue from 'vue'
import { mapActions } from 'vuex'
import router from './router'
import store from './store'
import config from 'assets/config/declick'
import Application from './Application'
import VueAnalytics from 'vue-analytics'

import i18n from './i18n'
// document.domain = config.domain

if (config.googleId) {
  Vue.use(VueAnalytics, {
    id: config.googleId,
    router
  })
}

/* eslint-disable no-new */
new Vue({
  el: '#application',
  template: '<application/>',
  store,
  router,
  i18n,
  components: {
    Application
  },
  created () {
    this.autoLogIn()
  },
  methods: mapActions(['autoLogIn'])
})
