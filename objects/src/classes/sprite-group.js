import GraphicClass from '../graphic-class'
import SpriteGroupItem from './sprite-group-item'
import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'
import groupTexture from '../../resources/star.png'
import { checkArguments } from '../utils'

@Reflect.metadata('translated', i18n`SpriteGroup`)
class SpriteGroup extends GraphicClass {
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

  constructor(texture) {
    super()
    this._movable = true
    this._object = null
    this._texture = texture !== undefined ? texture : this.constructor._texture
    this._buildObject()
  }

  _buildObject() {
    const scene = this._graphics.getScene()
    this._object = scene.physics.add.group()
    this._object.setOrigin(0)
  }

  @Reflect.metadata('translated', i18n`createSprite`)
  @Reflect.metadata('help', i18n`createSprite_help`)
  @checkArguments(['integer', 'integer'], 2)
  createSprite(x = 0, y = 0) {
    const object = this._object.create(x, y, this._texture)
    object.setOrigin(0)
    object.setImmovable(!this._movable)
    const item = new SpriteGroupItem(object)
    return item
  }

  @Reflect.metadata('translated', i18n`mayMove`)
  @Reflect.metadata('help', i18n`mayMove_help`)
  @checkArguments(['boolean'], 1)
  mayMove(value = true) {
    this._movable = value
    this._object.getChildren().forEach(child => {
      child.mayMove(value)
    })
  }

  addCollider(object, handler) {
    this._graphics
      .getScene()
      .physics.add.collider(object, this._object, handler)
  }

  addOverlap(object, handler) {
    this._graphics.getScene().physics.add.overlap(object, this._object, handler)
  }
}

export default SpriteGroup
