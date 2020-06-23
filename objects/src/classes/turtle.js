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
    this._renderer = this._graphics.getScene().add.graphics()
    this._renderer.lineStyle(1, 0x000000, 1.0)
  }

  @Reflect.metadata('translated', i18n`traceOn`)
  @Reflect.metadata('help', i18n`traceOn_help`)
  traceOn() {
    if (!this._trace) {
      this._previousX = this._object.x
      this._previousY = this._object.y
      this._trace = true
      this._renderer.beginPath()
      this._renderer.moveTo(
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
      this._renderer.moveTo(
        this._object.x - this._traceX + x,
        this._object.y - this._traceY + y,
      )
    }
    this._traceX = x
    this._traceY = y
  }

  tick(delta) {
    super.tick(delta)
    if (this._trace) {
      if (
        this._object.x !== this._previousX ||
        this._object.y !== this.previousY
      ) {
        this._renderer.lineTo(
          this._object.x + this._traceX,
          this._object.y + this._traceY,
        )
        this._renderer.strokePath()
      }
    }
  }

  _updateTrace(x, y) {
    this._renderer.moveTo(
      this._previousX + this._centerX,
      this._previousY + this._centerY,
    )
    this._renderer.lineStyle(1, 0x000000)
    this._renderer.lineTo(x + this._centerX, y + this._centerY)
    this._previousX = x
    this._previousY = y
  }
}

export default Turtle
