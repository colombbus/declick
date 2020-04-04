/*eslint-env mocha */
import { assert } from 'chai'
import BaseInstance from '../src/base-instance'

describe('When BaseInstance is instantiated', () => {
  it('should have metadata instance set to true', () => {
    assert.equal(Reflect.getMetadata('instance', BaseInstance), true)
  })

  it('should call runtime addInstance method when instance is created', () => {
    let called = null
    const fakeRuntime = {
      addInstance(value) {
        called = value
      },
    }
    const anObject = new BaseInstance()
    anObject.setRuntime(fakeRuntime)
    assert.deepEqual(called, anObject)
  })

})
