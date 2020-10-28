import _data from './data'
import _scheduler from './scheduler'
import _parser from './parser'
import _graphics from './graphics'
import i18n, { i18nConfig } from 'es2015-i18n-tag'

let _interpreter = null

export default {
  initialize(locale, objects) {
    const instances = []

    return import(`../translations/translation.${locale}.json`).then(
      ({ default: translations }) => {
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
            if (typeof objectData.object.setup === 'function') {
              objectData.object.setup()
            }
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

  getDeclickObject(name) {
    return _data.findInterpreterObject(name)
  },

  stop() {
    _data.stop()
    _scheduler.clear()
  },

  suspend(keepPriorityOn) {
    _scheduler.suspend(keepPriorityOn)
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

  executeStatements(statements, parameters, callback) {
    _scheduler.addStatements(statements, parameters, callback)
  },

  executePriorityCode(code) {
    _scheduler.addPriorityStatements(_parser.parse(code))
  },

  executePriorityStatements(statements, parameters, callback) {
    _scheduler.addPriorityStatements(statements, parameters, callback)
  },

  getStatements(code) {
    return _parser.parse(code)
  },

  getLastValue() {
    return _scheduler.getLastValue()
  },
  reset() {
    _scheduler.clear()
    _data.clear()
    _graphics.reset()
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

  initDisplay(container, displayType = false) {
    return _graphics.initialize(container, displayType)
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

  startGraphics() {
    return _graphics.start()
  },

  createCallStatement(functionStatement) {
    return _interpreter.createCallStatement(functionStatement)
  },

  addImageResource(name, image) {
    _graphics.addResource('image', name, image)
  },

  addImageResources(data) {
    for (let [name, image] of data) {
      _graphics.addResource('image', name, image)
    }
  },

  addSpriteSheetResource(name, texture, atlas) {
    _graphics.addResource('atlas', name, texture, atlas)
  },

  addSpriteSheetResources(data) {
    for (let [name, spriteSheetData] of data) {
      _graphics.addResource('atlas', name, ...spriteSheetData)
    }
  },

  addMapResource(name, map) {
    _graphics.addResource('tilemapTiledJSON', name, map)
  },

  addMapResources(data) {
    for (let [name, map] of data) {
      _graphics.addResource('tilemapTiledJSON', name, map)
    }
  },

  setErrorHandler(handler) {
    _scheduler.setErrorHandler(handler)
    _parser.setErrorHandler(handler)
  },

  addExternalFunction(name, body) {
    _data.addFunction(name, body)
  },
}
