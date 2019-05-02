import { pick, uniq } from 'lodash'
import Vue from 'vue'
import VueI18n from 'vue-i18n'

import languagesNames from './languages-names.json'
import messages from './messages'

Vue.use(VueI18n)

const supportedLocales = Object.keys(messages)

export const supportedLanguages = pick(languagesNames, supportedLocales)

export default new VueI18n({
  locale: autoselectLocale(supportedLocales, 'en'),
  messages,
})

function autoselectLocale(supportedLocales, defaultLocale) {
  return getUserLocales().find(lang => supportedLocales.includes(lang)) || defaultLocale
}

function getUserLocales() {
  return uniq([navigator.language, ...(navigator.languages || [])]
    .map(locale => locale.split('-')[0])
  )
}
