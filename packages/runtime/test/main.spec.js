/*eslint-env mocha */
import { assert } from 'chai'
import runtime from '../src/main'

//TODO: make this work (canvas...)

describe('When runtime is initialized', () => {
  let classResult = false
  let instanceResult = false

  before(() => {
    let MyClass = class {
      setResult() {
        instanceResult = true
      }
      addListener() {}
      setRuntime() {}
      dispatch() {}
    }
    const methods = new Map([['exposedSetResult', 'setResult']])

    let MyClass2 = class {
      constructor(value) {
        this.value = value
      }

      setResult() {
        classResult = this.value
      }
      static setRuntime() {}
    }

    let MyClass3 = class {
      getResult() {
        return this.constructor.setupCalled ? true : false
      }
      static setRuntime() {}

      static setup() {
        this.setupCalled = true
      }
    }

    const methods2 = new Map([['exposedSetResult', 'setResult']])
    const methods3 = new Map([['exposedGetResult', 'getResult']])

    MyClass2.prototype.className = 'MyClass2'

    return runtime.initialize('fr', [
      { instance: true, name: 'anInstance', object: MyClass, methods: methods },
      { instance: false, name: 'aClass', object: MyClass2, methods: methods2 },
      {
        instance: false,
        name: 'anotherClass',
        object: MyClass3,
        methods: methods3,
      },
    ])
  })

  beforeEach(() => {
    // runtime.clear()
    classResult = false
    instanceResult = false
  })

  it('should be able to execute code', () => {
    runtime.executeCode('a = 5')
    assert.equal(runtime.getLastValue(), 5)
  })

  it('should be able to use declared instance', () => {
    runtime.executeCode('anInstance.exposedSetResult()')
    assert.ok(instanceResult)
  })

  it('should be able to create an instance of a declared class', () => {
    runtime.executeCode(`yo = new aClass(57)
    yo.exposedSetResult()`)
    assert.equal(classResult, 57)
  })

  it('should be able to retrieve the name of a created instance', () => {
    runtime.executeCode(`yep = new aClass(57)
    yo = new aClass(yep)
    yo.exposedSetResult()`)
    assert.equal(runtime.getDeclickObjectName(classResult), 'yep')
  })

  it('should be able to execute code with translated name of repeat statement', () => {
    runtime.executeCode(`a=0
    répéter(3) {
      a++
    }
    yo = new aClass(a)
    yo.exposedSetResult()`)
    assert.equal(classResult, 3)
  })

  it('should call static setup method if present', () => {
    runtime.executeCode(`a = new anotherClass()
    a.exposedGetResult()`)
    assert.equal(runtime.getLastValue(), true)
  })

  after(() => {
    // runtime.reset()
  })
})
