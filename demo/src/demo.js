import DeclickRuntime from '../../runtime/lib/declick-runtime.js'
import DeclickObjects from '../../objects/lib/declick-objects.js'
import '../node_modules/codemirror/lib/codemirror.css'
import '../node_modules/codemirror/theme/abcdef.css'
import '../node_modules/codemirror/addon/dialog/dialog.css'
import '../node_modules/codemirror/mode/javascript/javascript.js'
import '../node_modules/codemirror/addon/dialog/dialog.js'
import CodeMirror from 'codemirror'

const _images = new Map()
const _spriteSheets = new Map()
const _maps = new Map()
const exampleFiles = __EXAMPLE_FILES__

const exampleNames = exampleFiles.map(file => file.slice(0, -3))

export default {
  getExampleList() {
    return exampleNames.sort()
  },
  loadExample(name) {
    _images.clear()
    _spriteSheets.clear()
    _maps.clear()
    return import(`../examples/${name}.js`).then(
      ({ resources, code, description }) => {
        for (const [name, resource] of Object.entries(resources)) {
          switch (resource[0]) {
            case 'image':
              _images.set(name, `resources/${resource[1]}`)
              break
            case 'spritesheet':
              _spriteSheets.set(name, [
                `resources/${resource[1]}`,
                `resources/${resource[2]}`,
              ])
              break
            case 'map':
              _maps.set(name, `resources/${resource[1]}`)
              break
          }
        }
        return { description, code }
      },
    )
  },
  initialize(container, forceCanvas = false) {
    return DeclickRuntime.initDisplay(container, forceCanvas)
      .then(() => DeclickObjects.load('fr'))
      .then(objects => {
        return DeclickRuntime.initialize('fr', objects)
      })
  },
  reset() {
    DeclickRuntime.reset()
  },
  startGraphics() {
    DeclickRuntime.addImageResources(_images)
    DeclickRuntime.addSpriteSheetResources(_spriteSheets)
    DeclickRuntime.addMapResources(_maps)
    return DeclickRuntime.startGraphics()
  },
  execute(code) {
    return new Promise(resolve => {
      DeclickRuntime.executeCode(code, resolve)
    })
  },
  parse(code) {
    return DeclickRuntime.parse(code)
  },
  getGraphics() {
    return DeclickRuntime.getGraphics()
  },
  getLastValue() {
    return DeclickRuntime.getLastValue()
  },
  getDeclickObject(name) {
    return DeclickRuntime.getDeclickObject(name)
  },
  setErrorHandler(handler) {
    DeclickRuntime.setErrorHandler(handler)
  },
  initializeEditor(element, config) {
    return CodeMirror(element, config)
  },
}
