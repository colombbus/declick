import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'
import EventsInterface from './events-interface'

@Reflect.metadata('instance', false)
class BaseClass extends EventsInterface {
  static setRuntime(runtime) {
    this._runtime = runtime
  }

  constructor() {
    super()
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

  @Reflect.metadata('translated', i18n`delete`)
  @Reflect.metadata('help', i18n`delete_help`)
  delete() {
    this._dispatch('delete')
  }
}

export default BaseClass
