import i18n from 'es2015-i18n-tag'

const _checkType = function(type, value) {
  switch (type) {
    case 'integer':
      return Number.isInteger(value)
    case 'string':
      return typeof value === 'string' || value instanceof String
    case 'array':
      return Array.isArray(value)
    case 'number':
      return typeof value === 'number' && isFinite(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'object':
      return (
        typeof value === 'object' &&
        typeof value.constructor._declickId_ !== 'undefined'
      )
    case 'function':
      return typeof value === 'function'
  }
}

const _getTypeErrorMessage = function(type, value) {
  switch (type) {
    case 'integer':
      return i18n`integer value expected ${value}`
    case 'string':
      return i18n`string value expected ${value}`
    case 'array':
      return i18n`array value expected ${value}`
    case 'number':
      return i18n`number value expected ${value}`
    case 'boolean':
      return i18n`boolean value expected ${value}`
    case 'object':
      return i18n`object value expected ${value}`
    case 'function':
      return i18n`function value expected ${value}`
  }
}

const _getMissingErrorMessage = function(types, skip, length) {
  let messages = []
  for (let i = types.length - skip - length; i < types.length - skip; i++) {
    let type = types[i]
    switch (type) {
      case 'integer':
        messages.push(i18n`missing integer argument`)
        break
      case 'string':
        messages.push(i18n`missing string argument`)
        break
      case 'array':
        messages.push(i18n`missing array argument`)
        break
      case 'number':
        messages.push(i18n`missing number argument`)
        break
      case 'boolean':
        messages.push(i18n`missing boolean argument`)
        break
      case 'object':
        messages.push(i18n`missing object argument`)
        break
      case 'function':
        messages.push(i18n`missing function argument`)
        break
    }
  }
  return messages.join('\n')
}

const checkArguments = function(types, optionalParameters = 0) {
  return function(target, name, descriptor) {
    const originalMethod = descriptor.value
    descriptor.value = function(...args) {
      types.forEach((type, index) => {
        const argument = args[index]
        if (argument !== undefined && !_checkType(type, argument)) {
          throw {
            declickObjectError: _getTypeErrorMessage(type, argument),
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
