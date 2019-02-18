export default {
  expose: function(name, helpText) {
    return function(target, key, descriptor) {
      if (target.exposed == null) {
        target.exposed = {}
      }
      target.exposed[name] = { method: key, help: helpText }
      return descriptor
    }
  },
  translate: function(name) {
    return function decorator(target) {
      target.name = name
    }
  },
}
