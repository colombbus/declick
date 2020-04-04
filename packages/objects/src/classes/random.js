import i18n from 'es2015-i18n-tag'
import BaseClass from '../base-class'

@Reflect.metadata('translated', i18n`Random`)
class Random extends BaseClass {
  constructor() {
    super()
  }

  @Reflect.metadata('translated', i18n`throwDice`)
  @Reflect.metadata('help', i18n`throwDice_help`)
  throwDice(max) {
    return Math.floor(Math.random() * max) + 1
  }
}

export default Random
