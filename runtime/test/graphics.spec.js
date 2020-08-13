/*eslint-env mocha */
import { assert } from 'chai'
import graphics from '../src/graphics'
import localMap from './map.json'

const localResource =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg=='

describe('When graphics is initialized', () => {
  before(() => {
    document.body.innerHTML = `<div id='container'></div>`
  })
  afterEach(() => {
    graphics.reset()
  })
  after(() => {
    window.close()
  })
  it('should have a scene named main', () => {
    return graphics
      .initialize(document.getElementById('container'), 'headless')
      .then(() => {
        const scenes = graphics.getController().scene.getScenes(false)
        assert.equal(scenes.length, 1)
        const scene = graphics.getController().scene.getScene('main')
        assert.isNotNull(scene)
      })
  })
  it('should not set scene active before start is called', () => {
    return graphics
      .initialize(document.getElementById('container'), 'headless')
      .then(() => {
        assert.equal(graphics.getController().scene.isActive('main'), false)
      })
  })
  it('should set scene active when start is called', () => {
    return graphics
      .initialize(document.getElementById('container'), 'headless')
      .then(() => {
        graphics.start()
        assert.equal(graphics.getController().scene.isActive('main'), true)
      })
  })
  it('should set scene inactive when stop is called', () => {
    return graphics
      .initialize(document.getElementById('container'), 'headless')
      .then(() => {
        graphics.start()
        graphics.stop()
        assert.equal(graphics.getController().scene.isActive('main'), false)
      })
  })
  it('should not load a resource before start', done => {
    graphics
      .initialize(document.getElementById('container'), 'headless')
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
      .initialize(document.getElementById('container'), 'headless')
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
      .initialize(document.getElementById('container'), 'headless')
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
      .initialize(document.getElementById('container'), 'headless')
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
      .initialize(document.getElementById('container'), 'headless')
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
  it('should call destroy on an object when removed', done => {
    const myObject = {
      destroy() {
        done()
      },
    }
    graphics
      .initialize(document.getElementById('container'), 'headless')
      .then(() => {
        graphics.addObject(myObject)
        return graphics.start()
      })
      .then(() => {
        graphics.removeObject(myObject)
      })
  })
  it('should be able to load a local image', () => {
    return graphics
      .initialize(document.getElementById('container'), 'headless')
      .then(() => {
        graphics.addLocalResource('image', 'anImage', localResource)
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
      .initialize(document.getElementById('container'), 'headless')
      .then(() => {
        graphics.addLocalResource('atlas', 'anAtlas', localResource, jsonData)
        return graphics.start()
      })
      .then(() => {
        try {
          graphics
            .getController()
            .scene.getScene('main')
            .add.sprite(10, 10, 'anAtlas')
          assert.isOk(true)
        } catch (e) {
          assert.fail(e)
        }
      })
  })
  it('should be able to load a local map', () => {
    return graphics
      .initialize(document.getElementById('container'), 'headless')
      .then(() => {
        graphics.addLocalResource('map', 'aMap', localMap)
        return graphics.start()
      })
      .then(() => {
        try {
          graphics
            .getController()
            .scene.getScene('main')
            .add.tilemap('aMap')
          assert.isOk(true)
        } catch (e) {
          assert.fail(e)
        }
      })
  })
  it('should not clear graphical resources when cleared', () => {
    return graphics
      .initialize(document.getElementById('container'), 'headless')
      .then(() => {
        graphics.addResource('image', 'anImage', `file://${__dirname}/dk.png`)
        return graphics.start()
      })
      .then(() => {
        graphics.clear()
        const test = graphics
          .getController()
          .scene.getScene('main')
          .textures.exists('anImage')
        assert.isTrue(test)
      })
  })
  it('should clear graphical resources when reset', () => {
    return graphics
      .initialize(document.getElementById('container'), 'headless')
      .then(() => {
        graphics.addResource('image', 'anImage', `file://${__dirname}/dk.png`)
        return graphics.start()
      })
      .then(() => {
        graphics.reset()
        const test = graphics
          .getController()
          .scene.getScene('main')
          .textures.exists('anImage')
        assert.isFalse(test)
      })
  })
  it('should not clear local graphical resources when cleared', () => {
    return graphics
      .initialize(document.getElementById('container'), 'headless')
      .then(() => {
        graphics.addLocalResource('image', 'anImage', localResource)
        return graphics.start()
      })
      .then(() => {
        graphics.clear()
        const test = graphics
          .getController()
          .scene.getScene('main')
          .textures.exists('anImage')
        assert.isTrue(test)
      })
  })
  it('should not clear local graphical resources when reset', () => {
    return graphics
      .initialize(document.getElementById('container'), 'headless')
      .then(() => {
        graphics.addLocalResource('image', 'anImage', localResource)
        return graphics.start()
      })
      .then(() => {
        graphics.reset()
        const test = graphics
          .getController()
          .scene.getScene('main')
          .textures.exists('anImage')
        assert.isTrue(test)
      })
  })
})
