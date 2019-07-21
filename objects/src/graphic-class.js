import BaseClass from './base-class'
import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'

const MOVE_STOP = 0
const MOVE_TARGET = 1
const MOVE_FORWARD = 2
const MOVE_BACKWARD = 3
const MOVE_UPWARD = 4
const MOVE_DOWNWARD = 5

class GraphicClass extends BaseClass {
  constructor() {
    super()
    this._graphics = this._runtime.getGraphics()
    this._x = 0
    this._y = 0
    this._vX = 5
    this._vY = 5
    this._targetX = 0
    this._targetY = 0
    this._movement = MOVE_STOP
    this._object = null
    this.addListener('objectReady', () => {
      this._graphics.addObject(this)
    })
    this.addListener('delete', () => {
      this._graphics.removeObject(this)
      this._object = null
    })
  }

  _getLoader() {
    return this._graphics.getLoader()
  }

  tick(delta) {
    if (this._movement !== MOVE_STOP) {
      this._move(delta)
      this._object.x = this._x
      this._object.y = this._y
    }
  }

  _move(delta) {
    const that = this
    const computeMove = {
      [MOVE_STOP]: function() {},
      [MOVE_TARGET]: function() {
        let xReached = false,
          yReached = false
        if (that._x > that._targetX) {
          that._x = Math.max(that._targetX, that._x - delta * that._vX)
        } else if (that._x < that._targetX) {
          that._x = Math.min(that._targetX, that._x + delta * that._vX)
        } else {
          xReached = true
        }
        if (that._y > that._targetY) {
          that._y = Math.max(that._targetY, that._y - delta * that._vY)
        } else if (that._y < that._targetY) {
          that._y = Math.min(that._targetY, that._y + delta * that._vY)
        } else {
          yReached = true
        }
        if (xReached && yReached) {
          that._movement = MOVE_STOP
        }
      },
      [MOVE_FORWARD]: function() {
        that._x += delta * that._vX
      },
      [MOVE_BACKWARD]: function() {
        that._x -= delta * that._vX
      },
      [MOVE_UPWARD]: function() {
        that._y -= delta * that._vY
      },
      [MOVE_DOWNWARD]: function() {
        that._y += delta * that._vY
      },
    }
    computeMove[this._movement]()
  }

  _setTargetMovement() {
    if (this._movement !== MOVE_STOP && this._movement !== MOVE_TARGET) {
      this._targetX = this._x
      this._targetY = this._y
    }
    this._movement = MOVE_TARGET
  }

  @Reflect.metadata('translated', i18n`moveForward`)
  @Reflect.metadata('help', i18n`moveForward_help`)
  moveForward(distance) {
    this._setTargetMovement()
    this._targetX = this._x + distance
  }

  @Reflect.metadata('translated', i18n`moveBackward`)
  @Reflect.metadata('help', i18n`moveBackward_help`)
  moveBackward(distance) {
    this._setTargetMovement()
    this._targetX = this._x - distance
  }

  @Reflect.metadata('translated', i18n`moveUpward`)
  @Reflect.metadata('help', i18n`moveUpward_help`)
  moveUpward(distance) {
    this._setTargetMovement()
    this._targetY = this._y - distance
  }

  @Reflect.metadata('translated', i18n`moveDownward`)
  @Reflect.metadata('help', i18n`moveDownward_help`)
  moveDownward(distance) {
    this._setTargetMovement()
    this._targetY = this._y + distance
  }

  @Reflect.metadata('translated', i18n`stop`)
  @Reflect.metadata('help', i18n`stop_help`)
  stop() {
    this._movement = MOVE_STOP
    this._targetX = this._x
    this._targetY = this._y
  }

  @Reflect.metadata('translated', i18n`moveAlwaysForward`)
  @Reflect.metadata('help', i18n`moveAlwaysForward_help`)
  moveAlwaysForward() {
    this._movement = MOVE_FORWARD
  }

  @Reflect.metadata('translated', i18n`moveAlwaysBackward`)
  @Reflect.metadata('help', i18n`moveAlwaysBackward_help`)
  moveAlwaysBackward() {
    this._movement = MOVE_BACKWARD
  }

  @Reflect.metadata('translated', i18n`moveAlwaysUpward`)
  @Reflect.metadata('help', i18n`moveAlwaysUpward_help`)
  moveAlwaysUpward() {
    this._movement = MOVE_UPWARD
  }

  @Reflect.metadata('translated', i18n`moveAlwaysDownward`)
  @Reflect.metadata('help', i18n`moveAlwaysDownward_help`)
  moveAlwaysDownward() {
    this._movement = MOVE_DOWNWARD
  }
}

export default GraphicClass
