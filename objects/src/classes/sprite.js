import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import robotData from '../../resources/robot.json'
import robotTexture from '../../resources/robot.png'

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

  constructor() {
    super()
    this._texture = this.constructor._texture
    this.addListener('movementChange', () => {
      let animation
      if (this._movement === 'target') {
        animation = this._targetX > this._x ? 'robot_right' : 'robot_left'
      } else {
        const animations = {
          stop: 'robot_face',
          forward: 'robot_right',
          backward: 'robot_left',
          upward: 'robot_face',
          downward: 'robot_face',
        }
        animation = animations[this._movement]
      }
      this._object.play(animation)
    })
    const scene = this._graphics.getScene()
    this._object = scene.physics.add.sprite(this._x, this._y, 'bidule')
    this._object.setOrigin(0)
    scene.anims.create({
      key: 'robot_face',
      frames: scene.anims.generateFrameNames(this._texture, {
        prefix: 'robot_face_',
        suffix: '.png',
        start: 1,
        end: 6,
      }),
      repeat: -1,
      duration: 1500,
    })
    scene.anims.create({
      key: 'robot_right',
      frames: scene.anims.generateFrameNames(this._texture, {
        prefix: 'robot_right_',
        suffix: '.png',
        start: 1,
        end: 4,
      }),
      repeat: -1,
      duration: 1500,
    })
    scene.anims.create({
      key: 'robot_left',
      frames: scene.anims.generateFrameNames(this._texture, {
        prefix: 'robot_left_',
        suffix: '.png',
        start: 1,
        end: 4,
      }),
      repeat: -1,
      duration: 1500,
    })

    this._object.play('robot_face')
  }
}

export default Sprite
