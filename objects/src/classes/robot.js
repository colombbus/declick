import Sprite from './sprite'
import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'

const DEFAULT_DISTANCE = 50

@Reflect.metadata('translated', i18n`Robot`)
class Robot extends Sprite {
  constructor() {
    super()
    this._distance = DEFAULT_DISTANCE
    this.addListener('movementChange', movement => {
      if (movement === 'stop') {
        this._runtime.resume()
      }
    })
  }

  moveForward(steps) {
    if (steps == null) {
      steps = 1
    }
    super.moveForward(steps * this._distance)
    this._runtime.suspend()
  }

  moveBackward(steps) {
    if (steps == null) {
      steps = 1
    }
    super.moveBackward(steps * this._distance)
    this._runtime.suspend()
  }

  moveUpward(steps) {
    if (steps == null) {
      steps = 1
    }
    super.moveUpward(steps * this._distance)
    this._runtime.suspend()
  }

  moveDownward(steps) {
    if (steps == null) {
      steps = 1
    }
    super.moveDownward(steps * this._distance)
    this._runtime.suspend()
  }

  setLocation(x, y) {
    super.setLocation(x * this._distance, y * this._distance)
  }
}

export default Robot
