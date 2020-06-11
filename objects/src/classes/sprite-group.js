import Sprite from './sprite'
import SpriteGroupItem from './sprite-group-item'
import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'
import groupTexture from '../../resources/star.png'

@Reflect.metadata('translated', i18n`SpriteGroup`)
class SpriteGroup extends Sprite {
  static setupDone = false
  static _texture = 'group_default_texture'

  static setup() {
    if (!this.setupDone) {
      super.setup()
      this._graphics.addLocalResource(
        'image',
        'group_default_texture',
        groupTexture,
      )
      this.setupDone = true
    }
  }

  _buildObject() {
    const scene = this._graphics.getScene()
    this._object = scene.physics.add.group()
  }

  _bindObject() {
    // do nothing
  }

  @Reflect.metadata('translated', i18n`createSprite`)
  @Reflect.metadata('help', i18n`createSprite_help`)
  createSprite(x = 0, y = 0) {
    const object = this._object.create(x, y, this._texture)
    const item = new SpriteGroupItem(object)
    return item
  }
}

export default SpriteGroup
