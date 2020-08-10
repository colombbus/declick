/*eslint-env mocha */
import { assert } from 'chai'
import { i18nConfig } from 'es2015-i18n-tag'
import frenchTranslations from '../translations/translation.fr.json'
import 'reflect-metadata'

describe('When checkTypes is added', () => {
  let TestClass

  before(done => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    import('../src/utils.js').then(({ checkTypes }) => {
      TestClass = class {
        @checkTypes(['string'])
        expectString(value) {
          return true
        }

        @checkTypes(['integer'])
        expectInteger(value) {
          return true
        }

        @checkTypes(['number'])
        expectNumber(value) {
          return true
        }

        @checkTypes(['array'])
        expectArray(value) {
          return true
        }
      }
      done()
    })
  })

  it.only('should detect when a wrong type is provided', () => {
    const a = new TestClass()
    let error1, error2, error3, error4, error5
    try {
      a.expectString(42)
    } catch (e) {
      error1 = e
    }
    try {
      a.expectInteger(42.3)
    } catch (e) {
      error2 = e
    }
    try {
      a.expectNumber('test')
    } catch (e) {
      error3 = e
    }
    try {
      a.expectArray(3)
    } catch (e) {
      error4 = e
    }
    assert.deepEqual(error1, { declickObjectError: "42 n'est pas un texte" })
    assert.deepEqual(error2, {
      declickObjectError: "42.3 n'est pas un nombre entier",
    })
    assert.deepEqual(error3, {
      declickObjectError: "test n'est pas un nombre",
    })
    assert.deepEqual(error4, {
      declickObjectError: "3 n'est pas une liste",
    })
  })
})
