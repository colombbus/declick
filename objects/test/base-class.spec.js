/*eslint-env mocha */
import { assert } from 'chai'
import { i18nConfig } from 'es2015-i18n-tag'
import frenchTranslations from '../translations/translation.fr.json'
import 'reflect-metadata'

describe('When BaseClass is instantiated', () => {
  it('should have an exposed delete method', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../src/base-class').then(({ default: BaseClass }) => {
      assert.equal(
        Reflect.getMetadata('translated', BaseClass.prototype, 'delete'),
        'supprimer',
      )
      assert.equal(
        Reflect.getMetadata('help', BaseClass.prototype, 'delete'),
        'supprimer()',
      )
    })
  })

  it('should trigger a custom listener when set with reference to instance', () => {
    return import('../src/base-class').then(({ default: BaseClass }) => {
      const anObject = new BaseClass()
      let called = null
      anObject._addListener('customEvent', function() {
        called = this
      })
      anObject._dispatch('customEvent', anObject)
      assert.deepEqual(called, anObject)
    })
  })

  it('should pass parameters to a listener', () => {
    return import('../src/base-class').then(({ default: BaseClass }) => {
      const anObject = new BaseClass()
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

  it('should trigger a delete listener when instance is deleted', () => {
    return import('../src/base-class').then(({ default: BaseClass }) => {
      const anObject = new BaseClass()
      let called = null
      anObject._addListener('delete', function() {
        called = this
      })
      anObject.delete()
      assert.deepEqual(called, anObject)
    })
  })

  it('should not trigger a listener when removed', () => {
    return import('../src/base-class').then(({ default: BaseClass }) => {
      const anObject = new BaseClass()
      let called = false
      anObject._addListener('customEvent', () => {
        called = true
      })
      anObject._removeListener('customEvent')
      anObject._dispatch('customEvent')
      assert.equal(called, false)
    })
  })

  it('should record reference to runtime and every instance should have it', () => {
    return import('../src/base-class').then(({ default: BaseClass }) => {
      const fakeRuntime = {
        addObject() {},
      }
      BaseClass.setRuntime(fakeRuntime)
      const anObject = new BaseClass()
      assert.equal(anObject._runtime, fakeRuntime)
    })
  })

  it('should call runtime addObject method when instance is created', () => {
    return import('../src/base-class').then(({ default: BaseClass }) => {
      let called = null
      const fakeRuntime = {
        addObject(value) {
          called = value
        },
      }
      BaseClass.setRuntime(fakeRuntime)
      const anObject = new BaseClass()
      assert.deepEqual(called, anObject)
    })
  })

  it('should call runtime deleteObject method when instance is deleted', () => {
    return import('../src/base-class').then(({ default: BaseClass }) => {
      let called = null
      const fakeRuntime = {
        addObject() {},

        deleteObject(value) {
          called = value
        },
      }
      BaseClass.setRuntime(fakeRuntime)
      const anObject = new BaseClass()
      anObject.delete()
      assert.deepEqual(called, anObject)
    })
  })
})
