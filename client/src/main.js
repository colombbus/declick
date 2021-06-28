import './registerServiceWorker'

import Vue from 'vue'
import { mapActions } from 'vuex'
import VueSEO from 'vue-analytics'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import ToggleButton from 'vue-js-toggle-button'

import './assets/styles/bootstrap-scss/dist/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(ToggleButton)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

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
