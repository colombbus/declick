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
  it('should have a scene named main', () => {
    return graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
        const scenes = graphics.getController().scene.getScenes(false)
        assert.equal(scenes.length, 1)
        const scene = graphics.getController().scene.getScene('main')
        assert.isNotNull(scene)
      })
  })
  it('should not set scene active before start is called', () => {
    return graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
        assert.equal(graphics.getController().scene.isActive('main'), false)
      })
  })
  it('should set scene active when start is called', () => {
    return graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
        graphics.start()
        assert.equal(graphics.getController().scene.isActive('main'), true)
      })
  })
  it('should set scene inactive when stop is called', () => {
    return graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
        graphics.start()
        graphics.stop()
        assert.equal(graphics.getController().scene.isActive('main'), false)
      })
  })
  it('should not load a resource before start', done => {
    graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
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
      })
  })
  it('should load a resource when started', done => {
    graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
        const loader = graphics.getController().scene.getScene('main').load
        loader.once('complete', () => {
          done()
        })
        graphics.addResource('image', 'anImage', `file://${__dirname}/dk.png`)
        graphics.start()
      })
  })
  it('should load a resource after start', done => {
    graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
        const loader = graphics.getController().scene.getScene('main').load
        loader.once('complete', () => {
          done()
        })
        return graphics.start()
      })
      .then(() => {
        graphics.addResource('image', 'anImage', `file://${__dirname}/dk.png`)
      })
  })
  it('should support loading a resource twice', done => {
    graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
        const loader = graphics.getController().scene.getScene('main').load
        loader.once('complete', () => {
          done()
        })
        graphics.addResource('image', 'anImage', `file://${__dirname}/dk.png`)
        graphics.addResource('image', 'anImage', `file://${__dirname}/dk.png`)
        graphics.start()
      })
  })
  it('should not load two different resources with same key', () => {
    return graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
        graphics.addResource('image', 'anImage', `file://${__dirname}/dk.png`)
        try {
          graphics.addResource(
            'image',
            'anImage',
            `file://${__dirname}/dk2.png`,
          )
          assert.fail('loaded two different resources with same key')
        } catch (e) {
          assert.equal(e.message, 'existing resource: anImage')
        }
      })
  })
  it('should not add an object when scene is not started', () => {
    let objectAdded = false
    const myObject = {
      addToScene() {
        objectAdded = true
      },
    }
    return graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
        graphics.addObject(myObject)
        assert.equal(objectAdded, false)
      })
  })
  it('should add an object to the scene when started', () => {
    let objectAdded = false
    let receivedScene = null
    const myObject = {
      addToScene(aScene) {
        objectAdded = true
        receivedScene = aScene
      },
    }
    return graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
        graphics.addObject(myObject)
        return graphics.start()
      })
      .then(() => {
        assert.equal(objectAdded, true)
        assert.equal(
          receivedScene,
          graphics.getController().scene.getScene('main'),
        )
      })
  })
  it('should not add a removed object to the scene when started', () => {
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
    return graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
        graphics.addObject(myObject)
        graphics.removeObject(myObject)
        return graphics.start()
      })
      .then(() => {
        assert.equal(objectAdded, false)
        assert.equal(destroyCalled, true)
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
    graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
        graphics.addObject(myObject)
        return graphics.start()
      })
      .then(() => {
        graphics.removeObject(myObject)
      })
  })
  it('should be able to load a local image', () => {
    const data =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg=='

    return graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
        graphics.addLocalResource('image', 'anImage', data)
        return graphics.start()
      })
      .then(() => {
        try {
          graphics
            .getController()
            .scene.getScene('main')
            .add.image(10, 10, 'anImage')
          assert.isOk(true)
        } catch (e) {
          assert.fail(e)
        }
      })
  })
  it('should be able to load a local atlas', () => {
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
      meta: {
        app: 'test',
        version: '1.0',
        image: 'test.png',
        format: 'RGBA8888',
        size: { w: 32, h: 32 },
        scale: '1',
      },
    }

    return graphics
      .initialize(document.getElementById('canvas'), {
        type: Phaser.HEADLESS,
      })
      .then(() => {
        graphics.addLocalResource('atlas', 'anAtlas', data, jsonData)
        return graphics.start()
      })
      .then(() => {
        try {
          graphics
            .getController()
            .scene.getScene('main')
            .add.sprite(10, 10, 'anImage')
          assert.isOk(true)
        } catch (e) {
          assert.fail(e)
        }
      })
  })
})
