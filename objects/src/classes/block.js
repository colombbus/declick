import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import blockTexture from '../../resources/brick.png'

@Reflect.metadata('translated', i18n`Block`)
class Block extends GraphicClass {
  static _texture = 'block_default_texture'

  static setupDone = false

  static setup() {
    if (!this.setupDone) {
      super.setup()
      this._graphics.addLocalResource(
        'image',
        'block_default_texture',
        blockTexture,
      )
      this.setupDone = true
    }
  }

  constructor() {
    super()
    this._texture = this.constructor._texture
    const scene = this._graphics.getScene()
    this._object = scene.physics.add.staticImage(
      this._x,
      this._y,
      this._texture,
    )
    this._object.setOrigin(0)
    //this._object.setImmovable()
  }

  setLocation(x, y) {
    super.setLocation(x, y)
    this._object.body.reset(x, y)
  }
}

export default Block
