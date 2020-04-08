import i18n, { i18nConfig } from 'es2015-i18n-tag'

import _data from './data'
import _graphics from './graphics'
import _parser from './parser'
import _scheduler from './scheduler'

let _interpreter = null

export default {
  initialize(locale, objects) {
    const instances = []

    return import(`../translations/translation.${locale}.json`).then(
      translations => {
        i18nConfig({
          locales: locale,
          translations: translations,
        })

        _parser.setRepeatKeyword(i18n`repeat`)

        objects.forEach(objectData => {
          if (objectData.instance) {
            const instance = new objectData.object()
            instance.setRuntime(this)
            _data.addInstance(objectData.name, instance, objectData.methods)
            instances.push(instance)
          } else {
            objectData.object.setRuntime(this)
            _data.addClass(
              objectData.name,
              objectData.object,
              objectData.methods,
            )
          }
        })

        _interpreter = _data.createInterpreter()
        _scheduler.initialize(_interpreter)

        instances.forEach(instance => {
          instance.dispatch('runtimeInitialized')
        })
      },
    )
  },

  getDeclickObjectName(reference) {
    if (reference.objectName == null) {
      reference.objectName = _data.findInterpreterObjectName(reference)
    }
    return reference.objectName
  },

  suspend() {
    _scheduler.suspend()
  },

  resume() {
    _scheduler.resume()
  },

  clear() {
    _data.clear()
    _scheduler.clear()
    _graphics.clear()
  },

  executeCode(code, callback) {
    _scheduler.addStatements(_parser.parse(code), null, callback)
  },

  executeStatements(statements, callback) {
    _scheduler.addStatements(statements, null, callback)
  },

  executePriorityCode(code) {
    _scheduler.addPriorityStatements(_parser.parse(code))
  },

  executePriorityStatements(statements) {
    _scheduler.addPriorityStatements(statements)
  },

  getStatements(code) {
    return _parser.parse(code)
  },

  getLastValue() {
    return _scheduler.getLastValue()
  },

  reset() {
    _scheduler.clear()
    _data.reset()
    _graphics.clear()
  },

  addObject(object) {
    _data.registerObject(object)
  },

  deleteObject(object) {
    _data.deleteObject(object)
  },

  addInstance(object) {
    _data.registerInstance(object)
  },

  initDisplay(canvas, container) {
    _graphics.initialize(canvas, container)
  },

  resizeDisplay() {
    _graphics.resize()
  },

  getGraphics() {
    return _graphics
  },

  exposeProperties(object, properties) {
    _data.exposeProperties(object, properties)
  },

  parse(code) {
    return _parser.parse(code)
  },
}
