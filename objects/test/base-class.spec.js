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
    return import('../src/base-class').then(module => {
      const BaseClass = module.default
      let exposed = BaseClass.prototype.exposed
      assert.deepEqual(exposed['supprimer'], {
        method: 'delete',
        help: 'supprimer()',
      })
    })
  })

  it('should trigger a custom listener when set', () => {
    return import('../src/base-class').then(module => {
      const BaseClass = module.default
      const anObject = new BaseClass()
      let called = false
      anObject.addListener('customEvent', () => {
        called = true
      })
      anObject.dispatch('customEvent')
      assert.equal(called, true)
    })
  })

  it('should pass parameters to a listener', () => {
    return import('../src/base-class').then(module => {
      const BaseClass = module.default
      const anObject = new BaseClass()
      let receivedParameter1 = null
      let receivedParameter2 = null
      anObject.addListener('customEvent', (param1, param2) => {
        receivedParameter1 = param1
        receivedParameter2 = param2
      })
      anObject.dispatch('customEvent', 1234, 5678)
      assert.equal(receivedParameter1, 1234)
      assert.equal(receivedParameter2, 5678)
    })
  })

  it('should trigger a delete listener when deleted', () => {
    return import('../src/base-class').then(module => {
      const BaseClass = module.default
      const anObject = new BaseClass()
      let called = false
      anObject.addListener('delete', () => {
        called = true
      })
      anObject.delete()
      assert.equal(called, true)
    })
  })

  it('should not trigger a listener when removed', () => {
    return import('../src/base-class').then(module => {
      const BaseClass = module.default
      const anObject = new BaseClass()
      let called = false
      anObject.addListener('customEvent', () => {
        called = true
      })
      anObject.removeListener('customEvent')
      anObject.dispatch('customEvent')
      assert.equal(called, false)
    })
  })
})
