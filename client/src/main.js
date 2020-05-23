import './registerServiceWorker'

import Vue from 'vue'
import { mapActions } from 'vuex'
import VueSEO from 'vue-analytics'

import Application from '@/Application'
import config from '@/config'
import router from '@/router'
import store from '@/store'
import i18n from './translations'

// document.domain = config.domain

if (config.seoId) {
  Vue.use(VueSEO, {
    id: config.seoId,
    router,
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
    Application,
  },
  created() {
    this.autoLogIn()
  },
  methods: mapActions(['autoLogIn']),
})
