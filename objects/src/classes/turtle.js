import Robot from './robot'
import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'

@Reflect.metadata('translated', i18n`Turtle`)
class Turtle extends Robot {
  constructor() {
    super()
    this._trace = false
    this._previousX = 0
    this._previousY = 0
    this._renderer = this._graphics.getRenderer()
  }
  _onReady() {
    this._centerX = Math.round(this._object.width / 2)
    this._centerY = Math.round(this._object.height / 2)
    super._onReady()
  }

  @Reflect.metadata('translated', i18n`traceOn`)
  traceOn() {
    this._whenReady(() => {
      if (!this._trace) {
        this._previousX = this._x
        this._previousY = this._y
        this.addListener('move', this._updateTrace)
        this._trace = true
      }
    })
  }

  @Reflect.metadata('translated', i18n`traceOff`)
  traceOff() {
    this._whenReady(() => {
      if (this._trace) {
        this.removeListener('move', this._updateTrace)
        this._trace = false
      }
    })
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
