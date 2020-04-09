import * as Phaser from 'phaser'

let _scene = null
let _game = null
let _renderer = null
const _graphicalObjects = []
const _graphicalResources = new Map()

let _preload = function() {
  _graphicalResources.forEach((resource, key) => {
    this.load[resource.type](key, ...resource.data)
  })
}

let _create = function() {
  _graphicalObjects.forEach(object => {
    object.addToScene(this)
  })
  _scene = this
}

let _update = function(time, delta) {
  _graphicalObjects.forEach(object => {
    object.tick(delta)
  })
}

let _initializeScene = function() {
  _game.scene.add(
    'main',
    {
      key: 'main',
      active: false,
      preload: _preload,
      create: _create,
      update: _update,
    },
    false,
  )
}

let _initialize = function(canvas, callback, options) {
  let config = {
    type: Phaser.AUTO,
    canvas: canvas,
    scene: null,
    callbacks: {
      postBoot() {
        _initializeScene()
        if (callback) {
          callback()
        }
      },
    },
  }
  if (options) {
    config = Object.assign(config, options)
  }

  _game = new Phaser.Game(config)
}

export default {
  initialize(canvas, callback, options) {
    this.reset()
    _initialize(canvas, callback, options)
  },
  resize() {
    _engine.resize()
  },
  addResource(type, key, ...data) {
    if (_graphicalResources.has(key)) {
      const existingResource = _graphicalResources.get(key)
      if (
        type !== existingResource.type ||
        !data.every((value, index) => value === existingResource.data[index])
      ) {
        throw new Error(`existing resource: ${key}`)
      }
    }
    _graphicalResources.set(key, { type: type, data: data })
    if (_scene !== null) {
      _scene.load[type](key, ...data)
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
    object.destroy()
  },
  getController() {
    return _game
  },
  clear() {
    if (_game) {
      _game.scene.remove('main')
      _initializeScene()
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
    if (_game) {
      _game.scene.start('main')
    }
  },
  stop() {
    if (_game) {
      _game.scene.stop('main')
    }
  },
  reset() {
    _graphicalResources.clear()
    _graphicalObjects.length = 0
    if (_game) {
      _game.scene.remove('main')
      _game.destroy(false, false)
      _game = null
    }
    _scene = null
  },
}
