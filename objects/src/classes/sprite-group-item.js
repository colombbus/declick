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

  constructor(obj, poolMode = false, livingTime = false) {
    super()
    this.setObject(obj)
    this._poolMode = poolMode
    this._age = 0
    this._expires = livingTime
  }

  destroy() {
    if (this._poolMode && this._object !== null) {
      this._object.setActive(false)
      this._object.setVisible(false)
    } else {
      super.destroy()
    }
  }

  tick(delta) {
    if (this._expires !== false) {
      this._age += delta
      if (this._age > this._expires) {
        this.delete()
      }
    }
    super.tick(delta)
  }

  expiresIn(time) {
    this._expires = time
  }
}

export default SpriteGroupItem
