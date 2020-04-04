//TODO: à compléter

export default class {
  constructor(e, states) {
    this._message = e.toString()
    this._error = e
    if (states) {
      this._detectError(states)
    }
  }

  setLines() {}

  //TODO: i18n
  _detectError(states) {
    if (states.length > 0) {
      const lastState = states[states.length - 1]
      console.debug(lastState)
      const node = lastState.node
      console.debug(node)
      this._message = `${node.raw}`
      try {
        if (
          lastState.func_ &&
          lastState.func_.type === 'undefined' &&
          node.type === 'CallExpression'
        ) {
          // method undefined
          this._message = `${node.raw}\nLa méthode ${node.callee.property.name} n'existe pas pour l'objet ${node.callee.object.name} `
        }
        if (node.type === 'NewExpression') {
          // class unknown
          this._message = `${node.raw}\nImpossible de créer un object de type ${node.callee.name}`
        }
      } catch (e) {}
    }
  }

  setProgramName() {}
}
