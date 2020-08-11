import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import defaultMap from '../../resources/map.json'
import defaultMapTiles from '../../resources/tiles.png'
import PlatformTile from './platform-tile'
import { checkArguments } from '../utils'

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
    this._layers = mapData.data.layers.map(layer => {
      if (layer.dynamic !== undefined && layer.dynamic) {
        return this._object.createDynamicLayer(layer.name, tilesets)
      } else {
        return this._object.createStaticLayer(layer.name, tilesets)
      }
    })
    this._object.setCollisionByProperty({ collides: true })
  }

  addCollider(object, handler) {
    const scene = this._graphics.getScene()
    let collisionHandler
    if (handler !== undefined) {
      collisionHandler = (me, tile) => {
        handler(me, new PlatformTile(tile))
      }
    }
    this._layers.forEach(layer => {
      scene.physics.add.collider(object, layer, collisionHandler)
    })
  }

  addOverlap(object, handler) {
    //TODO: continue
    /*const scene = this._graphics.getScene()
    this._layers.forEach(layer => {
      scene.physics.add.overlap(object, layer, handler)
    })*/
  }

  @Reflect.metadata('translated', i18n`removeTile`)
  @Reflect.metadata('help', i18n`removeTile_help`)
  @checkArguments(['object'])
  removeTile(tile) {
    const tileLayer = tile.getLayer()
    const layer = this._layers.find(layer => layer === tileLayer)
    if (layer && layer.removeTileAt !== undefined) {
      layer.removeTileAt(tile.getX(), tile.getY())
    } else if (layer) {
      this.throwError(i18n`layer not dynamic`)
    } else {
      this.throwError(i18n`could not find tile`)
    }
  }
}

export default Platform
