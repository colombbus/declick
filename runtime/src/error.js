import i18n from 'es2015-i18n-tag'

let _getMessage = function(error, lastState, node) {
  try {
    if (error instanceof ReferenceError) {
      if (node.type === 'NewExpression') {
        // class unknown
        return i18n`unknown class ${node.callee.name}`
      } else if (node.type === 'CallExpression') {
        // unknown function
        return i18n`unknown function ${node.callee.name}`
      }
    } else if (error instanceof TypeError) {
      if (
        lastState.func_ &&
        lastState.func_.type === 'undefined' &&
        node.type === 'CallExpression'
      ) {
        // unknown method
        return i18n`unknown method ${node.callee.property.name} for object ${node.callee.object.name}`
      }
    } else if (error instanceof SyntaxError) {
      if (error.message.toLowerCase().includes('unterminated string')) {
        // unterminated string
        return i18n`missing quote`
      } else {
        return i18n`syntax error`
      }
    }
  } catch {
    return `Error: ${error.toString()}`
  }
  return error.toString()
}

export default class {
  constructor(e, states) {
    this._message = e.toString()
    this._error = e
    this._start = false
    this._end = false
    if (states) {
      this._detectError(e, states)
    }
  }

  setLines() {}

  _detectError(error, states) {
    if (states.length > 0) {
      const lastState = states[states.length - 1]
      const node = lastState.node
      if (node.loc) {
        this._start = node.loc.start
        this._end = node.loc.end
      }
      /*if (interpreter.stateStack.length > 0) {
        state = interpreter.stateStack[0]
        if (!state.node.loc || !state.node.loc.source) {
          // no program associated: remove lines if any
          error.setLines([])
        } else {
          error.setProgramName(state.node.loc.source)
        }
      }*/
      this._message =
        (node.raw ? `${node.raw}\n` : '') + _getMessage(error, lastState, node)
    }
  }

  setProgramName() {}

  getMessage() {
    return this._message
  }

  getError() {
    return this._error
  }

  getStart() {
    return this._start
  }

  getEnd() {
    return this._end
  }
}
