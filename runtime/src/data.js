import Interpreter from './interpreter'
// Private properties

//let _log = null;
const _classes = new Map()
// classes without constructor
const _classStructures = new Map()
const _instances = new Map()
const _functions = new Map()
let _interpreter = null
let _stored = false
let _registeredObjects = []
let _registeredInstances = []

// Private methods

let _toNativeData = function(data) {
  let result
  if (data.type) {
    if (data.type === 'function') {
      return data
    } else if (typeof data.data !== 'undefined') {
      // primitive data or declick objects
      return data.data
    } else if (data.type === 'object') {
      if (typeof data.length !== 'undefined') {
        // we are in an array
        result = []
        for (let i = 0; i < data.length; i++) {
          result.push(_toNativeData(data.properties[i]))
        }
        return result
      }
      result = {}
      for (let member in data.properties) {
        result[member] = _toNativeData(data.properties[member])
      }
      return result
    }
  }
  return data
}

let _toInterpreterData = function(interpreter, data) {
  let result
  if (data instanceof Array) {
    // Array
    result = interpreter.createObject(interpreter.ARRAY)
    data.forEach((element, index) => {
      interpreter.setProperty(
        result,
        index,
        _toInterpreterData(interpreter, element),
      )
    })
    return result
  } else if (typeof data === 'object') {
    // Object
    if (data._declickId_ != null && _classStructures.has(data._declickId_)) {
      // declick object: wrap it
      let result = interpreter.createObject(
        _classStructures.get(data._declickId_),
      )
      result.data = data
      return result
    }
    return interpreter.createObject(data)
  }
  // Primitive types
  return interpreter.createPrimitive(data)
}

let _getMethodWrapper = function(interpreter, method) {
  return function() {
    // transform data from interpreter into actual data
    let args = [...arguments].map(argument => {
      return _toNativeData(argument)
    })
    return _toInterpreterData(interpreter, method.apply(this.data, args))
  }
}

let _toInterpreterClass = function(interpreter, classObject, classMethods) {
  const classId = classObject.prototype._declickId_
  // 1st prototype
  let interpreterClass = interpreter.createObject(interpreter.FUNCTION)
  classMethods.forEach((classMethod, methodName) => {
    interpreter.setProperty(
      interpreterClass.properties.prototype,
      methodName,
      interpreter.createNativeFunction(
        _getMethodWrapper(interpreter, classObject.prototype[classMethod]),
      ),
    )
  })

  // store class prototype to be able to create interpreter objects from native ones
  _classStructures.set(classId, interpreterClass)

  // 2nd constructor
  let constructor = function() {
    let instance = interpreter.createObject(interpreterClass)
    let args = [...arguments].map(argument => {
      return _toNativeData(argument)
    })
    instance.data = new classObject(...args)
    return instance
  }
  return interpreter.createNativeFunction(constructor)
}

let _toInterpreterInstance = function(interpreter, object, methods) {
  const interpreterInstance = interpreter.createObject(interpreter.FUNCTION)
  interpreterInstance.data = object
  methods.forEach((instanceMethod, methodName) => {
    interpreter.setProperty(
      interpreterInstance,
      methodName,
      interpreter.createNativeFunction(
        _getMethodWrapper(interpreter, object[instanceMethod]),
      ),
    )
  })
  return interpreterInstance
}

let _toInterpreterFunction = function(interpreter, body) {
  return interpreter.createNativeFunction(_getMethodWrapper(interpreter, body))
}

let _deleteInterpreterObject = function(interpreter, reference) {
  let scope = interpreter.getScope()
  while (scope) {
    for (let name in scope.properties) {
      let obj = scope.properties[name]
      if (!scope.notWritable[name] && obj.data) {
        if (obj.data === reference) {
          interpreter.deleteProperty(scope, name)
          return true
        }
      }
    }
    scope = scope.parentScope
  }
  return false
}
/*let _logCommand = function(command) {
  if (typeof _log !== 'undefined') {
    _log.addCommand(command);
  }
};*/

