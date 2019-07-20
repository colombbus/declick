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

  it('should have metadata instance set to false', () => {
    return import('../src/base-class').then(({ default: BaseClass }) => {
      assert.equal(Reflect.getMetadata('instance', BaseClass), false)
    })
  })
})
