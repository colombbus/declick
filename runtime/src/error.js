//TODO: i18n
let _getMessage = function(error, lastState, node) {
  try {
    if (error instanceof ReferenceError) {
      if (node.type === 'NewExpression') {
        // class unknown
        return `Impossible de créer un objet de type ${node.callee.name}`
      } else if (node.type === 'CallExpression') {
        // unknown function
        return `La fonction ${node.callee.name} n'existe pas`
      }
    } else if (error instanceof TypeError) {
      if (
        lastState.func_ &&
        lastState.func_.type === 'undefined' &&
        node.type === 'CallExpression'
      ) {
        // unknown method
        return `La méthode ${node.callee.property.name} n'existe pas pour l'objet ${node.callee.object.name}`
      }
    } else if (error instanceof SyntaxError) {
      if (error.message.toLowerCase().includes('unterminated string')) {
        // unterminated string
        return 'Il manque un guillemet'
      } else {
        return 'Erreur de syntaxe'
      }
    }
  } catch {
    return `Erreur d'exécution : ${error.toString()}`
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
