import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import robotData from '../../resources/robot.json'
import robotTexture from '../../resources/robot.png'
import { checkArguments } from '../utils'

const DEFAULT_SPEED = 200

@Reflect.metadata('translated', i18n`Sprite`)
class Sprite extends GraphicClass {
  static _texture = 'sprite_default_animation'

  static setupDone = false

  static setup() {
    if (!this.setupDone) {
      super.setup()
      this._graphics.addLocalResource(
        'atlas',
        'sprite_default_animation',
        robotTexture,
        robotData,
      )
      this.setupDone = true
    }
  }

  _buildObject() {
    const scene = this._graphics.getScene()
    this._object = scene.physics.add.sprite(0, 0, this._texture)
    this._object.setOrigin(0)
    this._object.body.reset(0, 0)
    const jsonData = scene.cache.json.get(this._texture)
    if (jsonData !== undefined && jsonData.anims !== undefined) {
      ;['face', 'left', 'right', 'up', 'down'].forEach(move => {
        if (jsonData.anims[move] !== undefined) {
          const moveData = jsonData.anims[move]
          scene.anims.create({
            key: `${this._texture}_${move}`,
            frames: moveData.frames.map(name => ({
              key: this._texture,
              frame: name,
            })),
            repeat: moveData.repeat ? moveData.repeat : -1,
            duration: moveData.duration ? moveData.duration : 1500,
          })
        }
      })
      this.addListener('movementChange', movement => {
        this._setAnimation(movement)
      })
      if (scene.anims.exists(`${this._texture}_face`)) {
        this._object.play(`${this._texture}_face`)
      }
    }
  }

  _bindObject() {
    if (this._object !== null) {
      this._object.setData('declickObject', this)
    }
  }

  constructor(texture) {
    super()
    this._object = null
    this._texture = texture !== undefined ? texture : this.constructor._texture
    this._vX = DEFAULT_SPEED
    this._vY = DEFAULT_SPEED
    this._targetX = 0
    this._targetY = 0
    this._movement = 'stop'
    this._oldTargetDistance = 0
    this._buildObject()
    this._bindObject()
  }

  _setAnimation(movement) {
    let animation
    if (movement === 'target') {
      animation = this._targetX > this._object.x ? 'right' : 'left'
    } else {
      const animations = {
        stop: 'face',
        forward: 'right',
        backward: 'left',
        upward: 'face',
        downward: 'face',
      }
      animation = animations[movement]
    }
    if (
      this._graphics.getScene().anims.exists(`${this._texture}_${animation}`)
    ) {
      this._object.play(`${this._texture}_${animation}`, true)
    }
  }

  tick(delta) {
    if (this._movement === 'target') {
      const distance = this._distanceBetween(
        this._object.x,
        this._object.y,
        this._targetX,
        this._targetY,
      )
      if (distance < 4 || distance > this._oldTargetDistance) {
        this._object.body.reset(this._targetX, this._targetY)
        this._graphics.getScene().game.events.once('postrender', () => {
          this._setMovement('stop')
        })
      } else {
        this._oldTargetDistance = distance
      }
    }
  }

  destroy() {
    if (this._object !== null) {
      this._object.disableBody(true, true)
    }
    super.destroy()
  }

  _setMovement(newMovement) {
    const oldMovement = this._movement
    this._movement = newMovement
    if (newMovement !== oldMovement || newMovement === 'target') {
      this.dispatch('movementChange', newMovement)
    }
  }

  _initTargetMovement() {
    if (this._movement !== 'target') {
      this._targetX = this._object.x
      this._targetY = this._object.y
    }
  }

  _moveToTarget() {
    const physics = this._graphics.getScene().physics
    this._oldTargetDistance = this._distanceBetween(
      this._object.x,
      this._object.y,
      this._targetX,
      this._targetY,
    )
    physics.moveTo(
      this._object,
      this._targetX,
      this._targetY,
      Math.max(this._vX, this._vY),
    )
    this._setMovement('target')
  }

  _setVelocity(vx, vy) {
    this._object.setVelocityX(vx)
    this._object.setVelocityY(vy)
  }

  @Reflect.metadata('translated', i18n`moveForward`)
  @Reflect.metadata('help', i18n`moveForward_help`)
  @checkArguments(['integer'])
  moveForward(distance) {
    this._initTargetMovement()
    this._targetX += distance
    this._moveToTarget()
  }

