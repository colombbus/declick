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
      const scenes = graphics.getController().scene.getScenes()
      assert.equal(scenes.length, 1)
      const scene = graphics.getController().scene.getScene('main')
      assert.isNotNull(scene)
      done()
    }
    graphics.initialize(document.getElementById('canvas'), whenReady,{type:Phaser.HEADLESS})
  })
})
