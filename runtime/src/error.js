import i18n from 'es2015-i18n-tag'

const _findLocation = /^.*\((\d*):(\d*)\)/

let _getLocation = function(error, node) {
  if (node && node.loc) {
    return {
      start: { line: node.loc.start.line, column: node.loc.start.column },
      end: { line: node.loc.end.line, column: node.loc.end.column },
    }
  }
  // case of syntax error
  if (error instanceof SyntaxError) {
    try {
      const results = _findLocation.exec(error.message)
      if (results && results.length > 2) {
        const line = parseInt(results[1])
        const column = parseInt(results[2])
        return {
          start: { line: line, column: column },
          end: { line: line, column: column },
        }
      }
    } catch {}
  }

  return { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } }
}

let _getMessage = function(error, state, node) {
  try {
    if (error instanceof ReferenceError) {
      if (node.type === 'NewExpression') {
        // class unknown
        return i18n`unknown class ${node.callee.name}`
      } else if (node.type === 'CallExpression') {
        if (state.func_) {
          if (
            state.n_ &&
            node.arguments &&
            node.arguments[state.n_ - 1] &&
            node.arguments[state.n_ - 1].type === 'Identifier'
          ) {
            return i18n`unknown variable ${node.arguments[state.n_ - 1].name}`
          }
        } else {
          // unknown function
          return i18n`unknown function ${node.callee.name}`
        }
      } else if (node.type === 'AssignmentExpression') {
        if (node.right && node.right.type === 'Identifier') {
          return i18n`unknown variable ${node.right.name}`
        }
      } else if (node.type === 'BinaryExpression') {
        if (state.doneRight_ && node.right.type === 'Identifier') {
          return i18n`unknown variable ${node.right.name}`
        }
        if (node.left.type === 'Identifier') {
          return i18n`unknown variable ${node.left.name}`
        }
      } else if (node.type === 'MemberExpression') {
        if (node.object && node.object.type === 'Identifier') {
          return i18n`unknown object ${node.object.name}`
        }
      }
    } else if (error instanceof TypeError) {
      if (
        state.func_ &&
        state.func_.type === 'undefined' &&
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

let _getCode = function(node) {
  if (node && node.raw) {
    return node.raw
  }
  return ''
}
export default class {
  constructor(e, states) {
    this._message = e.toString()
    this._error = e
    this._location = { start: false, end: false }
    this._detectError(e, states)
  }

  setLines() {}

  _detectError(error, states) {
    const lastState =
      states && states.length > 0 ? states[states.length - 1] : null
    const node = lastState ? lastState.node : null
    this._code = _getCode(node)
    this._message = _getMessage(error, lastState, node)
    this._location = _getLocation(error, node)
    /*if (interpreter.stateStack.length > 0) {
        state = interpreter.stateStack[0]
        if (!state.node.loc || !state.node.loc.source) {
          // no program associated: remove lines if any
          error.setLines([])
        } else {
          error.setProgramName(state.node.loc.source)
        }
      }*/
  }

  setProgramName() {}

  getCode() {
    return this._code
  }

  getMessage() {
    return this._message
  }

  getError() {
    return this._error
  }

  getStart() {
    return this._location.start
  }

  getEnd() {
    return this._location.end
  }
}
