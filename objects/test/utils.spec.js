/*eslint-env mocha */
import { assert } from 'chai'
import { i18nConfig } from 'es2015-i18n-tag'
import frenchTranslations from '../translations/translation.fr.json'
import 'reflect-metadata'

describe('When checkArguments is added', () => {
  let TestClass
  let testInstance

  before(done => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    import('../src/utils.js').then(({ checkArguments }) => {
      TestClass = class {
        @checkArguments(['string'])
        expectString(value) {
          return true
        }

        @checkArguments(['integer'])
        expectInteger(value) {
          return true
        }

        @checkArguments(['number'])
        expectNumber(value) {
          return true
        }

        @checkArguments(['array'])
        expectArray(value) {
          return true
        }

        @checkArguments(['boolean'])
        expectBoolean(value) {
          return true
        }

        @checkArguments(['object'])
        expectObject(value) {
          return true
        }

        @checkArguments(['function'])
        expectFunction(value) {
          return true
        }

        @checkArguments(['any'])
        expectAny(value) {
          return true
        }

        @checkArguments([
          'string',
          'integer',
          'number',
          'array',
          'boolean',
          'object',
          'function',
        ])
        expectMultiple(value1, value2, value3, value4, value5, value6, value7) {
          return true
        }

        @checkArguments(
          [
            'string',
            'integer',
            'number',
            'array',
            'boolean',
            'object',
            'function',
          ],
          2,
        )
        expectMultipleOptional(
          value1,
          value2,
          value3,
          value4,
          value5,
          value6,
          value7,
        ) {
          return true
        }
      }
      testInstance = new TestClass()
      done()
    })
  })

  it('should be ok when the right type is provided', () => {
    let value1, value2, value3, value4, value5, value6, value7, value8
    value1 = testInstance.expectString('a string')
    value2 = testInstance.expectInteger(42)
    value3 = testInstance.expectNumber(1.2)
    value4 = testInstance.expectArray([1, 2])
    value5 = testInstance.expectBoolean(false)
    const DeclickClass = class {}
    DeclickClass._declickId_ = 'test'
    value6 = testInstance.expectObject(new DeclickClass())
    value7 = testInstance.expectFunction(() => {})
    value8 = testInstance.expectAny('abc')
    assert.ok(value1)
    assert.ok(value2)
    assert.ok(value3)
    assert.ok(value4)
    assert.ok(value5)
    assert.ok(value6)
    assert.ok(value7)
    assert.ok(value8)
  })

  it('should be ok when the right types are provided in the right order', () => {
    const DeclickClass = class {}
    DeclickClass._declickId_ = 'test'
    let value = testInstance.expectMultiple(
      'string',
      5,
      4.2,
      ['a', 'b'],
      true,
      new DeclickClass(),
      () => {},
    )
    assert.ok(value)
  })

  it('should detect when a wrong type is provided', () => {
    let error1, error2, error3, error4, error5, error6, error7
    try {
      testInstance.expectString(42)
    } catch (e) {
      error1 = e
    }
    try {
      testInstance.expectInteger(42.3)
    } catch (e) {
      error2 = e
    }
    try {
      testInstance.expectNumber('test')
    } catch (e) {
      error3 = e
    }
    try {
      testInstance.expectArray(3)
    } catch (e) {
      error4 = e
    }
    try {
      testInstance.expectBoolean('text')
    } catch (e) {
      error5 = e
    }
    try {
      testInstance.expectObject(5)
    } catch (e) {
      error6 = e
    }
    try {
      testInstance.expectFunction({ a: 5 })
    } catch (e) {
      error7 = e
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
    assert.deepEqual(error5, {
      declickObjectError: "text n'est pas un booléen",
    })
    assert.deepEqual(error6, {
      declickObjectError: "5 n'est pas un objet Declick",
    })
    assert.deepEqual(error7, {
      declickObjectError: "[object Object] n'est pas une fonction",
    })
  })

  it('should detect when one of the provided types is not right', () => {
    const DeclickClass = class {}
    DeclickClass._declickId_ = 'test'
    let error
    try {
      testInstance.expectMultiple(
        'string',
        5.1,
        4.2,
        ['a', 'b'],
        true,
        new DeclickClass(),
        () => {},
      )
    } catch (e) {
      error = e
    }
    assert.deepEqual(error, {
      declickObjectError: "5.1 n'est pas un nombre entier",
    })
  })

  it('should detect when one argument is missing', () => {
    const DeclickClass = class {}
    DeclickClass._declickId_ = 'test'
    let error1, error2
    try {
      testInstance.expectMultiple(
        'string',
        5,
        4.2,
        ['a', 'b'],
        true,
        new DeclickClass(),
      )
    } catch (e) {
      error1 = e
    }
    try {
      testInstance.expectAny()
    } catch (e) {
      error2 = e
    }
    assert.deepEqual(error1, {
      declickObjectError: 'il manque un paramètre de type fonction',
    })
    assert.deepEqual(error2, {
      declickObjectError: 'il manque un paramètre',
    })
  })

  it('should be ok when one optional argument is missing', () => {
    let value = testInstance.expectMultipleOptional(
      'string',
      5,
      4.2,
      ['a', 'b'],
      true,
    )
    assert.ok(value)
  })

  it('should detect when one mandatory argument is missing', () => {
    let error
    try {
      testInstance.expectMultipleOptional('string', 5, 4.2, ['a', 'b'])
    } catch (e) {
      error = e
    }
    assert.deepEqual(error, {
      declickObjectError: 'il manque un paramètre de type booléen',
    })
  })

  it('should detect when two mandatory arguments are missing', () => {
    let error
    try {
      testInstance.expectMultipleOptional('string', 5, 4.2)
    } catch (e) {
      error = e
    }
    assert.deepEqual(error, {
      declickObjectError:
        'il manque un paramètre de type liste\nil manque un paramètre de type booléen',
    })
  })
})
