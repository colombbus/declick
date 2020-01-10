import * as PIXI from 'pixi.js'

let _engine = null
let _renderer = null
const _graphicalObjects = []

let _initialize = function(canvas, container) {
  _engine = new PIXI.Application({
    view: canvas,
    resizeTo: container,
    transparent: true,
  })
  _renderer = new PIXI.Graphics()
  _engine.stage.addChild(_renderer)
  _graphicalObjects.forEach(object => {
    _engine.stage.addChild(object)
  })
  _engine.ticker.add(delta => {
    _graphicalObjects.forEach(object => {
      object.tick(delta)
    })
  })
}

export default {
  initialize(canvas, container) {
    _initialize(canvas, container)
  },
  resize() {
    _engine.resize()
  },
  addObject(object) {
    _graphicalObjects.push(object)
    if (_engine != null) {
      _engine.stage.addChild(object._object)
    }
  },
  removeObject(object) {
    _graphicalObjects.splice(_graphicalObjects.indexOf(object), 1)
    if (_engine != null) {
      _engine.stage.removeChild(object._object)
    }
  },
  getRenderer() {
    return _renderer
  },
  clear() {
    _renderer.clear()
  },
}
