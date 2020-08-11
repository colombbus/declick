import i18n from 'es2015-i18n-tag'
import BaseClass from '../base-class'
import { checkArguments } from '../utils'

@Reflect.metadata('translated', i18n`Random`)
class Random extends BaseClass {
  constructor() {
    super()
  }

  @Reflect.metadata('translated', i18n`throwDice`)
  @Reflect.metadata('help', i18n`throwDice_help`)
  @checkArguments(['integer'], 1)
  throwDice(max = 6) {
    return Math.floor(Math.random() * max) + 1
  }
}

export default Random
