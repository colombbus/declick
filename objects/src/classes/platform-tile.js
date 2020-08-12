import i18n from 'es2015-i18n-tag'
import BaseClass from '../base-class'
import 'reflect-metadata'
import { checkArguments } from '../utils'

@Reflect.metadata('translated', i18n`PlatformTile`)
class PlatformTile extends BaseClass {
  constructor(tile) {
    super()
    this._tile = tile
  }

  getData() {
    return this
  }

  getLayer() {
    return this._tile.tilemapLayer
  }

  getX() {
    return this._tile.x
  }

  getY() {
    return this._tile.y
  }

  @Reflect.metadata('translated', i18n`is`)
  @Reflect.metadata('help', i18n`is_help`)
  @checkArguments(['string'])
  is(value) {
    return (
      this._tile.properties.is === value ||
      this._tile.properties[i18n`is`] === value
    )
  }
}

export default PlatformTile
