/*eslint-env mocha */
import { assert } from 'chai'
import Parser from '../src/parser'
import i18n, { i18nConfig } from 'es2015-i18n-tag'

describe('when encountering a repeat statement', () => {
  let code = `répéter(3) {
    bob.avancer(5)
  }`

  before(() => {
    return import(`../translations/translation.fr.json`).then(translations => {
      i18nConfig({
        locales: 'fr',
        translations: translations,
      })
      Parser.setRepeatKeyword(i18n`repeat`)
    })
  })

  it('should parse correctly a repeat statement', () => {
    let result = Parser.parse(code)
    assert.equal(result.body[0].type, 'RepeatStatement')
  })

  it('should set the count correctly', () => {
    let result = Parser.parse(code)
    assert.equal(result.body[0].count.value, 3)
  })

  it('should set the body correctly', () => {
    let result = Parser.parse(code)
    assert.equal(result.body[0].body.body[0].raw, 'bob.avancer(5)')
  })

  it('should send any error to a given error handler', done => {
    let falsyCode = 'a = b + '
    Parser.setErrorHandler(error => {
      assert.equal(error.getMessage(), 'Erreur de syntaxe')
      done()
    })
    Parser.parse(falsyCode)
  })
})
