import i18n from 'es2015-i18n-tag'

const _types = {
  integer: {
    check: value => Number.isInteger(value),
    typeMessage: value => i18n`integer value expected ${value}`,
    missingMessage: i18n`missing integer argument`,
  },
  string: {
    check: value => typeof value === 'string' || value instanceof String,
    typeMessage: value => i18n`string value expected ${value}`,
    missingMessage: i18n`missing string argument`,
  },
  array: {
    check: value => Array.isArray(value),
    typeMessage: value => i18n`array value expected ${value}`,
    missingMessage: i18n`missing array argument`,
  },
  number: {
    check: value => typeof value === 'number' && isFinite(value),
    typeMessage: value => i18n`number value expected ${value}`,
    missingMessage: i18n`missing number argument`,
  },
  boolean: {
    check: value => typeof value === 'boolean',
    typeMessage: value => i18n`boolean value expected ${value}`,
    missingMessage: i18n`missing boolean argument`,
  },
  object: {
    check: value =>
      typeof value === 'object' && value._declickId_ !== undefined,
    typeMessage: value => i18n`object value expected ${value}`,
    missingMessage: i18n`missing object argument`,
  },
  function: {
    check: value =>
      typeof value === 'object' &&
      value.type !== undefined &&
      value.type === 'function',
    typeMessage: value => i18n`function value expected ${value}`,
    missingMessage: i18n`missing function argument`,
  },
  canvas: {
    check: value => value instanceof HTMLCanvasElement,
    typeMessage: value => i18n`canvas value expected ${value}`,
    missingMessage: i18n`missing canvas argument`,
  },
  any: {
    check: () => true,
    missingMessage: i18n`missing argument`,
  },
}

const _checkType = function(type, value) {
  return _types[type].check(value)
}

const _checkTypes = function(types, value) {
  return types.find(type => _checkType(type, value)) !== undefined
}

const _getTypeErrorMessage = function(type, value) {
  return _types[type].typeMessage(value)
}

const _getMissingErrorMessage = function(types, skip, length) {
  let messages = []
  for (let i = types.length - skip - length; i < types.length - skip; i++) {
    messages.push(_types[types[i]].missingMessage)
  }
  return messages.join('\n')
}

const checkArguments = function(types, optionalParameters = 0) {
  return function(target, name, descriptor) {
    const originalMethod = descriptor.value
    descriptor.value = function(...args) {
      types.forEach((type, index) => {
        const allowedTypes = type.split('|')
        const argument = args[index]
        if (argument !== undefined && !_checkTypes(allowedTypes, argument)) {
          throw {
            declickObjectError: _getTypeErrorMessage(allowedTypes[0], argument),
          }
        }
      })
      const missingArgsLength = types.length - args.length - optionalParameters
      if (missingArgsLength > 0) {
        throw {
          declickObjectError: _getMissingErrorMessage(
            types,
            optionalParameters,
            missingArgsLength,
          ),
        }
      }
      return originalMethod.apply(this, args)
    }
    return descriptor
  }
}
export { checkArguments }
