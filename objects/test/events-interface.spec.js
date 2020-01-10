/*eslint-env mocha */
import { assert } from 'chai'
import EventInterface from '../src/events-interface'

describe('When EventInterface is instantiated', () => {
  it('should trigger a custom listener when dispatch is called', () => {
    const anObject = new EventInterface()
    let called = false
    anObject.addListener('customEvent', function() {
      called = true
    })
    anObject.dispatch('customEvent')
    assert.equal(called, true)
  })

  it('should pass parameters to a listener', () => {
    const anObject = new EventInterface()
    let receivedParameter1 = null
    let receivedParameter2 = null
    anObject.addListener('customEvent', (param1, param2) => {
      receivedParameter1 = param1
      receivedParameter2 = param2
    })
    anObject.dispatch('customEvent', 1234, 5678)
    assert.equal(receivedParameter1, 1234)
    assert.equal(receivedParameter2, 5678)
  })

  it('should not trigger a listener when listener removed', () => {
    const anObject = new EventInterface()
    let called = false
    const listener = function() {
      called = true
    }
    anObject.addListener('customEvent', listener)
    anObject.removeListener('customEvent', listener)
    anObject.dispatch('customEvent')
    assert.equal(called, false)
  })

  it('should not trigger a listener when all listeners removed', () => {
    const anObject = new EventInterface()
    let called = false
    anObject.addListener('customEvent', () => {
      called = true
    })
    anObject.removeListener('customEvent')
    anObject.dispatch('customEvent')
    assert.equal(called, false)
  })
})
