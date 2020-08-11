import Sprite from './sprite'
import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'
import { checkArguments } from '../utils'

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

  @checkArguments(['integer'], 1)
  moveForward(steps = 1) {
    if (!this._moving) {
      this._moving = true
      super.moveForward(steps * this._distance)
      this._runtime.suspend(true)
    }
  }

  @checkArguments(['integer'], 1)
  moveBackward(steps = 1) {
    if (!this._moving) {
      this._moving = true
      super.moveBackward(steps * this._distance)
      this._runtime.suspend(true)
    }
  }

  @checkArguments(['integer'], 1)
  moveUpward(steps = 1) {
    if (!this._moving) {
      this._moving = true
      super.moveUpward(steps * this._distance)
      this._runtime.suspend(true)
    }
  }

  @checkArguments(['integer'], 1)
  moveDownward(steps = 1) {
    if (!this._moving) {
      this._moving = true
      super.moveDownward(steps * this._distance)
      this._runtime.suspend(true)
    }
  }

  @checkArguments(['integer', 'integer'])
  setLocation(x, y) {
    super.setLocation(x * this._distance, y * this._distance)
  }
}

export default Robot
