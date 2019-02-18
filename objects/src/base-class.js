import i18n from 'es2015-i18n-tag'
import { expose } from './i18n'

class BaseClass {
  static _configuration = {
    instance: false,
    exposed: {
      delete: 'delete',
    },
    hidden: [],
  }

  _listeners = new Map()

  constructor() {
    this.dispatch('create')
  }

  addListener(name, callback) {
    this._listeners.has(name) || this._listeners.set(name, [])
    this._listeners.get(name).unshift(callback)
  }

  removeListener(name, callback) {
    if (this._listeners.has(name)) {
      let listeners = this._listeners.get(name)
      listeners = listeners.filter(listener => {
        listener !== callback
      })
      this._listeners.set(name, listeners)
    }
  }

  dispatch(name, ...args) {
    if (this._listeners.has(name)) {
      const listeners = this._listeners.get(name)
      listeners.forEach(listener => {
        listener.apply(this, args)
      })
    }
  }

  @expose(i18n`delete`, i18n`delete_help`)
  delete() {
    this.dispatch('delete')
  }
}

export default BaseClass
