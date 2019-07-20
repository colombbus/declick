/*eslint-env mocha */
import { assert } from 'chai'
import runtime from '../src/main'

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

    const methods2 = new Map([['exposedSetResult', 'setResult']])

    MyClass2.prototype.className = 'MyClass2'

    runtime.initialize([
      { instance: true, name: 'anInstance', object: MyClass, methods: methods },
      { instance: false, name: 'aClass', object: MyClass2, methods: methods2 },
    ])
  })

  beforeEach(() => {
    runtime.clear()
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

  after(() => {
    runtime.reset()
  })
})
