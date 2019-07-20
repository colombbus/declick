import Interpreter from './interpreter'
// Private properties

//let _log = null;
let _classes = new Map()
// classes without constructor
let _classStructures = {}
let _instances = {}
let _interpreter = null
let _stored = false
let _createdObjects = []

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
    if (
      data.declickObject != null &&
      _classStructures[data.declickObject] != null
    ) {
      // declick object: wrap it
      let result = interpreter.createObject(
        _classStructures[data.declickObject],
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
  const objectName = classObject.prototype.declickObject
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
  _classStructures[objectName] = interpreterClass

  // 2nd listeners
  // TODO: attention à l'héritage, peut-être qu'il ne faut déclarer ça que sur BaseClass ?
  classObject.addListener('create', function() {
    _createdObjects.push(this)
  })
  classObject.addListener('delete', function() {
    _deleteInterpreterObject(interpreter, this)
    _createdObjects.splice(_createdObjects.indexOf(this), 1)
  })

  // 3rd constructor
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

//TODO: modifier ça en fonction des choix pris pour les instances
let _toInterpreterInstance = function(interpreter, instance) {
  let interpreterInstance = interpreter.createObject(interpreter.FUNCTION)
  interpreterInstance.data = instance
  if (instance.exposedMethods != null) {
    for (let name in instance.exposedMethods) {
      interpreter.setProperty(
        interpreterInstance,
        instance.exposedMethods[name],
        interpreter.createNativeFunction(
          _getMethodWrapper(interpreter, instance[name]),
        ),
      )
    }
  }
  return interpreterInstance
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
      let name

      // at first launch, create and store interpreter instances and classes
      if (!_stored) {
        for (name in _instances) {
          _instances[name] = _toInterpreterInstance(
            interpreter,
            _instances[name],
          )
        }
        _classes.forEach((classData, name) => {
          _classes.set(
            name,
            _toInterpreterClass(
              interpreter,
              classData.object,
              classData.methods,
            ),
          )
        })
        _stored = true
      }

      // #1 Declare instances
      for (name in _instances) {
        interpreter.setProperty(scope, name, _instances[name], {
          writable: false,
        })
      }

      // #2 Declare classes
      _classes.forEach((interpreterClass, name) => {
        interpreter.setProperty(scope, name, interpreterClass, {
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

  addInstance(instance, name) {
    _instances[name] = instance
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

  exposeProperty(reference, property, propertyName) {
    let scope = _interpreter.getScope()
    let wrapper = function() {
      return _toInterpreterData(_interpreter, this.data[property])
    }
    while (scope) {
      for (let name in scope.properties) {
        let obj = scope.properties[name]
        if (obj.data === reference) {
          let prop = _interpreter.createObject(null)
          prop.dynamic = wrapper
          _interpreter.setProperty(obj, propertyName, prop)
          return true
        }
      }
      scope = scope.parentScope
    }
    return false
  },

  clear() {
    while (_createdObjects.length > 0) {
      if (_createdObjects[0].deleteObject != null) {
        _createdObjects[0].deleteObject()
      } else {
        _createdObjects.shift()
      }
    }
    for (let name in _instances) {
      if (_instances[name].clear != null) {
        _instances[name].clear()
      }
    }
  },

  reset() {
    _classes.clear()
    _classStructures = {}
    _instances = {}
    _createdObjects = []
    _interpreter = null
    _stored = false
  },
}

// TODO: à bouger et à comprendre
/*Object.defineProperty(data, 'output', {
  get() {
    return _interpreter.value;
  }
});*/

export default data
