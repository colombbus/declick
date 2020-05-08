import Vue from 'vue'
import {mapActions} from 'vuex'
import router from '@/router'
import store from '@/store'
import config from '@/config'
import Application from '@/Application'
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
  i18n,
  template: '<application/>',
  store,
  router,
  components: {
    Application
  },
  created () {
    this.autoLogIn()
  },
  methods: mapActions(['autoLogIn'])
})
