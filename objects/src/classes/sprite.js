import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import robotData from '../../resources/robot.json'
import robotTexture from '../../resources/robot.png'

@Reflect.metadata('translated', i18n`Sprite`)
class Sprite extends GraphicClass {
  static _texture = 'sprite_default_animation'
  static _loadingSprite = false
  static _whenLoaded = []

  /*_loadSpriteSheet(callback) {
    if (callback) {
      this.constructor._whenLoaded.push(callback)
    }
    if (!this.constructor._loadingSprite) {
      this.constructor._loadingSprite = true
      const loader = new PIXI.Loader()
      loader.add('robot', robotTexture)
      loader.load((loader, resources) => {
        this.constructor._spriteSheet = new PIXI.Spritesheet(
          resources.robot.texture,
          robotData,
        )
        this.constructor._loadingSprite = false
        this.constructor._spriteSheet.parse(() => {
          this.constructor._whenLoaded.forEach(callback => {
            callback.apply(this)
          })
        })
      })
    }
  }*/

  addToScene(scene) {
    this._object = scene.add.sprite(this._x, this._y, this._texture)
    this._object.animationSpeed = 0.1
    this._object.play()
    this.dispatch('objectReady')
  }

  constructor() {
    super()
    this._graphics.addLocalResource(
      'atlas',
      'sprite_default_animation',
      robotTexture,
      robotData,
    )
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
    this._graphics.start()
  }
}

export default Sprite
