/*eslint-env mocha */
import { assert } from 'chai'
import data from '../src/data'
import { parse } from 'acorn'

describe('When data has created interpreter', () => {
  beforeEach(() => {
    data.reset()
  })

  it('should be able to add an instance to interpreter', () => {
    let result = false
    let MyClass = class {
      setResult() {
        result = true
      }
    }
    let myInstance = new MyClass()

    const methods = new Map([['exposedSetResult', 'setResult']])

    data.addInstance('test', myInstance, methods)
    let interpreter = data.createInterpreter()
    let code = 'test.exposedSetResult()'
    let ast = parse(code)
    interpreter.appendCode(ast)
    interpreter.run()

    assert.ok(result)
  })

  it('should be able to add a class to interpreter', () => {
    let result = false

    let MyClass = class {
      setResult() {
        result = true
      }
      static addListener() {}
    }

    MyClass.prototype.declickObject = 'MyClass'

    const methods = new Map([['exposedSetResult', 'setResult']])

    data.addClass('Test', MyClass, methods)
    let interpreter = data.createInterpreter()
    let code = `toto = new Test()
    toto.exposedSetResult()`
    let ast = parse(code)
    interpreter.appendCode(ast)
    interpreter.run()

    assert.ok(result)
  })

  it('should be able to add a class with its constructor to interpreter', () => {
    let result = false

    const MyClass = class {
      constructor(value) {
        this.registeredValue = value
      }
      setResult() {
        result = this.registeredValue
      }
      static addListener() {}
    }

    MyClass.prototype.declickObjet = 'MyClass'

    const methods = new Map([['exposedSetResult', 'setResult']])

    data.addClass('Test', MyClass, methods)
    let interpreter = data.createInterpreter()
    let code = `toto = new Test('coucou')
    toto.exposedSetResult()`
    let ast = parse(code)
    interpreter.appendCode(ast)
    interpreter.run()

    assert.equal(result, 'coucou')
  })

  it('should be able to add a function to interpreter', () => {
    let result = false

    let myFunction = function(a, b) {
      if (a === 3 && b === 'test') {
        result = true
      }
      return 'functionResult'
    }

    data.addFunction('interpreterFunction', myFunction)
    let interpreter = data.createInterpreter()
    let code = "interpreterFunction(3, 'test')"
    let ast = parse(code)
    interpreter.appendCode(ast)
    interpreter.run()
    assert.ok(result)
    assert.equal(interpreter.getLastValue(), 'functionResult')
  })

  it('should be able to add a function to interpreter after it is created', () => {
    let result = false

    let myFunction = function(a, b) {
      if (a === 3 && b === 'test') {
        result = true
      }
      return 'functionResult'
    }

    let interpreter = data.createInterpreter()
    data.addFunction('interpreterFunction', myFunction)
    let code = "interpreterFunction(3, 'test')"
    let ast = parse(code)
    interpreter.appendCode(ast)
    interpreter.run()
    assert.ok(result)
    assert.equal(interpreter.getLastValue(), 'functionResult')
  })

  it('should be able to retrieve a declared instance from interpreter', () => {
    let result = false
    let MyClass = class {
      setResult() {
        result = this
      }
    }

    const methods = new Map([['exposedSetResult', 'setResult']])

    let myInstance = new MyClass()

    data.addInstance('testInstance', myInstance, methods)
    let interpreter = data.createInterpreter()
    let code = 'testInstance.exposedSetResult()'
    let ast = parse(code)
    interpreter.appendCode(ast)
    interpreter.run()

    assert.equal(data.toNativeData(result), myInstance)
  })

  it('should be able to retrieve an instance of a declared class from interpreter', () => {
    let result = false
    let MyClass = class {
      constructor(value) {
        this.secretText = value
      }
      setResult() {
        result = this
      }
      getActualResult() {
        return this.secretText
      }
      static addListener() {}
    }

    MyClass.prototype.declickObjet = 'MyClass'

    const methods = new Map([['exposedSetResult', 'setResult']])

    data.addClass('ATestClass', MyClass, methods)
    let interpreter = data.createInterpreter()
    let code = `toto = new ATestClass('yes')
    toto.exposedSetResult()`
    let ast = parse(code)
    interpreter.appendCode(ast)
    interpreter.run()
    let retrievedInstance = data.toNativeData(result)
    assert.equal(retrievedInstance.getActualResult(), 'yes')
  })

  it('should be able to inject an instance of a declared class into the interpreter', () => {
    let result = false
    let MyClass = class {
      constructor(value) {
        this.secretValue = value
      }
      setResult(value) {
        result = value
      }
      getSecretValue() {
        return this.secretValue
      }
      static addListener() {}
    }

    const methods = new Map([
      ['exposedSetResult', 'setResult'],
      ['exposedGetSecretValue', 'getSecretValue'],
    ])

    MyClass.prototype._declickId_ = 'MyClass'

    data.addClass('ATestClass', MyClass, methods)
    let interpreter = data.createInterpreter()
    let instance = new MyClass(53)
    let interpreterInstance = data.toInterpreterData(instance)
    interpreter.setProperty(
      interpreter.getGlobalScope(),
      'injectedInstance',
      interpreterInstance,
    )
    let code = `a = injectedInstance.exposedGetSecretValue()
    injectedInstance.exposedSetResult(a*3)`
    let ast = parse(code)
    interpreter.appendCode(ast)
    interpreter.run()
    assert.equal(result, 53 * 3)
  })

  it('should prevent from redeclaring a declared instance', () => {
    let MyClass = class {
      setResult() {}
    }
    let myInstance = new MyClass()

    const methods = new Map([['exposedSetResult', 'setResult']])

    data.addInstance('test', myInstance, methods)
    let interpreter = data.createInterpreter()
    let code = 'test = 5'
    let ast = parse(code)
    interpreter.appendCode(ast)
    assert.throw(interpreter.run.bind(interpreter), TypeError)
  })

  it('should remove reference to an instance of a declared class when asked to delete object', () => {
    let callback = function() {}
    let MyClass = class {
      tickle() {}
    }

    const methods = new Map([['exposedTickle', 'tickle']])

    MyClass.prototype.declickObjet = 'MyClass'

    data.addClass('ATestClass', MyClass, methods)
    let interpreter = data.createInterpreter()
    let code = 'toto = new ATestClass()'
    let ast = parse(code)
    interpreter.appendCode(ast)
    interpreter.run()
    data.deleteObject(data.toNativeData(data.findInterpreterObject('toto')))
    code = 'toto.exposedTickle()'
    ast = parse(code)
    interpreter.appendCode(ast)
    assert.throws(interpreter.run.bind(interpreter), ReferenceError)
  })

  it('should be able to expose a property on a declared instance', () => {
    let MyClass = class {
      setResult() {}
    }

    MyClass.prototype.innerValue = 542

    const myInstance = new MyClass()

    const methods = new Map([['exposedSetResult', 'setResult']])

    data.addInstance('test', myInstance, methods)

    const interpreter = data.createInterpreter()
    data.exposeProperties(myInstance, [
      { name: 'innerValue', exposedName: 'exposedValue' },
    ])
    const code = 'test.exposedValue'
    const ast = parse(code)
    interpreter.appendCode(ast)
    interpreter.run()

    assert.equal(interpreter.getLastValue(), 542)
  })

  it('should be able to retrieve a changed exposed property', () => {
    let MyClass = class {
      setResult() {}
    }

    MyClass.prototype.innerValue = 542

    const myInstance = new MyClass()

    const methods = new Map([['exposedSetResult', 'setResult']])

    data.addInstance('test', myInstance, methods)

    const interpreter = data.createInterpreter()
    data.exposeProperties(myInstance, [
      { name: 'innerValue', exposedName: 'exposedValue' },
    ])
    myInstance.innerValue = 'test string'
    const code = 'test.exposedValue'
    const ast = parse(code)
    interpreter.appendCode(ast)
    interpreter.run()

    assert.equal(interpreter.getLastValue(), 'test string')
  })

  describe('When interpreter is reset', () => {
    beforeEach(() => {
      data.reset()
    })

    it('should clear reference to a previously created object', () => {
      let MyClass = class {
        setResult() {}
        static addListener() {}
      }

      MyClass.prototype.declickObjet = 'MyClass'

      const methods = new Map([['exposedSetResult', 'setResult']])

      data.addClass('Test', MyClass, methods)
      let interpreter = data.createInterpreter()
      let code = 'toto = new Test()'
      let ast = parse(code)
      interpreter.appendCode(ast)
      interpreter.run()
      interpreter.reset()
      code = 'toto.exposedSetResult()'
      ast = parse(code)
      interpreter.appendCode(ast)
      assert.throws(interpreter.run.bind(interpreter), ReferenceError)
    })

    it('should be able to create an instance of a class declared previously', () => {
      let result = false

      let MyClass = class {
        setResult() {
          result = true
        }
        static addListener() {}
      }

      const methods = new Map([['exposedSetResult', 'setResult']])

      MyClass.prototype.declickObjet = 'MyClass'

      data.addClass('Test', MyClass, methods)
      let interpreter = data.createInterpreter()
      interpreter.reset()
      let code = `toto = new Test()
      toto.exposedSetResult()`
      let ast = parse(code)
      interpreter.appendCode(ast)
      interpreter.run()
      assert.ok(result)
    })

    it('should be able to call an instance declared previously', () => {
      let result = false
      let MyClass = class {
        setResult() {
          result = true
        }
        addListener() {}
      }

      const methods = new Map([['exposedSetResult', 'setResult']])

      let myInstance = new MyClass()
      data.addInstance('test', myInstance, methods)
      let interpreter = data.createInterpreter()
      interpreter.reset()
      let code = 'test.exposedSetResult()'
      let ast = parse(code)
      interpreter.appendCode(ast)
      interpreter.run()
      assert.ok(result)
    })

    it('should be able to call a function declared previously', () => {
      let result = false
      let myFunction = function() {
        result = true
      }
      data.addFunction('testFunction', myFunction)
      let interpreter = data.createInterpreter()
      interpreter.reset()
      let code = 'testFunction()'
      let ast = parse(code)
      interpreter.appendCode(ast)
      interpreter.run()
      assert.ok(result)
    })
  })

  after(() => {
    data.reset()
  })
})
