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
      const isDynamic =
        (layer.dynamic !== undefined && layer.dynamic) ||
        (layer.properties !== undefined &&
          layer.properties.find(
            property =>
              (property.name === 'dynamic' ||
                property.name === i18n`dynamic`) &&
              property.value === true,
          ) !== undefined)
      if (isDynamic) {
        return this._object.createDynamicLayer(layer.name, tilesets)
      } else {
        return this._object.createStaticLayer(layer.name, tilesets)
      }
    })

    const ids = this._object.tilesets.reduce(
      (tileIds, tileset) => {
        for (
          let i = tileset.firstgid;
          i < tileset.firstgid + tileset.total;
          i++
        ) {
          const properties = tileset.getTileProperties(i)
          if (
            properties.collides === true ||
            properties[i18n`collides`] === true
          ) {
            tileIds[0].push(i)
          }
          if (
            properties.overlaps === true ||
            properties[i18n`overlaps`] === true
          ) {
            tileIds[1].push(i)
          }
        }
        return tileIds
      },
      [[], []],
    )

    this._collisionTileIds = ids[0]
    this._overlapTileIds = ids[1]

    const interactiveLayers = this._layers.reduce(
      (layers, layer) => {
        let collision = false
        let overlap = false
        const properties = layer.layer.properties
        properties.forEach(property => {
          if (
            property.name === 'collides' ||
            property.name === i18n`collides`
          ) {
            collision = property.value
          } else if (
            property.name === 'overlaps' ||
            property.name === i18n`overlaps`
          ) {
            overlap = property.value
          }
        })
        if (!collision) {
          if (
            layer.filterTiles(tile =>
              this._collisionTileIds.includes(tile.index),
            ).length > 0
          ) {
            collision = true
          }
        }
        if (!overlap) {
          if (
            layer.filterTiles(tile => this._overlapTileIds.includes(tile.index))
              .length > 0
          ) {
            overlap = true
          }
        }
        if (collision) {
          layers[0].push(layer)
        }
        if (overlap) {
          layers[1].push(layer)
        }
        return layers
      },
      [[], []],
    )

    this._collisionLayers = interactiveLayers[0]
    this._overlapLayers = interactiveLayers[1]

    this._collisionLayers.forEach(layer => {
      layer.setCollision(this._collisionTileIds)
    })
  }

  addCollider(object, handler) {
    const scene = this._graphics.getScene()
    let collisionHandler
    if (handler !== undefined) {
      collisionHandler = (me, tile) => {
        handler(me, new PlatformTile(tile))
      }
    }
    this._collisionLayers.forEach(layer => {
      scene.physics.add.collider(object, layer, collisionHandler)
    })
  }

  addOverlap(object, handler) {
    const scene = this._graphics.getScene()
    let overlapHandler
    if (handler !== undefined) {
      overlapHandler = (who, tile) => {
        handler(who, new PlatformTile(tile))
      }
    }
    this._overlapLayers.forEach(layer => {
      if (overlapHandler) {
        layer.setTileIndexCallback(this._overlapTileIds, overlapHandler, this)
      }
      scene.physics.add.overlap(object, layer)
    })
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
