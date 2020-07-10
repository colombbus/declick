/*eslint-env mocha */
import { assert } from 'chai'
import declickParser from '../src/parser'
import Interpreter from '../src/interpreter'
import DeclickError from '../src/error'
import { i18nConfig } from 'es2015-i18n-tag'

describe('when detecting an error', () => {
  let interpreter

  before(() => {
    return import(`../translations/translation.fr.json`).then(translations => {
      i18nConfig({
        locales: 'fr',
        translations: translations,
      })
    })
  })

  beforeEach(() => {
    interpreter = new Interpreter('')
  })

  it('should detect instantiation of an unknown class', () => {
    const code = `a = new Truc()`
    const ast = declickParser.parse(code)
    interpreter.appendCode(ast)
    let error
    try {
      interpreter.run()
    } catch (e) {
      error = new DeclickError(e, interpreter.stateStack)
    }
    assert.equal(
      error.getMessage(),
      'new Truc()\nImpossible de créer un objet de type Truc',
    )
  })

  it('should detect use of an unknown method', () => {
    const code = `
    a = new String('abcdef')
    a.truc()
    `
    const ast = declickParser.parse(code)
    interpreter.appendCode(ast)
    let error
    try {
      interpreter.run()
    } catch (e) {
      error = new DeclickError(e, interpreter.stateStack)
    }
    assert.equal(
      error.getMessage(),
      "a.truc()\nLa méthode truc n'existe pas pour l'objet a",
    )
  })

  it('should detect use of an unknown function', () => {
    const code = `
      truc()
      `
    const ast = declickParser.parse(code)
    interpreter.appendCode(ast)
    let error
    try {
      interpreter.run()
    } catch (e) {
      error = new DeclickError(e, interpreter.stateStack)
    }
    assert.equal(error.getMessage(), "truc()\nLa fonction truc n'existe pas")
  })

  it('should detect unterminated string', () => {
    const code = `
    a = 'coucou
    b = 3 + 1
    `
    let ast
    let error
    try {
      ast = declickParser.parse(code)
      interpreter.appendCode(ast)
      interpreter.run()
    } catch (e) {
      error = new DeclickError(e, interpreter.stateStack)
    }
    assert.equal(error.getMessage(), 'Il manque un guillemet')
  })

  it('should detect generic syntax error', () => {
    const code = `
    b = 3 +
    `
    let ast
    let error
    try {
      ast = declickParser.parse(code)
      interpreter.appendCode(ast)
      interpreter.run()
    } catch (e) {
      error = new DeclickError(e, interpreter.stateStack)
    }
    assert.equal(error.getMessage(), 'Erreur de syntaxe')
  })

  it('should detect unknown variable', () => {
    const code = `
    b = a + 5
    `
    let ast
    let error
    try {
      ast = declickParser.parse(code)
      interpreter.appendCode(ast)
      interpreter.run()
    } catch (e) {
      error = new DeclickError(e, interpreter.stateStack)
    }
    assert.equal(error.getMessage(), "a + 5\na n'est pas défini")
  })
})