let data = {
  createInterpreter() {
    _interpreter = new Interpreter('', (interpreter, scope) => {
      // at first launch, create and store interpreter instances, classes and functions
      if (!_stored) {
        Array.from(_instances).forEach(([name, instanceData]) => {
          _instances.set(
            name,
            _toInterpreterInstance(
              interpreter,
              instanceData.object,
              instanceData.methods,
            ),
          )
        })
        Array.from(_classes).forEach(([name, classData]) => {
          _classes.set(
            name,
            _toInterpreterClass(
              interpreter,
              classData.object,
              classData.methods,
            ),
          )
        })
        Array.from(_functions).forEach(([name, body]) => {
          _functions.set(name, _toInterpreterFunction(interpreter, body))
        })
        _stored = true
      }

      // #1 Declare instances
      _instances.forEach((interpreterInstance, name) => {
        interpreter.setProperty(scope, name, interpreterInstance, {
          writable: false,
        })
      })

      // #2 Declare classes
      _classes.forEach((interpreterClass, name) => {
        interpreter.setProperty(scope, name, interpreterClass, {
          writable: false,
        })
      })

      // #3 Declare functions
      _functions.forEach((interpreterBody, name) => {
        interpreter.setProperty(scope, name, interpreterBody, {
          writable: false,
        })
      })
    })

    return _interpreter
  },

  toInterpreterData(data) {
    return _toInterpreterData(_interpreter, data)
  },

  toNativeData(data) {
    return _toNativeData(data)
  },

  addClass(name, object, methods) {
    _classes.set(name, { object: object, methods: methods })
  },

  addInstance(name, object, methods) {
    _instances.set(name, { object: object, methods: methods })
  },

  addFunction(name, body) {
    if (_interpreter == null) {
      _functions.set(name, body)
    } else {
      const interpreterBody = _toInterpreterFunction(_interpreter, body)
      _functions.set(name, interpreterBody)
      let scope = _interpreter.getScope()
      while (scope.parentScope) {
        scope = scope.parentScope
      }
      _interpreter.setProperty(scope, name, interpreterBody, {
        writable: false,
      })
    }
  },

  getClass(name) {
    if (_classes.has(name)) {
      return _classes.get(name)
    }
    return null
  },

  findInterpreterObject(name) {
    try {
      let obj = _interpreter.getValueFromScope(name)
      if (obj && obj.data) {
        return obj.data
      }
      return null
    } catch (err) {
      return null
    }
  },

  findInterpreterObjectName(reference) {
    let scope = _interpreter.getScope()
    while (scope) {
      for (let name in scope.properties) {
        let obj = scope.properties[name]
        if (obj.data && obj.data === reference) {
          return name
        }
      }
      scope = scope.parentScope
    }
    return null
  },

  deleteInterpreterObject(reference) {
    return _deleteInterpreterObject(_interpreter, reference)
  },

  exposeProperties(reference, properties) {
    let scope = _interpreter.getScope()
    const getPropertyWrapper = function(propertyName) {
      return function() {
        return _toInterpreterData(_interpreter, this.data[propertyName])
      }
    }
    while (scope) {
      for (let name in scope.properties) {
        const obj = scope.properties[name]
        if (obj.data === reference) {
          properties.forEach(property => {
            const prop = _interpreter.createObject(null)
            prop.dynamic = getPropertyWrapper(property.name)
            _interpreter.setProperty(obj, property.exposedName, prop)
          })
          return true
        }
      }
      scope = scope.parentScope
    }
    return false
  },

  clear() {
    //TODO: à améliorer
    while (_registeredObjects.length > 0) {
      _registeredObjects[0].delete()
    }
    _registeredInstances.forEach(instance => instance.dispatch('clear'))
  },

  reset() {
    _classes.clear()
    _classStructures.clear()
    _instances.clear()
    _functions.clear()
    _registeredObjects = []
    _registeredInstances = []
    _interpreter = null
    _stored = false
  },

  registerObject(object) {
    _registeredObjects.push(object)
  },

  deleteObject(object) {
    _deleteInterpreterObject(_interpreter, object)
    _registeredObjects.splice(_registeredObjects.indexOf(object), 1)
  },

  registerInstance(object) {
    _registeredInstances.push(object)
  },
}

// TODO: à bouger et à comprendre
/*Object.defineProperty(data, 'output', {
  get() {
    return _interpreter.value;
  }
});*/

export default data
