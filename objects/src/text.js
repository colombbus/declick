import i18n from 'es2015-i18n-tag'
import { expose, translate } from './i18n'
import BaseClass from './base-class'

@translate(i18n`Text`)
class Text extends BaseClass {
  _value = ''

  @expose(i18n`setText`, i18n`setText_help`)
  setText(value) {
    _value = value
  }

  @expose(i18n`getText`, i18n`getText_help`)
  getText() {
    return _value
  }
}

export default Text
