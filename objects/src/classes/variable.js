import i18n from 'es2015-i18n-tag'
import BaseClass from '../base-class'
import 'reflect-metadata'
import { checkArguments } from '../utils'

@Reflect.metadata('translated', i18n`Variable`)
class Variable extends BaseClass {
  constructor() {
    super()
    this._value = ''
  }

  @Reflect.metadata('translated', i18n`setText`)
  @Reflect.metadata('help', i18n`setText_help`)
  @checkArguments(['string'])
  setText(value) {
    this._value = value
  }

  @Reflect.metadata('translated', i18n`getText`)
  @Reflect.metadata('help', i18n`getText_help`)
  getText() {
    return this._value
  }
}

export default Variable
