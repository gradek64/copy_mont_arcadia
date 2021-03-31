import { error } from './dev-logger'
import RedirectionPrompt from '../components/common/GeoIP/RedirectionPrompt'

const geoIPDictionaryStrings = [...RedirectionPrompt.dictionaryStrings]

let _dictionary
let _geoIPDictionary
let dictionaries

const languageMap = {
  'en-gb': 'en-GB',
  'en-us': 'en-US',
  'en-eu': 'en-GB',
  'de-DE': 'de-DE',
  'fr-fr': 'fr-FR',
}

const interpolate = (string, expressions) => {
  if (typeof string === 'string') {
    let index = 0
    return string.replace(/\${}/g, () => expressions[index++])
  }
}

export const translate = (dictionary, strings, expressions) => {
  if (!strings || !strings.length) return ''

  if (!dictionary) {
    return typeof strings === 'string' ? strings : strings[0]
  }

  let translation
  let key
  if (!expressions.length) {
    key = strings
    translation =
      typeof strings === 'string' ? dictionary[strings] : dictionary[strings[0]]
  } else {
    key = strings.join('${}')
    translation = interpolate(dictionary[key] || key, expressions)
  }

  if (!translation) {
    if (process.env.SHOW_MISSING_LOCALISATION)
      error(`No localisation found for: '${key}'`)
    return typeof strings === 'string' ? strings : strings[0]
  }

  return translation
}

/**
 * Tag function to localise strings
 * usages:
 *   localise`product ${productName} added to bag`
 *   localise`some string without expressions`
 *   localise('some string without expressions')
 */
export function localise(language, brandName, strings, ...expressions) {
  const dictionary =
    _dictionary ||
    (dictionaries[brandName] && dictionaries[brandName][languageMap[language]])

  return translate(dictionary, strings, expressions)
}

export const translateGeoIPTextInPreferredLanguage = (
  preferredLanguage,
  currentSiteLanguage,
  brandName,
  strings,
  ...expressions
) => {
  if (_geoIPDictionary) {
    // client side when user is on a site in diff lang to their geoIP setting
    return translate(_geoIPDictionary, strings, expressions)
  }
  if (_dictionary) {
    // client side when user is on a site in same lang as their geoIP setting
    return translate(_dictionary, strings, expressions)
  }
  // server side:
  const language = preferredLanguage || currentSiteLanguage
  const dictionary =
    dictionaries[brandName] && dictionaries[brandName][languageMap[language]]
  return translate(dictionary, strings, expressions)
}

export function getLocaleDictionary(locale, brand) {
  return dictionaries[brand][languageMap[locale]]
}

const removeExpressions = (value) =>
  value && value.replace(/\${([^}]+?)}/g, '${}')
export function getGeoIPDictionary(brandConfig, language) {
  if (language.slice(0, 1) === brandConfig.language.slice(0, 1))
    /**
     * There's no need for the geoIPDictionary if the site's language is the
     * same as the desired language as translateGeoIPTextInPreferredLanguage
     * falls back to the default dictionary
     * And for this comparison we consider en-GB and en-US equivalent
     */
    return undefined

  const geoIPRequiredEntries = geoIPDictionaryStrings.map(removeExpressions)
  const fullDictionary =
    dictionaries &&
    dictionaries[brandConfig.brandName] &&
    dictionaries[brandConfig.brandName][languageMap[language]]
  if (fullDictionary && typeof fullDictionary === 'object') {
    return geoIPRequiredEntries.reduce((geoIPDictionary, key) => {
      geoIPDictionary[key] = fullDictionary[key]
      return geoIPDictionary
    }, {})
  }
}

export function setServerSideDictionaries(dicts) {
  if (process.browser) {
    throw new Error('Dictionaries cannot be set client side')
  }
  dictionaries = dicts
}

export function setClientSideDictionaries({ dictionary, geoIPDictionary }) {
  if (!process.browser) {
    throw new Error('Dictionary cannot be set server side')
  }
  _dictionary = dictionary
  _geoIPDictionary = geoIPDictionary
}

// This should only be used in unit tests:
export function clearOutDictionariesForTests() {
  _dictionary = undefined
  _geoIPDictionary = undefined
  dictionaries = undefined
}
