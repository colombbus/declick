import Vue from 'vue'
import { mapActions } from 'vuex'
import router from '@/router'
import store from '@/store'
import config from '@/config'
import Application from '@/Application'
import VueSEO from 'vue-analytics'
import i18n from './i18n'
import './registerServiceWorker'

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
