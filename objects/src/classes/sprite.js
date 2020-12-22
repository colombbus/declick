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
    const jsonData = scene.cache.json.get(`${this._texture}_anims`)
    if (jsonData !== undefined) {
      Object.keys(jsonData).forEach(anim => {
        if (jsonData[anim] !== undefined) {
          const moveData = jsonData[anim]
          const key = `${this._texture}_${anim}`
          if (!scene.anims.exists(key)) {
            scene.anims.create({
              key: key,
              frames: moveData.frames.map(name => ({
                key: this._texture,
                frame: name,
              })),
              repeat: moveData.repeat ? moveData.repeat : -1,
              duration: moveData.duration ? moveData.duration : 1500,
            })
          }
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
      this._object.on(
        'destroy',
        () => {
          if (!this._isDeleting) {
            this.delete()
          }
        },
        this,
      )
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
    this._state = null
    this._buildObject()
    this._bindObject()
    this._isDeleting = false
    this.addListener('delete', () => {
      this._isDeleting = true
    })
    this.addListener('stop', () => {
      this.stop()
    })
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
    const anims = this._graphics.getScene().anims
    let animName
    if (
      this._state !== null &&
      anims.exists(`${this._texture}_${this._state}_${animation}`)
    ) {
      animName = `${this._texture}_${this._state}_${animation}`
    } else if (anims.exists(`${this._texture}_${animation}`)) {
      animName = `${this._texture}_${animation}`
    }
    if (animName) {
      this._object.anims.chain()
      this._object.anims.chain(animName)
      if (this._object.anims.getName() === animName) {
        this._object.anims.stopOnFrame(
          this._object.anims.currentAnim.getFrameAt(0),
        )
      } else {
        this._object.anims.stopAfterDelay(100)
      }
    }
  }

  tick(delta) {
    if (this._movement === 'target') {
      const vector = this._vectorBetween(
        this._object.x,
        this._object.y,
        this._targetX,
        this._targetY,
      )
      const distance = this._squaredLength(vector)
      if (distance < 16 || this._dot(vector, this._oldTargetVector) < 0) {
        this._object.body.reset(this._targetX, this._targetY)
        this._graphics.getScene().game.events.once('postrender', () => {
          this._setMovement('stop')
        })
      } else if (this._object.body.velocity.lengthSq() < 0.01) {
        this._object.body.setVelocity(0, 0)
        this._graphics.getScene().game.events.once('postrender', () => {
          this._setMovement('stop')
        })
      } else {
        this._oldTargetVector = vector
      }
    }
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
    this._oldTargetVector = this._vectorBetween(
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
    this._object.body.setVelocity(vx, vy)
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
  @checkArguments(['boolean'], 1)
  mayMove(value = true) {
    this._object.setImmovable(!value)
  }

  setLocation(x, y) {
    super.setLocation(x, y)
    this._targetX = x
    this._targetY = y
    this._object.body.reset(x, y)
  }

  getX() {
    return Math.round(this._object.x)
  }

  getY() {
    return Math.round(this._object.y)
  }

  @Reflect.metadata('translated', i18n`isMovingForward`)
  @Reflect.metadata('help', i18n`isMovingForward_help`)
  isMovingForward() {
    return (
      this._movement === 'forward' ||
      (this._movement === 'target' && this._targetX > this._object.body.x)
    )
  }

  @Reflect.metadata('translated', i18n`isMovingBackward`)
  @Reflect.metadata('help', i18n`isMovingBackward_help`)
  isMovingBackward() {
    return (
      this._movement === 'backward' ||
      (this._movement === 'target' && this._targetX < this._object.body.x)
    )
  }

  @Reflect.metadata('translated', i18n`isMovingUpward`)
  @Reflect.metadata('help', i18n`isMovingUpward_help`)
  isMovingUpward() {
    return (
      this._movement === 'upward' ||
      (this._movement === 'target' && this._targetY < this._object.body.y)
    )
  }

  @Reflect.metadata('translated', i18n`isMovingDownward`)
  @Reflect.metadata('help', i18n`isMovingDownward_help`)
  isMovingDownward() {
    return (
      this._movement === 'downward' ||
      (this._movement === 'target' && this._targetY > this._object.body.y)
    )
  }

  addCollider(object, handler) {
    this._graphics
      .getScene()
      .physics.add.collider(object, this._object, handler)
  }

  addOverlap(object, handler) {
    this._graphics.getScene().physics.add.overlap(object, this._object, handler)
  }

  _vectorBetween(x1, y1, x2, y2) {
    return [x1 - x2, y1 - y2]
  }

  _squaredLength(vector) {
    const [x, y] = vector
    return x * x + y * y
  }

  _dot(vector1, vector2) {
    const [x1, y1] = vector1
    const [x2, y2] = vector2
    return x1 * x2 + y1 * y2
  }

  @Reflect.metadata('translated', i18n`setVelocity`)
  @Reflect.metadata('help', i18n`setVelocity_help`)
  @checkArguments(['integer'])
  setVelocity(value) {
    this._vX = value
    this._vY = value
  }

  @Reflect.metadata('translated', i18n`setDisplaySize`)
  @Reflect.metadata('help', i18n`setDisplaySize_help`)
  @checkArguments(['integer', 'integer'])
  setDisplaySize(width, height) {
    this._object.setDisplaySize(width, height)
  }

  @Reflect.metadata('translated', i18n`setBodySize`)
  @Reflect.metadata('help', i18n`setBodySize_help`)
  @checkArguments(['integer', 'integer'])
  setBodySize(width, height) {
    this._object.setBodySize(width, height)
  }

  @Reflect.metadata('translated', i18n`setState`)
  @Reflect.metadata('help', i18n`setState_help`)
  @checkArguments(['string'], 1)
  setState(state = null) {
    this._state = state
    this._setAnimation(this._movement)
  }
}

export default Sprite
