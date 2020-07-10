//TODO: à compléter

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

  //TODO: i18n
  _detectError(e, states) {
    if (states.length > 0) {
      const lastState = states[states.length - 1]
      const node = lastState.node
      this._message = `${node.raw}`
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
      this._message = node.raw ? `${node.raw}\n` : ''
      try {
        if (e instanceof ReferenceError) {
          if (node.type === 'NewExpression') {
            // class unknown
            this._message += `Impossible de créer un objet de type ${node.callee.name}`
          } else if (
            lastState.func_ &&
            lastState.func_.type === 'undefined' &&
            node.type === 'CallExpression'
          ) {
            // method undefined
            this._message += `La méthode ${node.callee.property.name} n'existe pas pour l'objet ${node.callee.object.name} `
          }
        }
      } catch (e) {
        this._message += `Erreur d'exécution : ${e.message}`
      }
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
