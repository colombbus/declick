import BaseClass from './base-class'
import i18n from 'es2015-i18n-tag'
import 'reflect-metadata'
import { checkArguments } from './utils'

class GraphicClass extends BaseClass {
  constructor() {
    super()
    this._graphics = this.constructor._graphics
    this._object = null
    this._graphics.addObject(this)
    this.addListener('delete', () => {
      this._graphics.removeObject(this)
    })
  }

  static setRuntime(runtime) {
    super.setRuntime(runtime)
    this._graphics = this._runtime.getGraphics()
  }

  static setup() {
    // to be implemented by children classes
  }

  tick() {
    // do nothing
  }

  destroy() {
    if (this._object !== null) {
      this._object.destroy()
      this._object = null
    }
  }

  getGraphicalObject() {
    return this._object
  }

  @Reflect.metadata('translated', i18n`setLocation`)
  @Reflect.metadata('help', i18n`setLocation_help`)
  @checkArguments(['integer', 'integer'])
  setLocation(x, y) {
    // do nothing
  }
}

export default GraphicClass
