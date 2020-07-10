import Interpreter from './interpreter'
import data from './data'
import DeclickError from './error'

const MAX_STEP = 100

let _errorHandler = error => {
  console.log(error.getMessage())
  console.log(`(L ${error.getStart().line}, C ${error.getStart().column})`)
  console.error(error.getError())
}
let _stepCount = 0
let _running = false
let _priorityStatementsAllowed = true
let _interpreter = null
let _priorityInterpreter = null
let _priorityStep = false

let _nextStep = function() {
  if (_priorityInterpreter.step()) {
    _priorityStep = true
    return true
  }
  if (_interpreter.step()) {
    _priorityStep = false
    return true
  }
  return false
  //_logCommand(_interpreter.stateStack)
}

let _run = function() {
  try {
    _running = true
    while (_running) {
      _stepCount++
      _running =
        _nextStep() && !(_priorityInterpreter.paused_ && _interpreter.paused_)
      if (_running && _stepCount >= MAX_STEP) {
        _running = false
        window.setTimeout(_start, 0)
      }
    }
  } catch (err) {
    let state, error
    const interpreter = _priorityStep ? _priorityInterpreter : _interpreter
    if (!(err instanceof DeclickError)) {
      error = new DeclickError(err, interpreter.stateStack)
    } else {
      error = err
    }
    _stop(interpreter.getGlobalScope())

    if (_errorHandler != null) {
      _errorHandler(error)
    } else {
      throw error
    }
  }
}

let _start = function() {
  if (!_running) {
    _stepCount = 0
    _run()
  }
}

let _stop = function(scope) {
  _running = false
  _interpreter.reset(scope)
  _priorityInterpreter.reset(_interpreter.getGlobalScope())
  _interpreter.paused_ = false
  _priorityInterpreter.paused_ = false
  _priorityStatementsAllowed = true
}

let _clear = function() {
  _stop()
}

let _appendStatements = function(
  interpreter,
  statements,
  parameters,
  callback,
) {
  if (parameters != null) {
    for (let i = 0; i < parameters.length; i++) {
      parameters[i] = data.toInterpreterData(parameters[i])
    }
  }
  interpreter.appendStatements(statements, parameters, callback)
}

let _insertStatements = function(
  interpreter,
  statements,
  parameters,
  callback,
) {
  if (typeof parameters !== 'undefined') {
    for (let i = 0; i < parameters.length; i++) {
      parameters[i] = data.toInterpreterData(parameters[i])
    }
  }
  interpreter.insertStatements(statements, parameters, callback)
}

export default {
  /*setLog(element) {
    _log = element;
  },*/

  setErrorHandler(handler) {
    _errorHandler = handler
  },
  // LIFECYCLE MANAGEMENT

  start() {
    _start()
  },

  interrupt() {
    // TODO: la ligne suivante est-elle vraiment nécessaire ?
    //_interpreter.stateStack.pop();
    _priorityInterpreter.stateStack.push({
      node: { type: 'InterruptStatement' },
      priority: true,
      done: false,
    })
  },

  clear() {
    _clear()
  },

  suspend(keepPriorityOn = false) {
    _interpreter.paused_ = true
    if (!keepPriorityOn) {
      _priorityInterpreter.paused_ = true
    }
  },

  resume() {
    if (_interpreter.paused_) {
      _interpreter.paused_ = false
      if (_priorityInterpreter.paused_) {
        _priorityInterpreter.paused_ = false
      }
      _start()
    }
  },

  stop() {
    _stop()
  },

  // STATEMENTS MANAGEMENT

  addStatements(statements, parameters, callback) {
    if (!Array.isArray(statements)) {
      statements = statements.body
    }
    _appendStatements(_interpreter, statements, parameters, callback)
    _start()
  },

  allowPriorityStatements() {
    _priorityStatementsAllowed = true
  },

  refusePriorityStatements() {
    _priorityStatementsAllowed = false
  },

  addPriorityStatements(statements, parameters, callback) {
    if (_priorityStatementsAllowed) {
      if (!Array.isArray(statements)) {
        statements = statements.body
      }
      _appendStatements(_priorityInterpreter, statements, parameters, callback)
      _start()
    }
  },

  // TODO: est-ce qu'on gère le cas d'un Programme ?
  insertStatements(statements, parameters, callback) {
    _insertStatements(_interpreter, statements, parameters, callback)
    _start()
  },

  // TODO: voir si on s'en sert
  insertBlockStatement(blockStatement) {
    _interpreter.insertBlock(blockStatement)
    _start()
  },

  // TODO: est-ce qu'on gère le cas d'un Programme
  insertPriorityStatements(statements, parameters, callback) {
    if (_priorityStatementsAllowed) {
      _insertStatements(_priorityInterpreter, statements, parameters, callback)
      _start()
    }
  },

  initialize(interpreter) {
    _interpreter = interpreter
    _priorityInterpreter = new Interpreter('')
    _priorityInterpreter.setGlobalScope(_interpreter.getGlobalScope())
  },

  getLastValue() {
    return _priorityStep
      ? _priorityInterpreter.getLastValue()
      : _interpreter.getLastValue()
  },
}
