import i18n from 'es2015-i18n-tag'
import BaseInstance from '../base-instance'
import 'reflect-metadata'

const keyCodes = new Map([
  ['backspace', [0]],
  ['tab', [9]],
  ['return', [13]],
  ['shift', [16]],
  ['ctrl', [17]],
  ['alt', [18]],
  ['pausebreak', [19]],
  ['capslock', [20]],
  ['escape', [27]],
  [' ', [32]],
  ['pageup', [33]],
  ['pagedown', [34]],
  ['end', [35]],
  ['home', [36]],
  ['left', [37]],
  ['up', [38]],
  ['right', [39]],
  ['down', [40]],
  ['+', [43, 107]],
  ['printscreen', [44]],
  ['insert', [45]],
  ['delete', [46]],
  ['0', [48, 96]],
  ['1', [49, 97]],
  ['2', [50, 98]],
  ['3', [51, 99]],
  ['4', [52, 100]],
  ['5', [53, 101]],
  ['6', [54, 102]],
  ['7', [55, 103]],
  ['8', [56, 104]],
  ['9', [57, 105]],
  [';', [59, 186]],
  ['=', [61, 187]],
  ['a', [65]],
  ['b', [66]],
  ['c', [67]],
  ['d', [68]],
  ['e', [69]],
  ['f', [70]],
  ['g', [71]],
  ['h', [72]],
  ['i', [73]],
  ['j', [74]],
  ['k', [75]],
  ['l', [76]],
  ['m', [77]],
  ['n', [78]],
  ['o', [79]],
  ['p', [80]],
  ['q', [81]],
  ['r', [82]],
  ['s', [83]],
  ['t', [84]],
  ['u', [85]],
  ['v', [86]],
  ['w', [87]],
  ['x', [88]],
  ['y', [89]],
  ['z', [90]],
  ['*', [106]],
  ['-', [109, 189]],
  ['.', [110, 190]],
  ['/', [111, 191]],
  ['f1', [112]],
  ['f2', [113]],
  ['f3', [114]],
  ['f4', [115]],
  ['f5', [116]],
  ['f6', [117]],
  ['f7', [118]],
  ['f8', [119]],
  ['f9', [120]],
  ['f10', [121]],
  ['f11', [122]],
  ['f12', [123]],
  ['numlock', [144]],
  ['scrolllock', [145]],
  [',', [188]],
  ['`', [192]],
  ['[', [219]],
  ['\\', [220]],
  [']', [221]],
  ["'", [222]],
])

const keyTranslations = new Map([
  ['return', i18n`return`],
  ['capslock', i18n`capslock`],
  ['escape', i18n`escape`],
  [' ', i18n` `],
  ['left', i18n`left`],
  ['up', i18n`up`],
  ['right', i18n`right`],
  ['down', i18n`down`],
  ['insert', i18n`insert`],
  ['delete', i18n`delete`],
])

const keyNames = new Map()

for (let [name, codes] of keyCodes.entries()) {
  codes.forEach(code => {
    keyNames.set(code, name)
  })
}

@Reflect.metadata('translated', i18n`keyboard`)
class KeyboardClass extends BaseInstance {
  constructor() {
    super()
    this._keyCodes = new Map([...keyNames.keys()].map(code => [code, false]))
    const exposedProperties = []

    for (let name of keyCodes.keys()) {
      const keyName = `_key_${name}`
      this[keyName] = false
      exposedProperties.push({
        name: keyName,
        exposedName: keyTranslations.has(name)
          ? keyTranslations.get(name)
          : name,
      })
    }
    this.addListener('runtimeInitialized', () => {
      this._runtime.exposeProperties(this, exposedProperties)
      window.addEventListener('keydown', event => {
        this._processKeyDown(event)
      })
      window.addEventListener('keyup', event => {
        this._processKeyUp(event)
      })
    })
  }

  _processKeyDown(event) {
    const code = event.keyCode
    if (keyNames.has(code)) {
      const name = keyNames.get(code)
      this[`_key_${name}`] = true
      this._keyCodes.set(code, true)
    }
  }

  _processKeyUp(event) {
    const code = event.keyCode
    if (keyNames.has(code)) {
      const name = keyNames.get(code)
      this[`_key_${name}`] = false
      this._keyCodes.set(code, false)
    }
  }
}

export default KeyboardClass
