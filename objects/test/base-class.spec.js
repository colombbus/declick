/*eslint-env mocha */
import { assert } from 'chai'
import { i18nConfig } from 'es2015-i18n-tag'
import frenchTranslations from '../translations/translation.fr.json'

describe('When BaseClass is instantiated', () => {
  it('should have an exposed delete method', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../src/base-class').then(({default: BaseClass}) => {
      assert.equal(Reflect.getMetadata('translated', BaseClass.prototype, 'delete'), 'supprimer')
      assert.equal(Reflect.getMetadata('help', BaseClass.prototype, 'delete'), 'supprimer()')
    })
  })

  it('should trigger a custom listener when set with reference to instance', () => {
    return import('../src/base-class').then(module => {
      const BaseClass = module.default
      const anObject = new BaseClass()
      let called = null
      BaseClass.addListener('customEvent', function() {
        called = this
      })
      BaseClass.dispatch('customEvent', anObject)
      assert.deepEqual(called, anObject)
    })
  })

  it('should pass parameters to a listener', () => {
    return import('../src/base-class').then(module => {
      const BaseClass = module.default
      const anObject = new BaseClass()
      let receivedParameter1 = null
      let receivedParameter2 = null
      BaseClass.addListener('customEvent', (param1, param2) => {
        receivedParameter1 = param1
        receivedParameter2 = param2
      })
      BaseClass.dispatch('customEvent', anObject, 1234, 5678)
      assert.equal(receivedParameter1, 1234)
      assert.equal(receivedParameter2, 5678)
    })
  })

  it('should trigger a create listener when instance is created', () => {
    return import('../src/base-class').then(module => {
      const BaseClass = module.default
      let called = null
      BaseClass.addListener('create', function() {
        called = this
      })
      const anObject = new BaseClass()
      assert.deepEqual(called, anObject)
    })
  })

  it('should trigger a delete listener when instance is deleted', () => {
    return import('../src/base-class').then(module => {
      const BaseClass = module.default
      const anObject = new BaseClass()
      let called = null
      BaseClass.addListener('delete', function() {
        called = this
      })
      anObject.delete()
      assert.deepEqual(called, anObject)
    })
  })

  it('should not trigger a listener when removed', () => {
    return import('../src/base-class').then(module => {
      const BaseClass = module.default
      const anObject = new BaseClass()
      let called = false
      BaseClass.addListener('customEvent', () => {
        called = true
      })
      BaseClass.removeListener('customEvent')
      BaseClass.dispatch('customEvent', anObject)
      assert.equal(called, false)
    })
  })
})
