/*eslint-env mocha */
import { assert } from 'chai'
import graphics from '../src/graphics'

describe('When graphics is initialized', () => {
  before(() => {
    document.body.innerHTML = `<div id='container'><canvas id='canvas'></canvas></div>`
  })
  afterEach(() => {
    graphics.reset()
  })
  after(() => {
    window.close()
  })
  it('should have a scene named main', done => {
    function whenReady() {
      const scenes = graphics.getController().scene.getScenes(false)
      assert.equal(scenes.length, 1)
      const scene = graphics.getController().scene.getScene('main')
      assert.isNotNull(scene)
      done()
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
  it('should not set scene active before start is called', done => {
    function whenReady() {
      assert.equal(graphics.getController().scene.isActive('main'), false)
      done()
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
  it('should set scene active when start is called', done => {
    function whenReady() {
      graphics.start()
      assert.equal(graphics.getController().scene.isActive('main'), true)
      done()
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
  it('should set scene inactive when stop is called', done => {
    function whenReady() {
      graphics.start()
      graphics.stop()
      assert.equal(graphics.getController().scene.isActive('main'), false)
      done()
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
  it('should not load a resource before start', done => {
    function whenReady() {
      const loader = graphics.getController().scene.getScene('main').load
      let loadStart = false
      loader.once('start', () => {
        loadStart = true
      })
      graphics.addResource('image', 'anImage', `file://${__dirname}/dk.png`)
      window.setTimeout(() => {
        assert.equal(loadStart, false)
        done()
      }, 500)
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
  it('should load a resource when started', done => {
    function whenReady() {
      const loader = graphics.getController().scene.getScene('main').load
      loader.once('complete', () => {
        done()
      })
      graphics.addResource('image', 'anImage', `file://${__dirname}/dk.png`)
      graphics.start()
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
  it('should load a resource after start', done => {
    function whenCreated() {
      graphics.addResource('image', 'anImage', `file://${__dirname}/dk.png`)
    }
    function whenReady() {
      const loader = graphics.getController().scene.getScene('main').load
      loader.once('complete', () => {
        done()
      })
      graphics.start(whenCreated)
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
  it('should support loading a resource twice', done => {
    function whenReady() {
      const loader = graphics.getController().scene.getScene('main').load
      loader.once('complete', () => {
        done()
      })
      graphics.addResource('image', 'anImage', `file://${__dirname}/dk.png`)
      graphics.addResource('image', 'anImage', `file://${__dirname}/dk.png`)
      graphics.start()
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
  it('should not load two different resources with same key', done => {
    function whenReady() {
      graphics.addResource('image', 'anImage', `file://${__dirname}/dk.png`)
      try {
        graphics.addResource('image', 'anImage', `file://${__dirname}/dk2.png`)
      } catch (e) {
        assert.equal(e.message, 'existing resource: anImage')
        done()
      }
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
  it('should not add an object when scene is not started', done => {
    let objectAdded = false
    const myObject = {
      addToScene(aScene) {
        objectAdded = true
      },
    }
    function whenReady() {
      graphics.addObject(myObject)
      assert.equal(objectAdded, false)
      done()
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
  it('should add an object to the scene when started', done => {
    let objectAdded = false
    let receivedScene = null
    const myObject = {
      addToScene(aScene) {
        objectAdded = true
        receivedScene = aScene
      },
    }
    function whenCreated() {
      assert.equal(objectAdded, true)
      assert.equal(
        receivedScene,
        graphics.getController().scene.getScene('main'),
      )
      done()
    }
    function whenReady() {
      graphics.addObject(myObject)
      graphics.start(whenCreated)
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
  it('should not add a removed object to the scene when started', done => {
    let objectAdded = false
    let destroyCalled = false
    const myObject = {
      addToScene() {
        objectAdded = true
      },
      destroy() {
        destroyCalled = true
      },
    }
    function whenCreated() {
      assert.equal(objectAdded, false)
      assert.equal(destroyCalled, true)
      done()
    }
    function whenReady() {
      graphics.addObject(myObject)
      graphics.removeObject(myObject)
      graphics.start(whenCreated)
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
  it('should call destroy on an object when removed', done => {
    let objectAdded = false
    const myObject = {
      addToScene() {
        objectAdded = true
      },
      destroy() {
        assert.equal(objectAdded, true)
        done()
      },
    }
    function removeObject() {
      graphics.removeObject(myObject)
    }

    function whenReady() {
      graphics.addObject(myObject)
      graphics.start(removeObject)
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
  it('should be able to load a local image', done => {
    const data =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg=='

    function whenCreated() {
      graphics
        .getController()
        .scene.getScene('main')
        .add.image(10, 10, 'anImage')
      done()
    }
    function whenReady() {
      graphics.addLocalResource('image', 'anImage', data)
      graphics.start(whenCreated)
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
  it('should be able to load a local atlas', done => {
    const data =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg=='
    const jsonData = {
      frames: {
        frame_1: {
          frame: { x: 0, y: 0, w: 16, h: 16 },
          rotated: false,
          trimmed: false,
          spriteSourceSize: { x: 0, y: 0, w: 16, h: 16 },
          sourceSize: { w: 16, h: 16 },
          anchor: { x: 0, y: 0 },
        },
        frame_2: {
          frame: { x: 16, y: 0, w: 16, h: 16 },
          rotated: false,
          trimmed: false,
          spriteSourceSize: { x: 0, y: 0, w: 16, h: 16 },
          sourceSize: { w: 16, h: 16 },
          anchor: { x: 0, y: 0 },
        },
        frame_3: {
          frame: { x: 0, y: 16, w: 16, h: 16 },
          rotated: false,
          trimmed: false,
          spriteSourceSize: { x: 0, y: 0, w: 16, h: 16 },
          sourceSize: { w: 16, h: 16 },
          anchor: { x: 0, y: 0 },
        },
        frame_4: {
          frame: { x: 16, y: 16, w: 16, h: 16 },
          rotated: false,
          trimmed: false,
          spriteSourceSize: { x: 0, y: 0, w: 16, h: 16 },
          sourceSize: { w: 16, h: 16 },
          anchor: { x: 0, y: 0 },
        },
      },
      animations: {
        face: ['frame_1', 'frame_2', 'frame_3', 'frame_4'],
      },
      meta: {
        app: 'test',
        version: '1.0',
        image: 'test.png',
        format: 'RGBA8888',
        size: { w: 32, h: 32 },
        scale: '1',
      },
    }

    function whenCreated() {
      graphics
        .getController()
        .scene.getScene('main')
        .add.sprite(10, 10, 'anImage')
      done()
    }
    function whenReady() {
      graphics.addLocalResource('atlas', 'anAtlas', data, jsonData)
      graphics.start(whenCreated)
    }
    graphics.initialize(document.getElementById('canvas'), whenReady, {
      type: Phaser.HEADLESS,
    })
  })
})
