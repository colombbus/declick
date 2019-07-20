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
      Text.addListener('customEvent', function() {
        called = this
      })
      Text.dispatch('customEvent', anObject)
      assert.deepEqual(called, anObject)
    })
  })

  it('should pass parameters to a listener', () => {
    return import('../../src/classes/text').then(({default: Text}) => {
      const anObject = new Text()
      let receivedParameter1 = null
      let receivedParameter2 = null
      Text.addListener('customEvent', (param1, param2) => {
        receivedParameter1 = param1
        receivedParameter2 = param2
      })
      Text.dispatch('customEvent', anObject, 1234, 5678)
      assert.equal(receivedParameter1, 1234)
      assert.equal(receivedParameter2, 5678)
    })
  })

  it('should trigger a create listener when instance is created', () => {
    return import('../../src/classes/text').then(({default: Text}) => {
      let called = null
      Text.addListener('create', function() {
        called = this
      })
      const anObject = new Text()
      assert.deepEqual(called, anObject)
    })
  })

  it('should trigger a delete listener when instance is deleted', () => {
    return import('../../src/classes/text').then(({default: Text}) => {
      const anObject = new Text()
      let called = null
      Text.addListener('delete', function() {
        called = this
      })
      anObject.delete()
      assert.deepEqual(called, anObject)
    })
  })

  it('should not trigger a text delete listener when base class instance is deleted', () => {
    let Text, BaseClass
    return import('../../src/classes/text').then(({default: Text}) => {
      return import('../../src/base-class').then(({default: BaseClass}) => {
        const anObject = new BaseClass()
        let called = null
        Text.addListener('delete', function() {
          called = this
        })
        anObject.delete()
        assert.equal(called, null)
      })
    })
  })

  it('should trigger a base class delete listener when text instance is deleted', () => {
    let Text, BaseClass
    return import('../../src/classes/text').then(({default: Text}) => {
      return import('../../src/base-class').then(({default: BaseClass}) => {
        const anObject = new Text()
        let called = null
        BaseClass.addListener('delete', function() {
          called = this
        })
        anObject.delete()
        assert.equal(called, anObject)
      })
    })
  })

  it('should not trigger a listener when removed', () => {
    return import('../../src/classes/text').then(({default: Text}) => {
      const anObject = new Text()
      let called = false
      Text.addListener('customEvent', () => {
        called = true
      })
      Text.removeListener('customEvent')
      Text.dispatch('customEvent', anObject)
      assert.equal(called, false)
    })
  })
})
