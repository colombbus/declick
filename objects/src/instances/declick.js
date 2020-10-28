import i18n from 'es2015-i18n-tag'
import BaseInstance from '../base-instance'
import 'reflect-metadata'
import { checkArguments } from '../utils'

@Reflect.metadata('translated', i18n`declick`)
class DeclickClass extends BaseInstance {
  @Reflect.metadata('translated', i18n`write`)
  @Reflect.metadata('help', i18n`write_help`)
  @checkArguments(['string'])
  write(value) {
    console.log(value)
  }

  @Reflect.metadata('translated', i18n`clear`)
  @Reflect.metadata('help', i18n`clear_help`)
  clear() {
    this._runtime.clear()
  }

  @Reflect.metadata('translated', i18n`suspend`)
  @Reflect.metadata('help', i18n`suspend_help`)
  suspend() {
    this._runtime.suspend()
  }

  @Reflect.metadata('translated', i18n`resume`)
  @Reflect.metadata('help', i18n`resume_help`)
  resume() {
    this._runtime.resume()
  }

  @Reflect.metadata('translated', i18n`stop`)
  @Reflect.metadata('help', i18n`stop_help`)
  stop() {
    this._runtime.stop()
  }
}

export default DeclickClass
