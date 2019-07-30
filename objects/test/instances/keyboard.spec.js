import { assert } from 'chai'
import { i18nConfig } from 'es2015-i18n-tag'
import frenchTranslations from '../../translations/translation.fr.json'
import 'reflect-metadata'

describe.only('When keyboard is instantiated', () => {
  it('should have an exposed name', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../../src/instances/keyboard').then(
      ({ default: KeyboardClass }) => {
        assert.equal(
          Reflect.getMetadata('translated', KeyboardClass),
          'clavier',
        )
      },
    )
  })

  it('should send to runtime properties to expose', () => {
    let properties = null
    const runtime = {
      exposeProperties(value) {
        properties = value
      },
      addInstance() {},
    }
    return import('../../src/instances/keyboard').then(
      ({ default: KeyboardClass }) => {
        const keyboard = new KeyboardClass()
        keyboard.setRuntime(runtime)
        keyboard.dispatch('runtimeInitialized')
        assert.isNotNull(properties)
      },
    )
  })
})
