/*eslint-env mocha */
import { assert } from 'chai'
import { i18nConfig } from 'es2015-i18n-tag'
import frenchTranslations from '../../translations/translation.fr.json'
import 'reflect-metadata'

describe('When Text is instantiated', () => {
  it('should have an exposed name', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../../src/classes/text').then(({default: Text}) => {
      assert.equal(Reflect.getMetadata('translated', Text), 'Texte')
    })
  })

  it('should have an exposed setText method', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../../src/classes/text').then(({default: Text}) => {
      assert.equal(Reflect.getMetadata('translated', Text.prototype, 'setText'), 'définirTexte')
      assert.equal(Reflect.getMetadata('help', Text.prototype, 'setText'), 'définirTexte("texte")')
    })
  })

  it('should have an exposed delete method', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../../src/classes/text').then(({default: Text}) => {
      assert.equal(Reflect.getMetadata('translated', Text.prototype, 'delete'), 'supprimer')
      assert.equal(Reflect.getMetadata('help', Text.prototype, 'delete'), 'supprimer()')
    })
  })

  it('should trigger a custom listener when set with reference to instance', () => {
    return import('../../src/classes/text').then(({default: Text}) => {
      const anObject = new Text()
      let called = null
      anObject._addListener('customEvent', function() {
        called = this
      })
      anObject._dispatch('customEvent')
      assert.deepEqual(called, anObject)
    })
  })

  it('should pass parameters to a listener', () => {
    return import('../../src/classes/text').then(({default: Text}) => {
      const anObject = new Text()
      let receivedParameter1 = null
      let receivedParameter2 = null
      anObject._addListener('customEvent', (param1, param2) => {
        receivedParameter1 = param1
        receivedParameter2 = param2
      })
      anObject._dispatch('customEvent', 1234, 5678)
      assert.equal(receivedParameter1, 1234)
      assert.equal(receivedParameter2, 5678)
    })
  })

  it('should call runtime addOject method when instance is created', () => {
    return import('../../src/classes/text').then(({default: Text}) => {
      let called = null
      const fakeRuntime = {
        addObject(value) {
          called = value
        }
      }
      Text.setRuntime(fakeRuntime)
      const anObject = new Text()
      assert.deepEqual(called, anObject)
    })
  })

  it('should trigger a delete listener when instance is deleted', () => {
    return import('../../src/classes/text').then(({default: Text}) => {
      let called = null
      // required because of preceding tests (runtime is maintained through baseclass)
      Text.setRuntime(null)
      const anObject = new Text()
      anObject._addListener('delete', function() {
        called = this
      })
      anObject.delete()
      assert.deepEqual(called, anObject)
    })
  })

  it('should not trigger a listener when removed', () => {
    return import('../../src/classes/text').then(({default: Text}) => {
      const anObject = new Text()
      let called = false
      anObject._addListener('customEvent', () => {
        called = true
      })
      anObject._removeListener('customEvent')
      anObject._dispatch('customEvent', anObject)
      assert.equal(called, false)
    })
  })
})
