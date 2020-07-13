/*eslint-env mocha */
import { assert } from 'chai'
import { parse } from 'acorn'
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
    assert.equal(error.getCode(), 'new Truc()')
    assert.equal(
      error.getMessage(),
      'Impossible de créer un objet de type Truc',
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
    assert.equal(error.getCode(), 'a.truc()')
    assert.equal(
      error.getMessage(),
      "La méthode truc n'existe pas pour l'objet a",
    )
  })

  it('should detect use of an unknown instance', () => {
    const code = `
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
    assert.equal(error.getCode(), 'a.truc')
    assert.equal(error.getMessage(), "L'objet a n'existe pas")
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
    assert.equal(error.getCode(), 'truc()')
    assert.equal(error.getMessage(), "La fonction truc n'existe pas")
  })

  it('should detect unterminated string', () => {
    const code = `
    a = 'coucou
    b = 3 + 1
    `
    let ast
    let error
    try {
      // use acorn parser in order not to trigger error management from declick parser
      ast = parse(code)
      interpreter.appendCode(ast)
      interpreter.run()
    } catch (e) {
      error = new DeclickError(e, interpreter.stateStack)
    }
    assert.equal(error.getCode(), '')
    assert.equal(error.getMessage(), 'Il manque un guillemet')
  })

  it('should detect generic syntax error', () => {
    const code = `
    b = 3 +
    `
    let ast
    let error
    try {
      // use acorn parser in order not to trigger error management from declick parser
      ast = parse(code)
      interpreter.appendCode(ast)
      interpreter.run()
    } catch (e) {
      error = new DeclickError(e, interpreter.stateStack)
    }
    assert.equal(error.getCode(), '')
    assert.equal(error.getMessage(), 'Erreur de syntaxe')
  })

  it('should detect unknown variable in binary expression (left)', () => {
    const code = `
    c = 2
    b = a + c
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
    assert.equal(error.getCode(), 'a + c')
    assert.equal(error.getMessage(), "a n'est pas défini")
  })

  it('should detect unknown variable in binary expression (right)', () => {
    const code = `
    c = 2
    b = c + a
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
    assert.equal(error.getCode(), 'c + a')
    assert.equal(error.getMessage(), "a n'est pas défini")
  })

  it('should detect unknown variable in assignment expression', () => {
    const code = `
    b = a
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
    assert.equal(error.getCode(), 'b = a')
    assert.equal(error.getMessage(), "a n'est pas défini")
  })

  it('should detect unknown variable used as parameter', () => {
    const code = `
    function sum(a) {
      return a + 5
    }
    sum(b)
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
    assert.equal(error.getCode(), 'sum(b)')
    assert.equal(error.getMessage(), "b n'est pas défini")
  })

  it.only('should detect unknown variable used as second parameter', () => {
    const code = `
    function sum(a, b) {
      return a + b
    }
    sum(5, c)
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
    assert.equal(error.getCode(), 'sum(5, c)')
    assert.equal(error.getMessage(), "c n'est pas défini")
  })

  it('should detect error location for an interpreter error', () => {
    const code = `a = 5
    b = 6
    c = a+d
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
    assert.deepEqual(error.getStart(), { line: 3, column: 8 })
    assert.deepEqual(error.getEnd(), { line: 3, column: 11 })
  })

  it('should detect error location for a parser error', () => {
    const code = `a = 5
    b = 6
    c = a,`
    let ast
    let error
    try {
      // use acorn parser in order not to trigger error management from declick parser
      ast = parse(code)
      interpreter.appendCode(ast)
      interpreter.run()
    } catch (e) {
      error = new DeclickError(e, interpreter.stateStack)
    }
    assert.deepEqual(error.getStart(), { line: 3, column: 10 })
    assert.deepEqual(error.getEnd(), { line: 3, column: 10 })
  })
})
