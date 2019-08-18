import i18n from 'es2015-i18n-tag'
import GraphicClass from '../graphic-class'
import 'reflect-metadata'
import * as PIXI from 'pixi.js'
import robotData from '../../resources/robot.json'
import robotTexture from '../../resources/robot.png'

@Reflect.metadata('translated', i18n`Sprite`)
class Sprite extends GraphicClass {
  constructor() {
    super()
    let texture = new PIXI.BaseTexture(robotTexture)
    this._spriteSheet = new PIXI.Spritesheet(texture, robotData)
    this._spriteSheet.parse(() => {
      this._object = new PIXI.AnimatedSprite(
        this._spriteSheet.animations['robot_face'],
      )
      this._object.animationSpeed = 0.1
      this._object.play()
      this.addListener('movementChange', () => {
        let animation
        if (this._movement === 'target') {
          animation = this._targetX > this._x ? 'robot_right' : 'robot_left'
        } else {
          const animations = {
            stop: 'robot_face',
            forward: 'robot_right',
            backward: 'robot_left',
            upward: 'robot_face',
            downward: 'robot_face',
          }
          animation = animations[this._movement]
        }
        this._object.stop()
        this._object.textures = this._spriteSheet.animations[animation]
        this._object.play()
      })
      this.dispatch('objectReady')
    })
  }

  @Reflect.metadata('translated', i18n`colide`)
  colide(platforms) {
    this.platforms = platforms.platforms
    this.colapse = true
    for (let i = 0; i < this.platforms.length; i++) {
      for (let x = 0; x < this.platforms[i].length; x++) {
        console.log('platform', this.platforms[i][x])
      }
    }
    // for (let ligne in this.platforms) {
    //   for (let block in this.platforms[ligne]) {
    //     console.log(this.platforms)
    //     console.log(this.platforms[0])
    //     console.log(this.platforms[0][0])
    //     // console.log(this.platforms[0])

    //     // if (this._object.containsPoint(this.platforms[platform[block]])){
    //     //   this._move.stop()
    //     // }
    //   }
    // }
    // console.log(this, platforms)
  }
}

export default Sprite
