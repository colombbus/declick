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
    return import('../../src/classes/list').then(({default: List}) => {
      assert.equal(Reflect.getMetadata('translated', List), 'Liste')
    })
  })

  it('should have an exposed add method', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../../src/classes/list').then(({default: List}) => {
      assert.equal(Reflect.getMetadata('translated', List.prototype, 'add'), 'ajouter')
      assert.equal(Reflect.getMetadata('help', List.prototype, 'add'), 'ajouter()')
    })
  })

    it('should have an exposed remove method', () => {
    i18nConfig({
      locales: 'fr-FR',
      translations: frenchTranslations,
    })
    return import('../../src/classes/list').then(({default: List}) => {
      assert.equal(Reflect.getMetadata('translated', List.prototype, 'remove'), 'supprimerDeLaListe')
      assert.equal(Reflect.getMetadata('help', List.prototype, 'remove'), 'supprimerDeLaListe()')
    })
  })

  it('should count length of list', () => {
    return import('../../src/classes/list').then(({default: List}) => {
      let anObject = new List()
      assert.equal(anObject.getSize(),0)
    })
  })

  it('should add in element list', () => {
    return import('../../src/classes/list').then(({default: List}) => {
      let anObject = new List()
      anObject.add("1")
      anObject.add("2")
      assert.equal(anObject.getSize(),2)
    })
  })
  
  it('should check if List have element', () => {
    return import('../../src/classes/list').then(({default: List}) => {
      let anObject = new List()
      anObject.add("12345")
      anObject.add("54321")
      assert.equal(anObject.has("12345"),true)
    })
  })
    
  it('should remove element', () => {
    return import('../../src/classes/list').then(({default: List}) => {
      let anObject = new List()
      anObject.add("12345")
      anObject.add("54321")
      anObject.remove("12345")
      assert.equal(anObject.has("12345"), false)
    })
  })
  
  it('should true if List has objects', () => {
    return import('../../src/classes/list').then(({default: List}) => {
      let anObject = new List()
      anObject.add("12345")
      anObject.remove("12345")
      assert.equal(anObject.hasObjects(), false)
    })
  })

  it('should return first item', () => {
    return import('../../src/classes/list').then(({default: List}) => {
      let anObject = new List()
      anObject.add("12345")
      anObject.add("54321")
      anObject.add("09876")

      assert.equal(anObject.getNextObject(), "12345")
    })
  })

  it('should true if List has objects', () => {
    return import('../../src/classes/list').then(({default: List}) => {
      let anObject = new List()
      anObject.add("12345")
      anObject.add("54321")
      anObject.add("09876")

      anObject.modify(0,"09876")

      assert.equal(anObject.getNextObject(), "09876")
    })
  })

  it('should empty List', () => {
    return import('../../src/classes/list').then(({default: List}) => {
      let anObject = new List()
      anObject.add("12345")
      anObject.add("54321")
      anObject.add("09876")

      anObject.void()
      
      assert.equal(anObject.getSize(), 0)
    })
  })

  it('should return true if list equal to list have at least one object in common.', () => {
    return import('../../src/classes/list').then(({default: List}) => {
      let anObject = new List()
      anObject.add("12345")
      anObject.add("54321")
      anObject.add("09876")

      assert.equal(anObject.has("54321"), true)
    })
  })

  it('should return true if list equal to list have at least one object in common.', () => {
    return import('../../src/classes/list').then(({default: List}) => {
      let anObject = new List()
      anObject.add("12345")
      anObject.add("54321")
      anObject.add("09876")

      let anObject2 = new List()
      anObject2.add("09876")
      anObject2.add("QWERT")
      anObject2.add("AZERT")

      assert.equal(anObject.hasIn(anObject2), true)
    })
  })

  it('should return next item in array', () => {
    return import('../../src/classes/list').then(({default: List}) => {
      let anObject = new List()
      anObject.add("12345")
      anObject.add("54321")
      anObject.add("09876")

      assert.equal(anObject.getNextObject(), "12345")
    })
  })

  it('should return next item in array', () => {
    return import('../../src/classes/list').then(({default: List}) => {
      let anObject = new List()
      anObject.add("12345")
      anObject.add("54321")
      anObject.add("09876")

      assert.equal(anObject.getObject(2), "54321")
    })
  })

})
