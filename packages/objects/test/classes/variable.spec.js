/*eslint-env mocha */
import { assert } from 'chai'
import { i18nConfig } from 'es2015-i18n-tag'
import frenchTranslations from '../../translations/translation.fr.json'
import 'reflect-metadata'

describe('When Variable is instantiated', () => {
  it('should have an exposed name', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../../src/classes/variable').then(({default: Variable}) => {
      assert.equal(Reflect.getMetadata('translated', Variable), 'Variable')
    })
  })

  it('should have an exposed setText method', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../../src/classes/variable').then(({default: Variable}) => {
      assert.equal(Reflect.getMetadata('translated', Variable.prototype, 'setText'), 'définirTexte')
      assert.equal(Reflect.getMetadata('help', Variable.prototype, 'setText'), 'définirTexte("texte")')
    })
  })

  it('should have an exposed delete method', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../../src/classes/variable').then(({default: Variable}) => {
      assert.equal(Reflect.getMetadata('translated', Variable.prototype, 'delete'), 'supprimer')
      assert.equal(Reflect.getMetadata('help', Variable.prototype, 'delete'), 'supprimer()')
    })
  })

  it('should trigger a custom listener when set with reference to instance', () => {
    return import('../../src/classes/variable').then(({default: Variable}) => {
      const anObject = new Variable()
      let called = null
      anObject.addListener('customEvent', function() {
        called = this
      })
      anObject.dispatch('customEvent')
      assert.deepEqual(called, anObject)
    })
  })

  it('should pass parameters to a listener', () => {
    return import('../../src/classes/variable').then(({default: Variable}) => {
      const anObject = new Variable()
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

  it('should call runtime addOject method when instance is created', () => {
    return import('../../src/classes/variable').then(({default: Variable}) => {
      let called = null
      const fakeRuntime = {
        addObject(value) {
          called = value
        }
      }
      Variable.setRuntime(fakeRuntime)
      const anObject = new Variable()
      assert.deepEqual(called, anObject)
    })
  })

  it('should trigger a delete listener when instance is deleted', () => {
    return import('../../src/classes/variable').then(({default: Variable}) => {
      let called = null
      // required because of preceding tests (runtime is maintained through baseclass)
      Variable.setRuntime(null)
      const anObject = new Variable()
      anObject.addListener('delete', function() {
        called = this
      })
      anObject.delete()
      assert.deepEqual(called, anObject)
    })
  })

  it('should not trigger a listener when removed', () => {
    return import('../../src/classes/variable').then(({default: Variable}) => {
      const anObject = new Variable()
      let called = false
      anObject.addListener('customEvent', () => {
        called = true
      })
      anObject.removeListener('customEvent')
      anObject.dispatch('customEvent', anObject)
      assert.equal(called, false)
    })
  })
})
