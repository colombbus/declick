import Sprite from './sprite'
import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'

const DEFAULT_GRAVITY = 300
const DEFAULT_JUMP = 30

@Reflect.metadata('translated', i18n`Walker`)
class Walker extends Sprite {
  constructor() {
    super()
    this._gravityY = DEFAULT_GRAVITY
    this._jumpAmount = DEFAULT_JUMP
    this._mayFall = false
    //this._object.setCollideWorldBounds(true)
  }

  @Reflect.metadata('translated', i18n`mayFall`)
  @Reflect.metadata('help', i18n`mayFall_help`)
  mayFall(value) {
    this._mayFall = typeof value === 'boolean' ? value : true
    if (this._mayFall) {
      this._object.setGravityY(this._gravityY)
    } else {
      this._object.setGravityY(0)
    }
  }

  @Reflect.metadata('translated', i18n`setGravity`)
  @Reflect.metadata('help', i18n`setGravity_help`)
  setGravity(value) {
    this._gravityY = value
    if (this._mayFall) {
      this._object.setGravityY(value)
    }
  }

  @Reflect.metadata('translated', i18n`addBLock`)
  @Reflect.metadata('help', i18n`addBlock_help`)
  addBlock(block) {
    this._graphics
      .getScene()
      .physics.add.collider(this._object, block.getGraphicalObject())
  }

  @Reflect.metadata('translated', i18n`jump`)
  @Reflect.metadata('help', i18n`jump_help`)
  jump() {
    if (this._object.body.touching.down) {
      this._object.setVelocityY(-(this._gravityY + this._jumpAmount))
    }
  }

  @Reflect.metadata('translated', i18n`setJumpAmount`)
  @Reflect.metadata('help', i18n`setJumpAmount_help`)
  setJumpAmount(value) {
    this._jumpAmount = value
  }
}

export default Walker