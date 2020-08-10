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

const _getErrorMessage = function(type, value) {
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

const checkTypes = function(types) {
  return function(target, name, descriptor) {
    const originalMethod = descriptor.value
    descriptor.value = function(...args) {
      types.forEach((type, index) => {
        const argument = args[index]
        if (!_checkType(type, argument)) {
          throw {
            declickObjectError: _getErrorMessage(type, argument),
          }
        }
      })
      originalMethod.apply(this, args)
    }
    return descriptor
  }
}
export { checkTypes }
