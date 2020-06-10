/*eslint-env mocha */
import { assert } from 'chai'
import { parse } from 'acorn'
import declickParser from '../src/parser'
import Interpreter from '../src/interpreter'

describe('Given an instance of Interpreter', () => {
  let interpreter

  beforeEach(() => {
    interpreter = new Interpreter('')
  })

  it('should interpret code correctly', () => {
    let code = `
    function abcd() {
      return 5;
    }
    a = 12
    for(i=0;i<10;i++) {
      a++
    }
    b = abcd();
    c = new String('bonjour, la valeur de a est ')
    d = c+a+' et la valeur de b est '+b
    `
    let ast = parse(code)
    interpreter.appendCode(ast)
    interpreter.run()

    assert.equal(
      interpreter.getLastValue().data,
      'bonjour, la valeur de a est 22 et la valeur de b est 5',
    )
  })

  it('should interpret repeat statement with specified count correctly', () => {
    let code = `
    a = 12
    répéter(10) {
      a++
    }
    c = new String('bonjour, la valeur de a est ')
    d = c+a
    `
    declickParser.setRepeatKeyword('répéter')
    let ast = declickParser.parse(code)
    interpreter.appendCode(ast)
    interpreter.run()

    assert.equal(
      interpreter.getLastValue().data,
      'bonjour, la valeur de a est 22',
    )
  })

  it('should interpret repeat statement without count correctly', () => {
    let code = `
    a = 12
    répéter() {
      a++
      if (a > 31) {
        break
      }
    }
    c = new String('bonjour, la valeur de a est ')
    d = c+a
    `
    declickParser.setRepeatKeyword('répéter')
    let ast = declickParser.parse(code)
    interpreter.appendCode(ast)
    interpreter.run()

    assert.equal(
      interpreter.getLastValue().data,
      'bonjour, la valeur de a est 32',
    )
  })

  it('should handle try/catch correctly', () => {
    let code = `
    function abcd() {
      throw 'ERROR'
    }
    c = 'coucou'
    try {
      abcd()
    } catch (e) {
      c = e.toString()
    }
    d = c
    `
    let ast = declickParser.parse(code)
    interpreter.appendCode(ast)
    interpreter.run()

    assert.equal(interpreter.getLastValue().data, 'ERROR')
  })

  it('should handle function insertion and inner call correctly', () => {
    let code1 = `
    c = 'coucou'
    `
    let code2 = `
    c = 'je suis passé par ici'
    `
    let ast1 = declickParser.parse(code1)
    let ast2 = declickParser.parse(code2)
    interpreter.appendCode(ast1)
    let functionStatement = interpreter.createFunctionStatement(ast2.body)
    interpreter.run()
    let innerCallStatement = interpreter.createCallStatement(functionStatement)
    interpreter.insertStatements([innerCallStatement])
    interpreter.run()
    assert.equal(interpreter.getLastValue().data, 'je suis passé par ici')
  })

  it.only('should pass provided parameters to an inner call', () => {
    let codeInit = `
      c = 'rien encore'
    `

    let codeFunction = `
    function phrase(param1, param2, param3) {
      c = param1 +' '+ param2[1] +' '+ param3.quoi
    }
    `

    let codeParam1 = `'Je'`

    let codeParam2 = `
    ['dors', 'mange', 'bois']
    `

    let codeParam3 = `function aClass(){}

    aClass.prototype.qui = 'moi'
    aClass.prototype.quoi = 'des pates'
    aClass.prototype.quand = 'demain'

    a = new aClass()
    a
    `

    let astInit = declickParser.parse(codeInit)
    interpreter.appendCode(astInit)
    interpreter.run()
    let astFunction = declickParser.parse(codeFunction).body[0]
    let astFunction2 = interpreter.createFunction(
      astFunction,
      interpreter.getScope(),
    )
    let innerCallStatement = interpreter.createCallStatement(astFunction2)
    let astParam1 = declickParser.parse(codeParam1)
    interpreter.appendCode(astParam1)
    interpreter.run()
    let valueParam1 = interpreter.getLastValue()
    let astParam2 = declickParser.parse(codeParam2)
    interpreter.appendCode(astParam2)
    interpreter.run()
    let valueParam2 = interpreter.getLastValue()
    let astParam3 = declickParser.parse(codeParam3)
    interpreter.appendCode(astParam3)
    interpreter.run()
    let valueParam3 = interpreter.getLastValue()
    interpreter.appendStatements(
      [innerCallStatement],
      [valueParam1, valueParam2, valueParam3],
    )
    interpreter.run()
    assert.equal(interpreter.getLastValue().data, 'Je mange des pates')
  })

  it('should insert function at the right place', () => {
    let code1 = `
    c = 1
    c++
    c = c+2
    c = c+3
    `
    let code2 = `
    c = 50
    `
    let ast1 = declickParser.parse(code1)
    let ast2 = declickParser.parse(code2)
    interpreter.appendCode(ast1)
    interpreter.step() // Program
    interpreter.step() // ?
    interpreter.step() // Assignment
    interpreter.step() // Left
    interpreter.step() // Right
    interpreter.step() // End of assignment
    let functionStatement = interpreter.createFunctionStatement(ast2.body)
    let innerCallStatement = interpreter.createCallStatement(functionStatement)
    interpreter.insertStatements([innerCallStatement])
    interpreter.run()
    assert.equal(interpreter.getLastValue().data, 56)
  })

  it('should call callback when used in a CallbackStatement', () => {
    let code = `
    a = 12
    a++
    `
    let ast = declickParser.parse(code)
    interpreter.appendCode(ast)
    let called = false
    let callbackStatement = interpreter.createCallbackStatement(() => {
      called = true
    })
    interpreter.appendStatements([callbackStatement])
    interpreter.run()
    assert.equal(called, true)
  })

  it('should call callback when used in appendSatetements', () => {
    let code1 = `
    a = 12
    `
    let code2 = `
    a = 14
    `
    let code3 = `
    a = 16
    `
    let ast1 = declickParser.parse(code1)
    let ast2 = declickParser.parse(code2)
    let ast3 = declickParser.parse(code3)
    interpreter.appendCode(ast1)
    let called = false
    let result = 0
    let callback = () => {
      called = true
      result = interpreter.getLastValue().data
    }
    interpreter.appendStatements(ast2.body, null, callback)
    interpreter.appendCode(ast3)
    interpreter.run()
    assert.equal(called, true)
    assert.equal(result, 14)
  })
})
