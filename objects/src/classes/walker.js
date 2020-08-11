import Sprite from './sprite'
import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'
import { checkArguments } from '../utils'

const DEFAULT_GRAVITY = 500
const DEFAULT_JUMP = 400

@Reflect.metadata('translated', i18n`Walker`)
class Walker extends Sprite {
  constructor(texture) {
    super(texture)
    this._gravityY = DEFAULT_GRAVITY
    this._jumpAmount = DEFAULT_JUMP
    this._mayFall = false
    this._object.setBounce(0.1)
    //this._object.setCollideWorldBounds(true)
  }

  _setVelocity(vx, vy) {
    this._object.setVelocityX(vx)
    if (!this._mayFall) {
      this._object.setVelocityY(vy)
    }
  }

  _moveToTarget() {
    if (this._mayFall) {
      if (this._targetX > this._object.x) {
        this._object.setVelocityX(this._vX)
      } else if (this._targetX < this._object.x) {
        this._object.setVelocityX(-this._vX)
      } else {
        this._object.setVelocityX(0)
      }
      this._oldTargetDistance = this._distanceBetween(
        this._object.x,
        this._object.y,
        this._targetX,
        this._targetY,
      )
    } else {
      super._moveToTarget()
    }
  }

  _distanceBetween(x1, y1, x2, y2) {
    if (this._mayFall) {
      let dx = x1 - x2
      return Math.sqrt(dx * dx)
    } else {
      return super._distanceBetween(x1, y1, x2, y2)
    }
  }

  @Reflect.metadata('translated', i18n`mayFall`)
  @Reflect.metadata('help', i18n`mayFall_help`)
  @checkArguments(['boolean'], 1)
  mayFall(value = true) {
    this._mayFall = value
    if (this._mayFall) {
      this._object.setGravityY(this._gravityY)
    } else {
      this._object.setGravityY(0)
    }
  }

  @Reflect.metadata('translated', i18n`setGravity`)
  @Reflect.metadata('help', i18n`setGravity_help`)
  @checkArguments(['integer'])
  setGravity(value) {
    this._gravityY = value
    if (this._mayFall) {
      this._object.setGravityY(value)
    }
  }

  @Reflect.metadata('translated', i18n`jump`)
  @Reflect.metadata('help', i18n`jump_help`)
  jump() {
    if (this._object.body.blocked.down) {
      this._object.setVelocityY(-this._jumpAmount)
    }
  }

  @Reflect.metadata('translated', i18n`setJumpAmount`)
  @Reflect.metadata('help', i18n`setJumpAmount_help`)
  @checkArguments(['integer'])
  setJumpAmount(value) {
    this._jumpAmount = value
  }
}

export default Walker
