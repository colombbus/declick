/*eslint-env mocha */
import { assert } from 'chai'
import { i18nConfig } from 'es2015-i18n-tag'
import frenchTranslations from '../../translations/translation.fr.json'
import 'reflect-metadata'

describe('When declick is instantiated', () => {
  it('should have an exposed name', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../../src/instances/declick').then(({default: DeclickClass}) => {
      assert.equal(Reflect.getMetadata('translated', DeclickClass), 'declick')
    })
  })

  it('should have an exposed write method', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../../src/instances/declick').then(({default: DeclickClass}) => {
      assert.equal(Reflect.getMetadata('translated', DeclickClass.prototype, 'write'), 'écrire')
      assert.equal(Reflect.getMetadata('help', DeclickClass.prototype, 'write'), 'écrire("texte")')
    })
  })

})
