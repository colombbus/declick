import * as Phaser from 'phaser'

let _scene = null
let _game = null
let _renderer = null
const _graphicalObjects = []
const _graphicalResources = []

let _preload = function() {
  _graphicalResources.forEach(resource => {
    this.load[resource.type](resoure.data);
  })
}

let _create = function() {
  _graphicalObjects.forEach(object => {
    object.addToScene(this);
  })
  _scene = this;
}

let _update = function(time, delta) {
  _graphicalObjects.forEach(object => {
    object.tick(delta)
  })
}

let _initialize = function(canvas, container) {
  _game = new Phaser.Game({
    type:Phaser.CANVAS,
    parent:container,
    canvas:canvas,
    scene: {
      key:'main',
      active:false,
      preload: _preload,
      create: _create,
      update: _update
    }
  })
}

export default {
  initialize(canvas, container) {
    _initialize(canvas, container)
  },
  resize() {
    _engine.resize()
  },
  addResource(type, resource) {
    _graphicalResources.push({type:type, data:resource})
    if (_scene !== null) {
      _scene.load[type](resource)
      _scene.load.start()
    }
  },
  addObject(object) {
    _graphicalObjects.push(object)
    if (_scene != null) {
      object.addToScene(_scene)
    }
  },
  removeObject(object) {
    _graphicalObjects.splice(_graphicalObjects.indexOf(object), 1)
    if (_scene != null) {
      object.destroy()
    }
  },
  getRenderer() {
    return _renderer
  },
  clear() {
    if (_scene) {
      _scene.scene.remove('main');
      _scene.scene.add('main', {
        active:false,
        preload: _preload,
        create: _create,
        update: _update
      })
    }
  },
  getRenderedImage() {
    return _engine.renderer.plugins.extract.image(_renderer)
  },
  getRenderedPixels() {
    return _engine.renderer.plugins.extract.pixels(_renderer)
  },
  getRenderedCanvas() {
    return _engine.renderer.plugins.extract.canvas(_renderer)
  },
  start() {
    if (_scene) {
      _scene.scene.start('main')
    }
  },
  stop() {
    if (_scene) {
      _scene.scene.stop('main')
    }
  }
}
