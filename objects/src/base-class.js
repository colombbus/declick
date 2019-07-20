import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'

class BaseClass {
  static setRuntime(runtime) {
    this._runtime = runtime
  }

  constructor() {
    this._listeners = new Map()
    this._runtime = this.constructor._runtime
    if (this._runtime) {
      this._runtime.addObject(this)
    }
    this._addListener('delete', () => {
      if (this._runtime) {
        this._runtime.deleteObject(this)
      }
    })
  }

  _addListener(name, callback) {
    this._listeners.has(name) || this._listeners.set(name, [])
    this._listeners.get(name).unshift(callback)
  }

  _removeListener(name, callback) {
    if (this._listeners.has(name)) {
      let listeners = this._listeners.get(name)
      listeners = listeners.filter(listener => {
        listener !== callback
      })
      this._listeners.set(name, listeners)
    }
  }

  _dispatch(name, ...args) {
    if (this._listeners.has(name)) {
      const listeners = this._listeners.get(name)
      listeners.forEach(listener => {
        listener.apply(this, args)
      })
    }
  }

  @Reflect.metadata('translated', i18n`delete`)
  @Reflect.metadata('help', i18n`delete_help`)
  delete() {
    this._dispatch('delete')
  }
}

export default BaseClass
