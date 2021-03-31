import fs from 'fs'
import path from 'path'
import { warn } from '../../lib/dev-logger'

export const removeExpressions = (value) =>
  value && value.replace(/\${([^}]+?)}/g, '${}')

const removeSubstitutions = (obj) => {
  return Object.keys(obj).reduce((out, key) => {
    out[removeExpressions(key)] = removeExpressions(obj[key])
    return out
  }, {})
}

const readDictionaries = () => {
  return fs.readdirSync(__dirname).reduce((obj, dir) => {
    const pathToDirectory = path.join(__dirname, dir)
    if (fs.statSync(pathToDirectory).isDirectory()) {
      obj[dir] = fs
        .readdirSync(pathToDirectory)
        .filter((file) => file.endsWith('.json'))
        .map((file) => file.split('.')[0])
        .reduce((localJson, file) => {
          localJson[file] = removeSubstitutions(
            // eslint-disable-next-line import/no-dynamic-require
            require(path.join(__dirname, dir, file))
          )
          return localJson
        }, {})
    }
    return obj
  }, {})
}

const createLocaleDictionary = (defaultDictionary, localeDictionary = {}) => {
  return Object.keys(defaultDictionary)
    .map(removeExpressions)
    .reduce((dictionary, key) => {
      dictionary[key] = localeDictionary[key] || defaultDictionary[key]
      return dictionary
    }, {})
}

const createBrandDictionary = (defaultDictionary, brandDictionary) => {
  return Object.keys(defaultDictionary).reduce((dictionary, locale) => {
    const defaultLocaleDictionary =
      locale === 'en-US'
        ? Object.assign(
            {},
            defaultDictionary['en-GB'],
            defaultDictionary[locale]
          )
        : defaultDictionary[locale]
    dictionary[locale] = createLocaleDictionary(
      defaultLocaleDictionary,
      brandDictionary[locale]
    )
    return dictionary
  }, {})
}

const checkKeysInclude = (superset, subset, locale) => {
  if (process.env.SHOW_MISSING_LOCALISATION) {
    subset.forEach((key) => {
      if (!superset.includes(key)) {
        warn(`'${key}' does not exist in '${locale}' dictionary`)
      }
    })
  }
}

const checkInconsistencies = (dictionary) => {
  const defaultDictionary = dictionary.default
  const locales = Object.keys(defaultDictionary).filter(
    (locale) => locale !== 'en-US'
  )
  const keys = Array.from(
    new Set(
      locales.reduce(
        (keys, locale) => keys.concat(Object.keys(defaultDictionary[locale])),
        []
      )
    )
  )

  // every default locale has to have the same keys
  locales.forEach((locale) => {
    const localeKeys = Object.keys(defaultDictionary[locale])
    checkKeysInclude(localeKeys, keys, locale)
  })

  // every key in every brand locale has to be present in the default ones
  const brands = Object.keys(dictionary).filter((brand) => brand !== 'default')
  brands.forEach((brand) => {
    const brandLocales = Object.keys(dictionary[brand])
    brandLocales.forEach((locale) => {
      const localeKeys = Object.keys(dictionary[brand][locale])
      checkKeysInclude(keys, localeKeys, locale)
    })
  })

  // every key in en-US has to be in the default one
  checkKeysInclude(keys, Object.keys(defaultDictionary['en-US']), 'en-GB')
}

const createDictionary = () => {
  const preParsedDictionary = readDictionaries()
  checkInconsistencies(preParsedDictionary)
  const defaultDictionary = preParsedDictionary.default

  return Object.keys(preParsedDictionary)
    .filter((brand) => brand !== 'default')
    .reduce((dictionary, brand) => {
      dictionary[brand] = createBrandDictionary(
        defaultDictionary,
        preParsedDictionary[brand]
      )
      return dictionary
    }, {})
}

export default createDictionary()
