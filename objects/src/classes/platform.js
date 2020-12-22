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
      return this._object.createLayer(layer.name, tilesets)
    })

    this._tilesProperties = this._object.tilesets.reduce(
      (properties, tileset) => {
        for (
          let i = tileset.firstgid;
          i < tileset.firstgid + tileset.total;
          i++
        ) {
          properties.set(i, tileset.getTileProperties(i))
        }
        return properties
      },
      new Map(),
    )

    this._collisionTileIds = [...this._tilesProperties]
      .filter(
        ([index, properties]) =>
          properties.collides === true || properties[i18n`collides`] === true,
      )
      .map(([index, properties]) => index)

    this._overlapTileIds = [...this._tilesProperties]
      .filter(
        ([index, properties]) =>
          properties.overlaps === true || properties[i18n`overlaps`] === true,
      )
      .map(([index, properties]) => index)

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
  }

  addCollider(object, handler, tileType) {
    const scene = this._graphics.getScene()
    let collisionHandler
    if (handler !== undefined) {
      collisionHandler = (me, tile) => {
        handler(me, new PlatformTile(tile))
      }
    }

    let tileIds = this._collisionTileIds
    if (tileType !== undefined) {
      tileIds = [...this._tilesProperties]
        .filter(
          ([index, properties]) =>
            properties.is === tileType || properties[i18n`is`] === tileType,
        )
        .map(([index, properties]) => index)
    }

    this._collisionLayers.forEach(layer => {
      layer.setCollision(tileIds)
      scene.physics.add.collider(object, layer, collisionHandler)
    })
  }

  addOverlap(object, handler, tileType) {
    const scene = this._graphics.getScene()
    let overlapHandler
    if (handler !== undefined) {
      overlapHandler = (who, tile) => {
        handler(who, new PlatformTile(tile))
      }
    }
    let tileIds = this._overlapTileIds
    if (tileType !== undefined) {
      tileIds = [...this._tilesProperties]
        .filter(
          ([index, properties]) =>
            properties.is === tileType || properties[i18n`is`] === tileType,
        )
        .map(([index, properties]) => index)
    }
    this._overlapLayers.forEach(layer => {
      if (overlapHandler) {
        layer.setTileIndexCallback(tileIds, overlapHandler, this)
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

  @Reflect.metadata('translated', i18n`selectLayer`)
  @Reflect.metadata('help', i18n`selectLayer_help`)
  @checkArguments(['string'])
  selectLayer(name) {
    const index = this._object.getLayerIndexByName(name)
    if (index === null) {
      this.throwError(i18n`could not find layer ${name}`)
    }
    this._object.setLayer(index)
  }

  @Reflect.metadata('translated', i18n`putTile`)
  @Reflect.metadata('help', i18n`putTile_help`)
  @checkArguments(['string', 'integer', 'integer'])
  putTile(type, x, y) {
    const layer = this._object.getLayer().tilemapLayer
    if (layer.putTileAt === undefined) {
      this.throwError(i18n`layer not dynamic`)
    }
    const tile = [...this._tilesProperties].find(
      ([index, properties]) =>
        properties.is === type || properties[i18n`is`] === type,
    )
    if (tile === undefined) {
      this.throwError(i18n`could not find tile ${type}`)
    }
    layer.putTileAt(tile[0], x, y)
  }

  @Reflect.metadata('translated', i18n`getTileAt`)
  @Reflect.metadata('help', i18n`getTileAt_help`)
  @checkArguments(['integer', 'integer'])
  getTileAt(x, y) {
    const layer = this._object.getLayer().tilemapLayer
    return new PlatformTile(layer.getTileAt(x, y, true))
  }
}

export default Platform
