export function setLocaleDictionary(dictionary, geoIPDictionary) {
  return {
    type: 'SET_LOCALE_DICTIONARY',
    dictionary,
    geoIPDictionary,
  }
}
