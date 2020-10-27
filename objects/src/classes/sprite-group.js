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

  constructor(texture, length) {
    super()
    if (arguments.length === 1 && Number.isInteger(arguments[0])) {
      length = arguments[0]
      texture = undefined
    }
    this._movable = true
    this._object = null
    this._livingTime = false
    this._texture = texture !== undefined ? texture : this.constructor._texture
    this._buildObject(length)
    this._size = false
  }

  _buildObject(length) {
    const scene = this._graphics.getScene()
    this._object = scene.physics.add.group()
    this._object.setOrigin(0)
    if (length !== undefined) {
      this._poolMode = true
      this._object.createMultiple({
        key: this._texture,
        quantity: length,
        visible: false,
        active: false,
      })
    } else {
      this._poolMode = false
    }
  }

  @Reflect.metadata('translated', i18n`createSprite`)
  @Reflect.metadata('help', i18n`createSprite_help`)
  @checkArguments(['integer', 'integer'], 2)
  createSprite(x = 0, y = 0) {
    let object
    if (this._poolMode) {
      object = this._object.getFirstDead(false, x, y)
      if (object) {
        object.setActive(true)
        object.setVisible(true)
      }
    } else {
      object = this._object.create(x, y, this._texture)
    }
    if (object) {
      object.setOrigin(0)
      object.setImmovable(!this._movable)
      if (this._size !== false) {
        object.setDisplaySize(this._size[0], this._size[1])
      }
      return new SpriteGroupItem(object, this._poolMode, this._livingTime)
    }
    return false
  }

  @Reflect.metadata('translated', i18n`mayMove`)
  @Reflect.metadata('help', i18n`mayMove_help`)
  @checkArguments(['boolean'], 1)
  mayMove(value = true) {
    this._movable = value
    this._object.getChildren().forEach(child => {
      child.setImmovable(!value)
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

  @Reflect.metadata('translated', i18n`setLivingTime`)
  @Reflect.metadata('help', i18n`setLivingTime_help`)
  @checkArguments(['integer'])
  setLivingTime(time) {
    this._livingTime = time
    this._object.getChildren().forEach(child => {
      if (child.getData && child.getData('declickObject')) {
        child.getData('declickObject').expiresIn(time)
      }
    })
  }

  @Reflect.metadata('translated', i18n`setDisplaySize`)
  @Reflect.metadata('help', i18n`setDisplaySize_help`)
  @checkArguments(['integer', 'integer'])
  setDisplaySize(width, height) {
    this._size = [width, height]
    this._object.getChildren().forEach(child => {
      child.setDisplaySize(width, height)
    })
  }
}

export default SpriteGroup
