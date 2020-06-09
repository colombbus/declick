import * as Phaser from 'phaser'

let _sceneActive = false
let _scene = null
let _game = null
const _graphicalObjects = []
const _graphicalResources = new Map()
const _loadingLocalResources = new Map()
const _whenLoadedActions = []

const _textureAdded = function(key) {
  if (_loadingLocalResources.has(key)) {
    const callback = _loadingLocalResources.get(key)
    if (callback) {
      callback()
    }
    _loadingLocalResources.delete(key)
    if (_loadingLocalResources.size === 0) {
      _scene.textures.off('addtexture', _textureAdded)
      _whenLoadedActions.forEach(action => action())
      _whenLoadedActions.length = 0
    }
  }
}

const _loadingLocalResource = function(key, callback) {
  if (_loadingLocalResources.size === 0) {
    _scene.textures.on('addtexture', _textureAdded)
  }
  _loadingLocalResources.set(key, callback)
}

const _loadLocalImage = function(key, data) {
  const imageData = data[0]
  const callback = data.length > 1 ? data[1] : false
  _loadingLocalResource(key, callback)
  _scene.textures.addBase64(key, imageData)
}

const _loadLocalAtlas = function(key, data) {
  const imageData = data[0]
  const jsonData = data[1]
  const callback = data.length > 2 ? data[2] : false
  _loadingLocalResource(key, callback)
  const atlasImage = new Image()
  atlasImage.onload = () => {
    _scene.textures.addAtlas(key, atlasImage, jsonData)
  }
  atlasImage.src = imageData
}

const _loadResource = function(key, type, data, local) {
  if (local) {
    switch (type) {
      case 'image':
        _loadLocalImage(key, data)
        break
      case 'atlas':
        _loadLocalAtlas(key, data)
        break
    }
  } else {
    _scene.load[type](key, ...data)
  }
}

const _whenLoaded = function(action) {
  if (_loadingLocalResources.size === 0) {
    action()
  } else {
    _whenLoadedActions.push(action)
  }
}

const _preload = function() {
  _sceneActive = true
  _graphicalResources.forEach((resource, key) => {
    _loadResource(key, resource.type, resource.data, resource.local)
  })
}

const _update = function(time, delta) {
  _graphicalObjects.forEach(object => {
    object.tick(delta)
  })
}

const _initializeScene = function() {
  _sceneActive = false
  _scene = _game.scene.add(
    'main',
    {
      active: false,
      preload: _preload,
      update: _update,
    },
    false,
  )
}

const _initialize = function(canvas, options) {
  return new Promise((resolve, reject) => {
    let config = {
      type: Phaser.CANVAS,
      customEnvironment: false,
      canvas: canvas,
      transparent: true,
      scene: null,
      scale: {
        expandParent: false,
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.Center.NO_CENTER,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      callbacks: {
        postBoot() {
          try {
            _initializeScene()
          } catch (e) {
            reject(e)
          }
          resolve()
        },
      },
    }
    if (options) {
      config = Object.assign(config, options)
    }
    try {
      _game = new Phaser.Game(config)
    } catch (e) {
      reject(e)
    }
  })
}

const _addResource = function(type, key, data, local) {
  if (_graphicalResources.has(key)) {
    const existingResource = _graphicalResources.get(key)
    if (
      type !== existingResource.type ||
      !data.every((value, index) => value === existingResource.data[index])
    ) {
      throw new Error(`existing resource: ${key}`)
    }
  }
  _graphicalResources.set(key, { type: type, local: local, data: data })
  if (_sceneActive) {
    _loadResource(key, type, data, local)
    _scene.load.start()
  }
}

export default {
  initialize(canvas, options) {
    this.reset()
    return _initialize(canvas, options)
  },
  addLocalResource(type, key, ...data) {
    _addResource(type, key, data, true)
  },
  addResource(type, key, ...data) {
    _addResource(type, key, data, false)
  },
  addObject(object) {
    _graphicalObjects.push(object)
  },
  removeObject(object) {
    _graphicalObjects.splice(_graphicalObjects.indexOf(object), 1)
    object.destroy()
  },
  getScene() {
    return _scene
  },
  getController() {
    return _game
  },
  clear() {
    if (_scene) {
      _scene.children.removeAll()
      const textures = _scene.textures
      _graphicalResources.forEach((resource, key) => {
        if (!resource.local) {
          textures.remove(key)
          _graphicalResources.delete(key)
        }
      })
      _graphicalObjects.length = 0
      _whenLoadedActions.length = 0
    }
  },
  getRenderedImage() {
    return null //_engine.renderer.plugins.extract.image(_renderer)
  },
  getRenderedPixels() {
    return null //_engine.renderer.plugins.extract.pixels(_renderer)
  },
  getRenderedCanvas() {
    return null //_engine.renderer.plugins.extract.canvas(_renderer)
  },
  start() {
    if (_game) {
      return new Promise((resolve, reject) => {
        _scene.events.once('create', () => {
          try {
            _whenLoaded(resolve)
          } catch (e) {
            reject(e)
          }
        })
        try {
          _game.scene.start('main')
        } catch (e) {
          reject(e)
        }
      })
    } else return Promise.reject('graphics not initialized')
  },
  stop() {
    if (_game) {
      _game.scene.stop('main')
    }
  },
  reset() {
    _graphicalResources.clear()
    _graphicalObjects.length = 0
    _loadingLocalResources.clear()
    _whenLoadedActions.length = 0
    if (_game) {
      _game.scene.remove('main')
      _game.destroy(false, false)
      _game = null
    }
    _sceneActive = false
    _scene = null
  },
}
