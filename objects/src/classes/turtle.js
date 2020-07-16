import Robot from './robot'
import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'

@Reflect.metadata('translated', i18n`Turtle`)
class Turtle extends Robot {
  constructor(texture) {
    super(texture)
    this._trace = false
    this._previousX = 0
    this._previousY = 0
    this._traceX = 0
    this._traceY = 0
    this._xMin = 100000
    this._xMax = -100000
    this._yMin = 100000
    this._yMax = -100000
  }

  _buildObject() {
    this._renderer = this._graphics.getScene().add.graphics()
    this._renderer.lineStyle(1, 0x000000, 1.0)
    this._renderer.translateCanvas(0.5, 0.5)
    super._buildObject()
  }

  @Reflect.metadata('translated', i18n`traceOn`)
  @Reflect.metadata('help', i18n`traceOn_help`)
  traceOn() {
    if (!this._trace) {
      this._previousX = this._object.x
      this._previousY = this._object.y
      this._trace = true
      this._renderer.moveTo(
        this._object.x + this._traceX,
        this._object.y + this._traceY,
      )
      this._renderer.beginPath()
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
      this._renderer.moveTo(
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
    graphics.translateCanvas(-this._xMin, -this._yMin)
    graphics.commandBuffer = graphics.commandBuffer.concat(
      this._renderer.commandBuffer,
    )
    const width = this._xMax - this._xMin + 1
    const height = this._yMax - this._yMin + 1
    graphics.generateTexture(name, width, height)
    graphics.destroy()
  }

  tick(delta) {
    super.tick(delta)
    if (this._trace) {
      if (
        this._object.x !== this._previousX ||
        this._object.y !== this._previousY
      ) {
        const newX = this._object.x + this._traceX
        const newY = this._object.y + this._traceY
        this._renderer.lineTo(newX, newY)
        this._renderer.strokePath()
        this._xMin = Math.min(this._xMin, newX)
        this._xMax = Math.max(this._xMax, newX)
        this._yMin = Math.min(this._yMin, newY)
        this._yMax = Math.max(this._yMax, newY)
        this._previousX = this._object.x
        this._previousY = this._object.y
      }
    }
  }
}

export default Turtle
