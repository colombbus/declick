//replaced by webpack
const classes = __CLASSES__
import { i18nConfig } from 'es2015-i18n-tag'
import 'reflect-metadata'

function _getAllTranslatedMethodNames(aPrototype) {
  const translatedMethods = new Map()
  do {
    const keys = Reflect.ownKeys(aPrototype)
    keys.forEach(key => {
      let translatedValue = Reflect.getMetadata('translated', aPrototype, key)
      if (translatedValue) {
        translatedMethods.set(translatedValue, key)
      }
    })
  } while ((aPrototype = Reflect.getPrototypeOf(aPrototype)))
  return translatedMethods
}

export default {
  load(locale) {
    return import(`../translations/translation.${locale}.json`).then(
      translations => {
        i18nConfig({
          locales: locale,
          translations: translations,
        })
        const classesLoaders = classes.map(className =>
          import(`./classes/${className}`).then(
            ({ default: importedClass }) => {
              importedClass.prototype.declickObject = className.slice(0, -3)
              return {
                object: importedClass,
                name: Reflect.getMetadata('translated', importedClass),
                methods: _getAllTranslatedMethodNames(importedClass.prototype),
              }
            },
          ),
        )
        return Promise.all(classesLoaders)
      },
    )
  },
}
