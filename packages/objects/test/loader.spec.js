/*eslint-env mocha */
import { assert } from 'chai'
import { i18nConfig } from 'es2015-i18n-tag'

let loader
describe('When Loader is imported', () => {
  before(function() {
    global.__CLASSES__ = ['variable.js']
    global.__INSTANCES__ = ['declick.js']
    return import('../src/loader').then(lib => {
      loader = lib
    })
  })

  it('should load French translated classes', () => {
    return loader.load('fr').then(objects => {
      return import('../src/classes/variable').then(({default:Variable}) => {
        let variableClassData = objects.find(item => !(item.instance))
        assert.equal(variableClassData.name, 'Variable')
        assert.deepEqual(variableClassData.object, Variable)
        assert.equal(variableClassData.methods.get('définirTexte'), 'setText')
        assert.equal(variableClassData.methods.get('supprimer'), 'delete')
        assert.equal(variableClassData.object.prototype._declickId_, 'classes/variable')
      })
    })
  })

  it('should load French translated instances', () => {
    return loader.load('fr').then(objects => {
      return import('../src/instances/declick').then(({default:DeclickClass}) => {
        let declickData = objects.find(item => item.instance)
        assert.equal(declickData.name, 'declick')
        assert.deepEqual(declickData.object, DeclickClass)
        assert.equal(declickData.methods.get('écrire'), 'write')
        assert.equal(declickData.methods.get('initialiser'), 'clear')
        assert.equal(declickData.object.prototype._declickId_, 'instances/declick')
      })
    })
  })

})
