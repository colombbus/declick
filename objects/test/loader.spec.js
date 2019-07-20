/*eslint-env mocha */
import { assert } from 'chai'
import { i18nConfig } from 'es2015-i18n-tag'

let loader
describe('When Loader is imported', () => {
  before(function() {
    global.__CLASSES__ = ['text.js']
    return import('../src/loader').then(lib => {
      loader = lib
    })
  })

  it('should load French translated classes', () => {
    return loader.load('fr').then(classes => {
      return import('../src/classes/text').then(({default:Text}) => {
        let textClassData = classes[0]
        assert.equal(textClassData.name, 'Texte')
        assert.deepEqual(textClassData.classPrototype, Text.prototype)
        assert.equal(textClassData.methods.get('définirTexte'), 'setText')
        assert.equal(textClassData.methods.get('supprimer'), 'delete')
      })
    })
  })
})
