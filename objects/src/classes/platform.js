import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import defaultMap from '../../resources/map.json'
import defaultMapTiles from '../../resources/tiles.png'

@Reflect.metadata('translated', i18n`Platform`)
class Platform extends GraphicClass {
  static _map = 'platform_default_map'
  static _tiles = 'platform_default_tiles'

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

  constructor(map, tiles) {
    super()
    this._map = map !== undefined ? map : this.constructor._map
    this._tiles = tiles !== undefined ? tiles : this.constructor._tiles
    const scene = this._graphics.getScene()
    this._object = scene.add.tilemap(this._map)
    const mapData = scene.cache.tilemap.get(this._map)
    const tilesets = mapData.data.tilesets.map(tileset =>
      this._object.addTilesetImage(tileset.name, this._tiles),
    )
    mapData.data.layers.forEach(layer => {
      if (layer.dynamic !== undefined && layer.dynamic) {
        this._object.createDynamicLayer(layer.name, tilesets)
      } else {
        this._object.createStaticLayer(layer.name, tilesets)
      }
    })
  }
}

export default Platform