  @Reflect.metadata('translated', i18n`moveBackward`)
  @Reflect.metadata('help', i18n`moveBackward_help`)
  @checkArguments(['integer'])
  moveBackward(distance) {
    this._initTargetMovement()
    this._targetX -= distance
    this._moveToTarget()
  }

  @Reflect.metadata('translated', i18n`moveUpward`)
  @Reflect.metadata('help', i18n`moveUpward_help`)
  @checkArguments(['integer'])
  moveUpward(distance) {
    this._initTargetMovement()
    this._targetY -= distance
    this._moveToTarget()
  }

  @Reflect.metadata('translated', i18n`moveDownward`)
  @Reflect.metadata('help', i18n`moveDownward_help`)
  @checkArguments(['integer'])
  moveDownward(distance) {
    this._initTargetMovement()
    this._targetY += distance
    this._moveToTarget()
  }

  @Reflect.metadata('translated', i18n`stop`)
  @Reflect.metadata('help', i18n`stop_help`)
  stop() {
    this._setVelocity(0, 0)
    this._setMovement('stop')
  }

  @Reflect.metadata('translated', i18n`moveAlwaysForward`)
  @Reflect.metadata('help', i18n`moveAlwaysForward_help`)
  moveAlwaysForward() {
    this._setVelocity(this._vX, 0)
    this._setMovement('forward')
  }

  @Reflect.metadata('translated', i18n`moveAlwaysBackward`)
  @Reflect.metadata('help', i18n`moveAlwaysBackward_help`)
  moveAlwaysBackward() {
    this._setVelocity(-this._vX, 0)
    this._setMovement('backward')
  }

  @Reflect.metadata('translated', i18n`moveAlwaysUpward`)
  @Reflect.metadata('help', i18n`moveAlwaysUpward_help`)
  moveAlwaysUpward() {
    this._setVelocity(0, -this._vY)
    this._setMovement('upward')
  }

  @Reflect.metadata('translated', i18n`moveAlwaysDownward`)
  @Reflect.metadata('help', i18n`moveAlwaysDownward_help`)
  moveAlwaysDownward() {
    this._setVelocity(0, this._vY)
    this._setMovement('downward')
  }

  @Reflect.metadata('translated', i18n`ifCollisionWith`)
  @Reflect.metadata('help', i18n`ifCollisionWith_help`)
  @checkArguments(['object', 'function', 'string'], 1)
  ifCollisionWith(object, command, optionalParameter) {
    //TODO: handle other types of command (programs, code)
    const callStatement = this._runtime.createCallStatement(command)
    object.addCollider(
      this._object,
      (me, who) => {
        this._runtime.executePriorityStatements(
          [callStatement],
          [me.getData('declickObject'), who.getData('declickObject')],
        )
      },
      optionalParameter,
    )
  }

  @Reflect.metadata('translated', i18n`addBLock`)
  @Reflect.metadata('help', i18n`addBlock_help`)
  @checkArguments(['object', 'string'], 1)
  addBlock(block, optionalParameter) {
    block.addCollider(this._object, undefined, optionalParameter)
  }

  @Reflect.metadata('translated', i18n`ifOverlapWith`)
  @Reflect.metadata('help', i18n`ifOverlapWith_help`)
  @checkArguments(['object', 'function', 'string'], 1)
  ifOverlapWith(object, command, optionalParameter) {
    //TODO: handle other types of command (programs, code)
    const callStatement = this._runtime.createCallStatement(command)
    object.addOverlap(
      this._object,
      (me, who) => {
        this._runtime.executePriorityStatements(
          [callStatement],
          [me.getData('declickObject'), who.getData('declickObject')],
        )
      },
      optionalParameter,
    )
  }

  @Reflect.metadata('translated', i18n`mayMove`)
  @Reflect.metadata('help', i18n`mayMove_help`)
  @checkArguments(['boolean', 1])
  mayMove(value = true) {
    this._object.setImmovable(!value)
  }

  setLocation(x, y) {
    super.setLocation(x, y)
    this._targetX = x
    this._targetY = y
    this._object.body.reset(x, y)
  }

  addCollider(object, handler) {
    this._graphics
      .getScene()
      .physics.add.collider(object, this._object, handler)
  }

  addOverlap(object, handler) {
    this._graphics.getScene().physics.add.overlap(object, this._object, handler)
  }

  _distanceBetween(x1, y1, x2, y2) {
    let dx = x1 - x2
    let dy = y1 - y2
    return Math.sqrt(dx * dx + dy * dy)
  }
}

export default Sprite
