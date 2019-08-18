import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import * as PIXI from 'pixi.js'
import textureData from '../../resources/baseTexture.json'
import textureTexture from '../../resources/baseTexture.png'
import Block from './block'

import wall from '../../resources/wall.png'
import brick from '../../resources/brick.png'
import entrance from '../../resources/entrance.png'
import exit from '../../resources/exit.png'

@Reflect.metadata('translated', i18n`Platform`)
class Platform extends GraphicClass {
  platforms = []
  ress = ['', wall, brick, entrance, exit]
  coords = { x: 0, y: 0 }
  matrix = []

  constructor(structure = null) {
    super()
    if (structure !== null) {
      this.matrix = structure
      this.createMatrix(structure)
    }
  }

  @Reflect.metadata('translated', i18n`createMatrix`)
  createMatrix(matrix) {
    // create block is WORK for one block ...
    for (let row in matrix) {
      this.addLigne(matrix[row])
    }
  }

  @Reflect.metadata('translated', i18n`addLigne`)
  addLigne(ligne) {
    let ligneStore = []
    this.matrix.push(ligne)

    for (let block in ligne) {
      ligneStore[block] =
        ligne[block] !== 0 ? this.createBlock(ligne[block]) : null

      this.coords.x += 40
    }
    this.coords.y += 40
    this.coords.x = 0
    this.platforms.push(ligneStore)
  }

  @Reflect.metadata('translated', i18n`createBlock`)
  createBlock(block) {
    return new Block(this.coords.x, this.coords.y, this.ress[block])
  }
}

export default Platform
