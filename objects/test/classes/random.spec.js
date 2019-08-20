/*eslint-env mocha */
import { assert } from 'chai'
import { i18nConfig } from 'es2015-i18n-tag'
import frenchTranslations from '../../translations/translation.fr.json'
import 'reflect-metadata'

describe('When List is instantiated', () => {
  
  it('should have an exposed name', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../../src/classes/random').then(({default: Random}) => {
      assert.equal(Reflect.getMetadata('translated', Random), 'Hasard')
    })
  })

  it('should have an exposed throwDice method', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../../src/classes/random').then(({default: Random}) => {
      assert.equal(Reflect.getMetadata('translated', Random.prototype, 'throwDice'), 'jeterDé')
      assert.equal(Reflect.getMetadata('help', Random.prototype, 'throwDice'), 'jeterDé(6)')
    })
  })

  it('should return int between max and 1', () => {
    return import('../../src/classes/random').then(({default: Random}) => {
      let anObject = new Random()
      assert.equal(anObject.throwDice(1),1)
    })
  })


})
