import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import * as PIXI from 'pixi.js'

@Reflect.metadata('translated', i18n`Block`)
class Block extends GraphicClass {
  constructor(x, y, block) {
    super()
    let texture = new PIXI.Texture.from(block)
    this._object = new PIXI.TilingSprite(texture, 40, 40)
    this._object.anchor.set(0)
    this._object.x = x
    this._object.y = y

    this.dispatch('objectReady')
  }
}

export default Block
