import Robot from './robot'
import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'
import Phaser from 'Phaser'

@Reflect.metadata('translated', i18n`Turtle`)
class Turtle extends Robot {
  constructor(texture) {
    super(texture)
    this._trace = false
    this._previousX = 0
    this._previousY = 0
    this._traceX = 0
    this._traceY = 0
  }

  _buildObject() {
    this._path = new Phaser.Curves.Path()
    this._renderer = this._graphics.getScene().add.graphics()
    super._buildObject()
  }

  @Reflect.metadata('translated', i18n`traceOn`)
  @Reflect.metadata('help', i18n`traceOn_help`)
  traceOn() {
    if (!this._trace) {
      this._previousX = this._object.x
      this._previousY = this._object.y
      this._trace = true
      this._path.moveTo(
        this._object.x + this._traceX,
        this._object.y + this._traceY,
      )
    }
  }

  @Reflect.metadata('translated', i18n`traceOff`)
  @Reflect.metadata('help', i18n`traceOff_help`)
  traceOff() {
    if (this._trace) {
      this._trace = false
    }
  }

  @Reflect.metadata('translated', i18n`setTracerLocation`)
  @Reflect.metadata('help', i18n`setTracerLocation_help`)
  setTracerLocation(x, y) {
    if (this.trace) {
      this._path.moveTo(
        this._object.x - this._traceX + x,
        this._object.y - this._traceY + y,
      )
    }
    this._traceX = x
    this._traceY = y
  }

  @Reflect.metadata('translated', i18n`createTexture`)
  @Reflect.metadata('help', i18n`createTexture_help`)
  createTexture(name) {
    const graphics = this._graphics
      .getScene()
      .make.graphics({ x: 0, y: 0, add: false })
    const bounds = this._path.getBounds()
    graphics.lineStyle(1, 0x000000, 1.0)
    graphics.translateCanvas(-bounds.x + 1, -bounds.y + 1)
    this._path.draw(graphics)
    graphics.generateTexture(name, bounds.width + 2, bounds.height + 2)
    graphics.destroy()
  }

  tick(delta) {
    super.tick(delta)
    if (this._trace) {
      if (
        this._object.x !== this._previousX ||
        this._object.y !== this.previousY
      ) {
        this._path.lineTo(
          this._object.x + this._traceX,
          this._object.y + this._traceY,
        )
        this._renderer.clear()
        this._renderer.lineStyle(1, 0x000000, 1.0)
        this._path.draw(this._renderer)
      }
    }
  }
}

export default Turtle
