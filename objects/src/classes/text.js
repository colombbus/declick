import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import { checkArguments } from '../utils'

@Reflect.metadata('translated', i18n`Text`)
class Text extends GraphicClass {
  constructor(value) {
    super()
    this._value = value !== undefined ? value : ''
    this._object = this._graphics
      .getScene()
      .add.text(0, 0, this._value, { color: '#000000' })
    this._object.setOrigin(0)
  }

  @Reflect.metadata('translated', i18n`setText`)
  @Reflect.metadata('help', i18n`setText_help`)
  @checkArguments(['string'])
  setText(value) {
    this._value = value
    this._object.setText(value)
  }

  @Reflect.metadata('translated', i18n`getText`)
  @Reflect.metadata('help', i18n`getText_help`)
  getText() {
    return this._value
  }

  setLocation(x, y) {
    super.setLocation(x, y)
    this._object.setPosition(x, y)
  }
}

export default Text
