import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import * as PIXI from 'pixi.js'

@Reflect.metadata('translated', i18n`Text`)
class Text extends GraphicClass {
  constructor() {
    super()
    this._value = ''
  }

  _createObject() {
    this._object = new PIXI.Text(this._value)
    this.dispatch('objectReady')
  }

  @Reflect.metadata('translated', i18n`setText`)
  @Reflect.metadata('help', i18n`setText_help`)
  setText(value) {
    this._value = value
    if (this._object == null) {
      this._createObject()
    } else {
      this._object.text = value
    }
  }

  @Reflect.metadata('translated', i18n`getText`)
  @Reflect.metadata('help', i18n`getText_help`)
  getText() {
    return this._value
  }
}

export default Text
