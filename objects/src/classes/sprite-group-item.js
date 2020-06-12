import Sprite from './sprite'
import 'reflect-metadata'

@Reflect.metadata('translated', i18n`SpriteGroupItem`)
class SpriteGroupItem extends Sprite {
  _buildObject() {}

  setObject(obj) {
    this._object = obj
    this._targetX = this._object.x
    this._targetY = this._object.y
    this._bindObject()
  }

  constructor(obj) {
    super()
    this.setObject(obj)
  }
}

export default SpriteGroupItem
