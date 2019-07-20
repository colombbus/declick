/*eslint-env mocha */
import { assert } from 'chai'
import { i18nConfig } from 'es2015-i18n-tag'
let loader
describe('When Loader is importer', () => {
  before(function() {
    global.__CLASSES__ = ['text.js']
    return import('../src/loader').then(lib => {
      loader = lib
    })
  })

  it('should load French translated classes', () => {
    return loader.load('fr').then(classes => {
      let textClass = classes[0]
      assert.equal(Reflect.getMetadata('translated', textClass), 'Texte')
      assert.equal(Reflect.getMetadata('translated', textClass.prototype, 'setText'), 'définirTexte')
      assert.equal(Reflect.getMetadata('help', textClass.prototype, 'setText'), 'définirTexte("texte")')
    })
  })
})
