import BaseClass from './base-class'
import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'

class GraphicClass extends BaseClass {
  constructor() {
    super()
    this._graphics = this.constructor._graphics
    this._x = 0
    this._y = 0
    this._vX = 10
    this._vY = 10
    this._targetX = 0
    this._targetY = 0
    this._movement = 'stop'
    this._object = null
    this._graphics.addObject(this)
    this.addListener('delete', () => {
      this._graphics.removeObject(this)
    })
  }

  static setRuntime(runtime) {
    super.setRuntime(runtime)
    this._graphics = this._runtime.getGraphics()
  }

  static setup() {
    // to be implemented by children classes
  }

  tick(delta) {
    if (this._movement !== 'stop') {
      this._move(delta)
      this._object.x = this._x
      this._object.y = this._y
      this.dispatch('move', this._x, this._y)
    }
  }

  addToScene() {
    // to be implemented by children classes
  }

  destroy() {
    if (this._object !== null) {
      this._object.destroy()
      this._object = null
    }
  }

  _move(delta) {
    const that = this
    delta = delta / 100
    const computeMove = {
      stop: function() {},
      target: function() {
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
          that._setMovement('stop')
        }
      },
      forward: function() {
        that._x += delta * that._vX
      },
      backward: function() {
        that._x -= delta * that._vX
      },
      upward: function() {
        that._y -= delta * that._vY
      },
      downward: function() {
        that._y += delta * that._vY
      },
    }
    computeMove[this._movement]()
  }

  _setMovement(newMovement) {
    this._movement = newMovement
    this.dispatch('movementChange')
  }

  _initTargetMovement() {
    if (this._movement !== 'stop' && this._movement !== 'target') {
      this._targetX = this._x
      this._targetY = this._y
    }
  }

  @Reflect.metadata('translated', i18n`moveForward`)
  @Reflect.metadata('help', i18n`moveForward_help`)
  moveForward(distance) {
    this._initTargetMovement()
    this._targetX = this._x + distance
    this._setMovement('target')
  }

  @Reflect.metadata('translated', i18n`moveBackward`)
  @Reflect.metadata('help', i18n`moveBackward_help`)
  moveBackward(distance) {
    this._initTargetMovement()
    this._targetX = this._x - distance
    this._setMovement('target')
  }

  @Reflect.metadata('translated', i18n`moveUpward`)
  @Reflect.metadata('help', i18n`moveUpward_help`)
  moveUpward(distance) {
    this._initTargetMovement()
    this._targetY = this._y - distance
    this._setMovement('target')
  }

  @Reflect.metadata('translated', i18n`moveDownward`)
  @Reflect.metadata('help', i18n`moveDownward_help`)
  moveDownward(distance) {
    this._initTargetMovement()
    this._targetY = this._y + distance
    this._setMovement('target')
  }

  @Reflect.metadata('translated', i18n`stop`)
  @Reflect.metadata('help', i18n`stop_help`)
  stop() {
    this._setMovement('stop')
    this._targetX = this._x
    this._targetY = this._y
  }

  @Reflect.metadata('translated', i18n`moveAlwaysForward`)
  @Reflect.metadata('help', i18n`moveAlwaysForward_help`)
  moveAlwaysForward() {
    this._setMovement('forward')
  }

  @Reflect.metadata('translated', i18n`moveAlwaysBackward`)
  @Reflect.metadata('help', i18n`moveAlwaysBackward_help`)
  moveAlwaysBackward() {
    this._setMovement('backward')
  }

  @Reflect.metadata('translated', i18n`moveAlwaysUpward`)
  @Reflect.metadata('help', i18n`moveAlwaysUpward_help`)
  moveAlwaysUpward() {
    this._setMovement('upward')
  }

  @Reflect.metadata('translated', i18n`moveAlwaysDownward`)
  @Reflect.metadata('help', i18n`moveAlwaysDownward_help`)
  moveAlwaysDownward() {
    this._setMovement('downward')
  }

  @Reflect.metadata('translated', i18n`setLocation`)
  @Reflect.metadata('help', i18n`setLocation_help`)
  setLocation(x, y) {
    this._x = x
    this._y = y
    this._targetX = x
    this._targetY = y
    this._object.x = x
    this._object.y = y
    this.dispatch('move', x, y)
  }
}

export default GraphicClass
