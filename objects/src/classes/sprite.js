import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import * as PIXI from 'pixi.js'
import robotData from '../../resources/robot.json'
import robotTexture from '../../resources/robot.png'

@Reflect.metadata('translated', i18n`Sprite`)
class Sprite extends GraphicClass {
  static _spriteSheet = null

  // TODO: handle case where several sprites are created at the same time
  _loadSpriteSheet(callback) {
    const loader = PIXI.Loader.shared
    loader.add('robot', robotTexture)
    loader.load((loader, resources) => {
      this.constructor._spriteSheet = new PIXI.Spritesheet(
        resources.robot.texture,
        robotData,
      )
      this.constructor._spriteSheet.parse(() => {
        this._spriteSheet = this.constructor._spriteSheet
        if (callback) {
          callback.apply(this)
        }
      })
    })
  }

  _createObject() {
    this._object = new PIXI.AnimatedSprite(
      this._spriteSheet.animations['robot_face'],
    )
    this._object.animationSpeed = 0.1
    this._object.play()
    this.dispatch('objectReady')
  }

  constructor() {
    super()
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
      this._object.stop()
      this._object.textures = this._spriteSheet.animations[animation]
      this._object.play()
    })

    if (this.constructor._spriteSheet === null) {
      this._loadSpriteSheet(() => {
        this._createObject()
      })
    } else {
      this._createObject()
    }
  }
}

export default Sprite
