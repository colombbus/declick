import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'

import wall from '../../resources/wall.png'
import brick from '../../resources/brick.png'
import entrance from '../../resources/entrance.png'
import exit from '../../resources/exit.png'

import Block from './block'
@Reflect.metadata('translated', i18n`Platform`)
class Platform extends GraphicClass {
  platforms = []
  ress = ['', wall, brick, entrance, exit]
  coords = { x: 0, y: 0 }
  matrix = []
  countTiles = [0]
  builded = false

  constructor(structure = null) {
    super()
    if (structure !== null) {
      this.loadStructure(structure)
    }
  }

  @Reflect.metadata('translated', i18n`addRow`)
  @Reflect.metadata('help', i18n`addRow_help`)
  addRow(ligne) {
    this.matrix.push(ligne)
  }

  @Reflect.metadata('translated', i18n`addColumn`)
  @Reflect.metadata('help', i18n`addColumn_help`)
  addColumn(tile = 0) {
    for (let row in this.matrix) {
      this.matrix[row].push(tile)
    }
  }

  @Reflect.metadata('translated', i18n`setTile`)
  @Reflect.metadata('help', i18n`setTile_help`)
  setTile(block, x = this.coords.x, y = this.coords.y) {
    return new Block(x, y, this.ress[block])
  }

  @Reflect.metadata('translated', i18n`build`)
  @Reflect.metadata('help', i18n`build_help`)
  build() {
    this.builded = true
    this.draw()
  }

  @Reflect.metadata('translated', i18n`getStructure`)
  @Reflect.metadata('help', i18n`getStructure_help`)
  getStructure() {
    return this.matrix
  }

  @Reflect.metadata('translated', i18n`loadStructure`)
  @Reflect.metadata('help', i18n`loadStructure_help`)
  loadStructure(structure) {
    this.matrix = structure
  }

  @Reflect.metadata('translated', i18n`getTileCount`)
  @Reflect.metadata('help', i18n`getTileCount_help`)
  getTileCount(tile) {
    if (typeof this.countTiles[tile] !== 'undefined') {
      return this.countTiles.filter(a => a == tile).length
    }
  }

  @Reflect.metadata('translated', i18n`compareStructure`)
  @Reflect.metadata('help', i18n`compareStructure_help`)
  compareStructure(comparison) {
    let a = comparison
    let b = this.matrix
    if (a.length !== b.length) {
      return false
    }
    for (let y = 0; y < a.length; y++) {
      let ya = a[y]
      let yb = b[y]
      if (ya.length !== yb.length) {
        return false
      }
      for (let x = 0; x < ya.length; x++) {
        let xa = ya[x]
        let xb = yb[x]
        if (xa !== xb) {
          return false
        }
      }
    }
    return true
  }

  @Reflect.metadata('translated', i18n`removeTile`)
  @Reflect.metadata('help', i18n`removeTile_help`)
  removeTile(x, y) {
    x = parseInt(x)
    y = parseInt(y)
    if (!this.builded) {
      this.matrix[x][y] = 0
    } else {
      this._graphics.removeObject(this.platforms[x][y])
    }
  }

  draw() {
    for (let row in this.matrix) {
      // this.draw()
      let ligneStore = []
      for (let block in this.matrix[row]) {
        if (this.matrix[row][block] !== 0) {
          ligneStore[block] = this.setTile(this.matrix[row][block])
        }
        this.countTiles.push(this.matrix[row][block])
        this.coords.x += 40
      }
      this.coords.y += 40
      this.coords.x = 0
      this.platforms.push(ligneStore)
    }
    this.coords.y = 0
    this.coords.x = 0
  }
}

export default Platform
