import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import defaultMap from '../../resources/map.json'
import defaultMapTiles from '../../resources/tiles.png'

@Reflect.metadata('translated', i18n`Platform`)
class Platform extends GraphicClass {
  static _map = 'platform_default_map'

  static setupDone = false

  static setup() {
    if (!this.setupDone) {
      super.setup()
      this._graphics.addLocalResource('map', 'platform_default_map', defaultMap)
      this._graphics.addLocalResource(
        'image',
        'platform_default_tiles',
        defaultMapTiles,
      )
      this.setupDone = true
    }
  }

  constructor(map) {
    super()
    this._map = map !== undefined ? map : this.constructor._map
    const scene = this._graphics.getScene()
    this._object = scene.add.tilemap(this._map)
    const tileset = this._object.addTilesetImage(
      'default-tiles',
      'platform_default_tiles',
    )
    this._object.createDynamicLayer('layer1', tileset)
  }
}

export default Platform
