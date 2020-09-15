//replaced at build time
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

function _loadImportedClass(importedClass, source) {
  importedClass.prototype._declickId_ = source
  return {
    instance: Reflect.getMetadata('instance', importedClass),
    name: Reflect.getMetadata('translated', importedClass),
    object: importedClass,
    methods: _getAllTranslatedMethodNames(importedClass.prototype),
  }
}

export default {
  load(locale) {
    return import(`../translations/translation.${locale}.json`).then(
      ({ default: translations }) => {
        i18nConfig({
          locales: locale,
          translations: translations,
        })
        const classLoaders = classes.map(className =>
          import(`./classes/${className}.js`).then(
            ({ default: importedClass }) => {
              return _loadImportedClass(importedClass, `classes/${className}`)
            },
          ),
        )
        const instanceLoaders = instances.map(className =>
          import(`./instances/${className}.js`).then(
            ({ default: importedClass }) => {
              return _loadImportedClass(importedClass, `instances/${className}`)
            },
          ),
        )
        return Promise.all(classLoaders.concat(instanceLoaders))
      },
    )
  },
}
