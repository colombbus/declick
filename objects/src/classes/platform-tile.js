import i18n from 'es2015-i18n-tag'
import BaseClass from '../base-class'
import 'reflect-metadata'

@Reflect.metadata('translated', i18n`PlatformTile`)
class PlatformTile extends BaseClass {
  constructor(tile) {
    super()
    this._tile = tile
  }

  getData() {
    return this
  }
}

export default PlatformTile
