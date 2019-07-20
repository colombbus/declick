import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'

export default class {
  static get _listeners() {
    if (!this.hasOwnProperty('_ownListeners')) {
      this._ownListeners = new Map()
    }
    return this._ownListeners
  }

  static set _listeners(value) {
    this._ownListeners = value
  }

  constructor() {
    this.constructor.dispatch('create', this)
  }

  static addListener(name, callback) {
    this._listeners.has(name) || this._listeners.set(name, [])
    this._listeners.get(name).unshift(callback)
  }

  static removeListener(name, callback) {
    if (this._listeners.has(name)) {
      let listeners = this._listeners.get(name)
      listeners = listeners.filter(listener => {
        listener !== callback
      })
      this._listeners.set(name, listeners)
    }
  }

  static dispatch(name, instance, ...args) {
    let currentClass = this
    while (currentClass._listeners != null) {
      if (currentClass._listeners.has(name)) {
        const listeners = currentClass._listeners.get(name)
        listeners.forEach(listener => {
          listener.apply(instance, args)
        })
      }
      currentClass = Object.getPrototypeOf(currentClass)
    }
  }

  @Reflect.metadata('translated', i18n`delete`)
  @Reflect.metadata('help', i18n`delete_help`)
  delete() {
    this.constructor.dispatch('delete', this)
  }
}