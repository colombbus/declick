/*eslint-env mocha */
import { assert } from 'chai'
import EventInterface from '../src/events-interface'

describe('When EventInterface is instantiated', () => {

  it('should trigger a custom listener when dispatch is called', () => {
    const anObject = new EventInterface()
    let called = false
    anObject._addListener('customEvent', function() {
      called = true
    })
    anObject._dispatch('customEvent')
    assert.equal(called, true)
  })

  it('should pass parameters to a listener', () => {
    const anObject = new EventInterface()
    let receivedParameter1 = null
    let receivedParameter2 = null
    anObject._addListener('customEvent', (param1, param2) => {
      receivedParameter1 = param1
      receivedParameter2 = param2
    })
    anObject._dispatch('customEvent', 1234, 5678)
    assert.equal(receivedParameter1, 1234)
    assert.equal(receivedParameter2, 5678)
  })

  it('should not trigger a listener when removed', () => {
    const anObject = new EventInterface()
    let called = false
    anObject._addListener('customEvent', () => {
      called = true
    })
    anObject._removeListener('customEvent')
    anObject._dispatch('customEvent')
    assert.equal(called, false)
  })


})
