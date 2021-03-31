import { setLocaleDictionary } from '../localisationActions'

describe('localisation actions', () => {
  describe('setLocaleDictionary', () => {
    it('should dispatch an action with type `SET_LOCALE_DICTIONARY`', () => {
      const dictionary = { foo: 'bar' }
      const geoIPDictionary = { geoIPFoo: 'geoIPBar' }
      expect(setLocaleDictionary(dictionary, geoIPDictionary)).toEqual({
        type: 'SET_LOCALE_DICTIONARY',
        dictionary,
        geoIPDictionary,
      })
    })
  })
})
