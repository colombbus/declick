export function expose(name, helpText) {
  return function(target, key, descriptor) {
    if (target.exposed == null) {
      target.exposed = {}
    }
    target.exposed[name] = { method: key, help: helpText }
    return descriptor
  }
}

export function translate(name) {
  return function decorator(target) {
    Object.getPrototypeOf(target).className = name
  }
}
