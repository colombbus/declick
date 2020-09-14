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
    _scene.cache.json.add(key, jsonData)
    _scene.textures.addAtlas(key, atlasImage, jsonData)
  }
  atlasImage.src = imageData
}

const _loadLocalMap = function(key, data) {
  const jsonData = data[0]
  const callback = data.length > 1 ? data[1] : false
  _scene.cache.tilemap.add(key, {
    format: Phaser.Tilemaps.Formats.TILED_JSON,
    data: jsonData,
  })
  if (callback) {
    callback()
  }
}

const _loadResource = function(key, type, data, local) {
  if (local) {
    if (!_scene.textures.exists(key)) {
      switch (type) {
        case 'image':
          _loadLocalImage(key, data)
          break
        case 'atlas':
          _loadLocalAtlas(key, data)
          break
        case 'map':
          _loadLocalMap(key, data)
          break
      }
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

const _initialize = function(container, displayType = false) {
  let type
  switch (displayType) {
    case 'canvas':
      type = Phaser.CANVAS
      break
    case 'headless':
      type = Phaser.HEADLESS
      break
    default:
      type = Phaser.AUTO
      break
  }
  return new Promise((resolve, reject) => {
    let config = {
      type: type,
      customEnvironment: false,
      transparent: true,
      scene: null,
      scale: {
        parent: container,
        expandParent: false,
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.Center.NO_CENTER,
        width: '100%',
        height: '100%',
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
  initialize(container, displayType) {
    _sceneActive = false
    _scene = null
    _game = null
    _graphicalObjects.length = 0
    _whenLoadedActions.length = 0
    _graphicalResources.clear()
    _loadingLocalResources.clear()
    return _initialize(container, displayType)
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
      _graphicalObjects.length = 0
      _whenLoadedActions.length = 0
    }
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
    _graphicalObjects.length = 0
    _whenLoadedActions.length = 0
    if (_scene) {
      _game.scene.stop('main')
      _scene.children.getChildren().forEach(object => object.destroy()) //removeAll()
      const textures = _scene.textures
      _graphicalResources.forEach((resource, key) => {
        if (!resource.local) {
          if (textures.exists(key)) {
            textures.remove(key)
          }
          if (resource.type === 'atlas') {
            if (_scene.cache.json.exists(key)) {
              _scene.cache.json.remove(key)
            }
          }
          _graphicalResources.delete(key)
        }
      })
      _sceneActive = false
      _game.anims.anims.values().forEach(animation => {
        animation.destroy()
      })
    }
  },
}
