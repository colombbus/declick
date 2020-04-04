//replaced by webpack
const classes = __CLASSES__
const instances = __INSTANCES__
import { i18nConfig } from 'es2015-i18n-tag'
import 'reflect-metadata'

function _getAllTranslatedMethodNames(aPrototype) {
  const translatedMethods = new Map()
  do {
    const keys = Reflect.ownKeys(aPrototype)
    keys.forEach(key => {
      const translatedValue = Reflect.getMetadata('translated', aPrototype, key)
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
        const sources = classes
          .map(className => `./classes/${className}`)
          .concat(instances.map(className => `./instances/${className}`))

        const loaders = sources.map(source =>
          import(source).then(({ default: importedClass }) => {
            importedClass.prototype._declickId_ = source.slice(2, -3)
            return {
              instance: Reflect.getMetadata('instance', importedClass),
              name: Reflect.getMetadata('translated', importedClass),
              object: importedClass,
              methods: _getAllTranslatedMethodNames(importedClass.prototype),
            }
          }),
        )
        return Promise.all(loaders)
      },
    )
  },
}
