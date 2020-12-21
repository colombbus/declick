import Sprite from './sprite'
import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'
import { checkArguments } from '../utils'

const DEFAULT_STEP_LENGTH = 50

@Reflect.metadata('translated', i18n`Robot`)
class Robot extends Sprite {
  constructor(texture) {
    super(texture)
    this._stepLength = DEFAULT_STEP_LENGTH
    this._moving = false
    this.addListener('movementChange', movement => {
      if (movement === 'stop') {
        this._moving = false
        window.setTimeout(() => {
          this._runtime.resume()
        }, 0)
      }
    })
  }

  @checkArguments(['integer'], 1)
  moveForward(steps = 1) {
    if (!this._moving) {
      this._moving = true
      super.moveForward(steps * this._stepLength)
      this._runtime.suspend(true)
    }
  }

  @checkArguments(['integer'], 1)
  moveBackward(steps = 1) {
    if (!this._moving) {
      this._moving = true
      super.moveBackward(steps * this._stepLength)
      this._runtime.suspend(true)
    }
  }

  @checkArguments(['integer'], 1)
  moveUpward(steps = 1) {
    if (!this._moving) {
      this._moving = true
      super.moveUpward(steps * this._stepLength)
      this._runtime.suspend(true)
    }
  }

  @checkArguments(['integer'], 1)
  moveDownward(steps = 1) {
    if (!this._moving) {
      this._moving = true
      super.moveDownward(steps * this._stepLength)
      this._runtime.suspend(true)
    }
  }

  @checkArguments(['integer', 'integer'])
  setLocation(x, y) {
    super.setLocation(x * this._stepLength, y * this._stepLength)
  }

  @Reflect.metadata('translated', i18n`setStepLength`)
  @Reflect.metadata('help', i18n`setStepLength_help`)
  @checkArguments(['integer'])
  setStepLength(length) {
    this._stepLength = length
  }

  getX() {
    return Math.round(this._object.x / this._stepLength)
  }

  getY() {
    return Math.round(this._object.y / this._stepLength)
  }
}

export default Robot
