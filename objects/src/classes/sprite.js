import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import robotData from '../../resources/robot.json'
import robotTexture from '../../resources/robot.png'

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
    this._object = scene.physics.add.sprite(this._x, this._y, this._texture)
    this._object.setOrigin(0)
    if (scene.textures.get(this._texture).has('face_1.png')) {
      scene.anims.create({
        key: 'face',
        frames: scene.anims.generateFrameNames(this._texture, {
          prefix: 'face_',
          suffix: '.png',
          start: 1,
          end: 6,
        }),
        repeat: -1,
        duration: 1500,
      })
      scene.anims.create({
        key: 'right',
        frames: scene.anims.generateFrameNames(this._texture, {
          prefix: 'right_',
          suffix: '.png',
          start: 1,
          end: 4,
        }),
        repeat: -1,
        duration: 1500,
      })
      scene.anims.create({
        key: 'left',
        frames: scene.anims.generateFrameNames(this._texture, {
          prefix: 'left_',
          suffix: '.png',
          start: 1,
          end: 4,
        }),
        repeat: -1,
        duration: 1500,
      })
      this.addListener('movementChange', movement => {
        this._setAnimation(movement)
      })
      this._object.play('face')
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
    this._updateVelocity = false
    this.addListener('movementChange', movement => {
      this._updateVelocity = true
    })
    this._buildObject()
    this._bindObject()
  }

  _setAnimation(movement) {
    let animation
    if (movement === 'target') {
      animation = this._targetX > this._object.x ? 'robot_right' : 'robot_left'
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
    this._object.play(animation)
  }

  _setVelocity(movement) {
    const vX = this._vX
    const vY = this._vY
    const _this = this
    const computeVelocity = {
      stop: function() {
        _this._object.setVelocityX(0)
        _this._object.setVelocityY(0)
      },
      forward: function() {
        _this._object.setVelocityX(vX)
        _this._object.setVelocityY(0)
      },
      backward: function() {
        _this._object.setVelocityX(-vX)
        _this._object.setVelocityY(0)
      },
      upward: function() {
        _this._object.setVelocityX(0)
        _this._object.setVelocityY(-vY)
      },
      downward: function() {
        _this._object.setVelocityX(0)
        _this._object.setVelocityY(vY)
      },
    }
    computeVelocity[movement]()
    this._updateVelocity = false
  }

  tick(delta) {
    if (this._movement === 'target') {
      const x = this._object.x
      const y = this._object.y
      const targetX = this._targetX
      const targetY = this._targetY
      const vX = this._vX
      const vY = this._vY
      const d = this._distanceBetween(x, y, targetX, targetY)
      this._object.setVelocityX(0)
      this._object.setVelocityY(0)
      if (d < 4) {
        this._object.body.reset(targetX, targetY)
        this._setMovement('stop')
      } else {
        if (this._targetX > x) {
          this._object.setVelocityX(vX)
        } else if (this._targetX < x) {
          this._object.setVelocityX(-vX)
        }
        if (this._targetY > y) {
          this._object.setVelocityY(vY)
        } else if (this._targetY < y) {
          this._object.setVelocityY(-vY)
        }
      }
    } else if (this._updateVelocity) {
      this._setVelocity(this._movement)
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
    if (this._movement !== 'stop' && this._movement !== 'target') {
      this._targetX = this._object.x
      this._targetY = this._object.y
    }
  }

  @Reflect.metadata('translated', i18n`moveForward`)
  @Reflect.metadata('help', i18n`moveForward_help`)
  moveForward(distance) {
    this._initTargetMovement()
    this._targetX = this._object.x + distance
    this._setMovement('target')
  }

  @Reflect.metadata('translated', i18n`moveBackward`)
  @Reflect.metadata('help', i18n`moveBackward_help`)
  moveBackward(distance) {
    this._initTargetMovement()
    this._targetX = this._object.x - distance
    this._setMovement('target')
  }

  @Reflect.metadata('translated', i18n`moveUpward`)
  @Reflect.metadata('help', i18n`moveUpward_help`)
  moveUpward(distance) {
    this._initTargetMovement()
    this._targetY = this._object.y - distance
    this._setMovement('target')
  }

  @Reflect.metadata('translated', i18n`moveDownward`)
  @Reflect.metadata('help', i18n`moveDownward_help`)
  moveDownward(distance) {
    this._initTargetMovement()
    this._targetY = this._object.y + distance
    this._setMovement('target')
  }

  @Reflect.metadata('translated', i18n`stop`)
  @Reflect.metadata('help', i18n`stop_help`)
  stop() {
    this._setMovement('stop')
    this._targetX = this._object.x
    this._targetY = this._object.y
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

  @Reflect.metadata('translated', i18n`ifCollisionWith`)
  @Reflect.metadata('help', i18n`ifCollisionWith_help`)
  ifCollisionWith(object, command) {
    //TODO: handle other types of command (programs, code)
    const callStatement = this._runtime.createCallStatement(command)
    this._graphics
      .getScene()
      .physics.add.collider(
        this._object,
        object.getGraphicalObject(),
        (me, who) => {
          this._runtime.executePriorityStatements(
            [callStatement],
            [me.getData('declickObject'), who.getData('declickObject')],
          )
        },
      )
  }

  @Reflect.metadata('translated', i18n`ifOverlapWith`)
  @Reflect.metadata('help', i18n`ifOverlapWith_help`)
  ifOverlapWith(object, command) {
    //TODO: handle other types of command (programs, code)
    const callStatement = this._runtime.createCallStatement(command)
    this._graphics
      .getScene()
      .physics.add.overlap(
        this._object,
        object.getGraphicalObject(),
        (me, who) => {
          this._runtime.executePriorityStatements(
            [callStatement],
            [me.getData('declickObject'), who.getData('declickObject')],
          )
        },
      )
  }

  @Reflect.metadata('translated', i18n`mayMove`)
  @Reflect.metadata('help', i18n`mayMove_help`)
  mayMove(value = true) {
    this._object.setImmovable(!value)
  }

  setLocation(x, y) {
    super.setLocation(x, y)
    this._targetX = x
    this._targetY = y
    this._object.body.reset(x, y)
  }

  _distanceBetween(x1, y1, x2, y2) {
    let dx = x1 - x2
    let dy = y1 - y2
    return Math.sqrt(dx * dx + dy * dy)
  }
}

export default Sprite
