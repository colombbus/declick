//replaced by webpack
const classes = __CLASSES__
import { i18nConfig } from 'es2015-i18n-tag'

export default {
  load(locale) {
    return import(`../translations/translation.${locale}.json`).then(
      translations => {
        i18nConfig({
          locales: locale,
          translations: translations,
        })
        let classesLoaders = classes.map(className =>
          import(`./classes/${className}`).then(
            importedClass => importedClass.default,
          ),
        )
        return Promise.all(classesLoaders)
      },
    )
  },
}
