import Sprite from './sprite'
import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'

const DEFAULT_DISTANCE = 50

@Reflect.metadata('translated', i18n`Robot`)
class Robot extends Sprite {
  constructor(texture) {
    super(texture)
    this._distance = DEFAULT_DISTANCE
    this._moving = false
    this.addListener('movementChange', movement => {
      if (movement === 'stop') {
        this._moving = false
        this._runtime.resume()
      }
    })
  }

  moveForward(steps = 1) {
    if (!this._moving) {
      this._moving = true
      super.moveForward(steps * this._distance)
      this._runtime.suspend(true)
    }
  }

  moveBackward(steps = 1) {
    if (!this._moving) {
      this._moving = true
      super.moveBackward(steps * this._distance)
      this._runtime.suspend(true)
    }
  }

  moveUpward(steps = 1) {
    if (!this._moving) {
      this._moving = true
      super.moveUpward(steps * this._distance)
      this._runtime.suspend(true)
    }
  }

  moveDownward(steps = 1) {
    if (!this._moving) {
      this._moving = true
      super.moveDownward(steps * this._distance)
      this._runtime.suspend(true)
    }
  }

  setLocation(x, y) {
    super.setLocation(x * this._distance, y * this._distance)
  }
}

export default Robot
