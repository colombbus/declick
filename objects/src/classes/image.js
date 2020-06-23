import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import imageTexture from '../../resources/star.png'

@Reflect.metadata('translated', i18n`Image`)
class Image extends GraphicClass {
  static _texture = 'image_default_texture'

  static setupDone = false

  static setup() {
    if (!this.setupDone) {
      super.setup()
      this._graphics.addLocalResource(
        'image',
        'image_default_texture',
        imageTexture,
      )
      this.setupDone = true
    }
  }

  constructor(texture) {
    super()
    this._texture = texture !== undefined ? texture : this.constructor._texture
    const scene = this._graphics.getScene()
    this._object = scene.add.image(0, 0, this._texture)
    this._object.setOrigin(0)
  }

  setLocation(x, y) {
    super.setLocation(x, y)
    this._object.setPosition(x, y)
  }
}

export default Image
