/*eslint-env mocha */
import { assert } from 'chai'
import graphics from '../src/graphics'

describe('When graphics is initialized', () => {
  after(() => {
    graphics.getController().destroy(false, true)
    window.close()
  })
  it('should have a scene named main', (done) => {
    document.body.innerHTML = `<div id='container'><canvas id='canvas'></canvas></div>`
    function whenReady() {
      const scenes = graphics.getController().scene.getScenes(false)
      assert.equal(scenes.length, 1)
      const scene = graphics.getController().scene.getScene('main')
      assert.isNotNull(scene)
      done()
    }
    graphics.initialize(document.getElementById('canvas'), whenReady,{type:Phaser.HEADLESS})
  })
  it('should not set scene active before start is called', (done) => {
    document.body.innerHTML = `<div id='container'><canvas id='canvas'></canvas></div>`
    function whenReady() {
      assert.equal(graphics.getController().scene.isActive('main'), false)
      done()
    }
    graphics.initialize(document.getElementById('canvas'), whenReady,{type:Phaser.HEADLESS})
  })
  it('should set scene active when start is called', (done) => {
    document.body.innerHTML = `<div id='container'><canvas id='canvas'></canvas></div>`
    function whenReady() {
      graphics.start()
      assert.equal(graphics.getController().scene.isActive('main'), true)
      done()
    }
    graphics.initialize(document.getElementById('canvas'), whenReady,{type:Phaser.HEADLESS})
  })
  it('should set scene inactive when stop is called', (done) => {
    document.body.innerHTML = `<div id='container'><canvas id='canvas'></canvas></div>`
    function whenReady() {
      graphics.start()
      graphics.stop()
      assert.equal(graphics.getController().scene.isActive('main'), false)
      done()
    }
    graphics.initialize(document.getElementById('canvas'), whenReady,{type:Phaser.HEADLESS})
  })
  it('should not load a resource before start', (done) => {
    document.body.innerHTML = `<div id='container'><canvas id='canvas'></canvas></div>`
    function whenReady() {
      const loader = graphics.getController().scene.getScene('main').load;
      let loadStart = false;
      loader.once('start', () => {
        loadStart = true;
      });
      graphics.addResource('image', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==')
      window.setTimeout(()=> {
        assert.equal(loadStart, false)
        done()
      }, 500)
    }
    graphics.initialize(document.getElementById('canvas'), whenReady,{type:Phaser.HEADLESS})
  })
  it.only('should load a resource after start', (done) => {
    document.body.innerHTML = `<div id='container'><canvas id='canvas'></canvas></div>`
    function whenReady() {
      const loader = graphics.getController().scene.getScene('main').load;
      let loadStart = false;
      loader.once('start', () => {
        loadStart = true;
      });
      graphics.addResource('image', `file://${__dirname}/dk`)
      graphics.start()
      window.setTimeout(()=> {
        assert.equal(loadStart, true)
        done()
      }, 500)
    }
    graphics.initialize(document.getElementById('canvas'), whenReady,{type:Phaser.HEADLESS})
  })

})
