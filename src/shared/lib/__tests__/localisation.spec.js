/* eslint-disable no-template-curly-in-string */

import {
  translate,
  translateGeoIPTextInPreferredLanguage,
  setClientSideDictionaries,
  setServerSideDictionaries,
  getGeoIPDictionary,
  clearOutDictionariesForTests,
} from '../localisation'
import * as devLoggerUtils from '../dev-logger'

jest.mock('../../components/common/GeoIP/RedirectionPrompt', () => ({
  dictionaryStrings: [
    'Country preferences',
    'You are viewing the website for ${currentSite}. Would you like to view the website for ${otherSite} instead?',
  ],
}))

const dictionaries = {
  topshop: {
    'en-GB': {
      foo: 'bar',
    },
    'fr-FR': {
      foo: 'baz',
    },
  },
}
const _dictionary = {
  foo: 'qux',
}
const _geoIPDictionary = {
  foo: 'quux',
}

describe('localisation', () => {
  const oldProcessBrowserValue = global.process.browser
  afterAll(() => {
    global.process.browser = oldProcessBrowserValue
  })

  describe('translate', () => {
    describe('if the strings arg is not a string or array', () => {
      it('should return an empty string', () => {
        expect(translate(_dictionary, undefined)).toBe('')
        expect(translate(_dictionary, null)).toBe('')
        expect(translate(_dictionary, 8)).toBe('')
        expect(translate(_dictionary, {})).toBe('')
      })
    })

    describe('if the dictionary is undefined', () => {
      it('should return the string argument if it is a string', () => {
        expect(translate(undefined, 'some string')).toBe('some string')
      })

      it('should return the first element if the string argument is an array', () => {
        expect(translate(undefined, ['some string', 'some other string'])).toBe(
          'some string'
        )
      })
    })

    describe('if expressions are not provided', () => {
      describe('and `strings` is a string', () => {
        describe('if there is a matching entry', () => {
          it('should return the value whose key is `strings`', () => {
            expect(translate(_dictionary, 'foo', [])).toBe('qux')
          })
        })

        describe('if there is not a matching entry', () => {
          it('should return `strings', () => {
            expect(translate(_dictionary, 'no match', [])).toBe('no match')
          })

          describe('and the env. variable SHOW_MISSING_LOCALISATION is true', () => {
            it('should log an error', () => {
              const realValue = process.env.SHOW_MISSING_LOCALISATION
              process.env.SHOW_MISSING_LOCALISATION = true
              jest.spyOn(devLoggerUtils, 'error')

              expect(devLoggerUtils.error).not.toHaveBeenCalled()
              translate(_dictionary, 'no match', [])
              expect(devLoggerUtils.error).toHaveBeenCalled()
              expect(devLoggerUtils.error).toHaveBeenCalledWith(
                "No localisation found for: 'no match'"
              )

              process.env.SHOW_MISSING_LOCALISATION = realValue
            })
          })
        })
      })

      describe('and `strings` is an array', () => {
        it('should try to return a match for the first element of the array', () => {
          expect(translate(_dictionary, ['foo', 'unused foo'], [])).toBe('qux')
        })
      })
    })

    describe('if expressions are provided', () => {
      it('should interpolate the expressions into the strings', () => {
        expect(
          translate(
            _dictionary,
            ['in ', ' in ', ' shake it all about'],
            ['out', 'out']
          )
        ).toBe('in out in out shake it all about')
      })
    })
  })

  describe('translateGeoIPTextInPreferredLanguage', () => {
    describe('when setServerSideDictionaries has set the `dictionaries`', () => {
      it('should translate using the `dictionaries` set of entries provided', () => {
        global.process.browser = false
        setServerSideDictionaries(dictionaries)
        expect(
          translateGeoIPTextInPreferredLanguage(
            'en-gb',
            'fr-fr',
            'topshop',
            'foo'
          )
        ).toBe('bar')
      })
    })

    describe('if setClientSideDictionaries has been called with the main dictionary but not with the geoIPDictionary', () => {
      it('should translate using that dictionary', () => {
        global.process.browser = true
        setClientSideDictionaries({ dictionary: _dictionary })
        expect(
          translateGeoIPTextInPreferredLanguage(
            'en-gb',
            'fr-fr',
            'topshop',
            'foo'
          )
        ).toBe('qux')
      })
    })

    describe('if setClientSideDictionaries was provided both the main dictionary and the geoIPDictionary', () => {
      it('should translate using the geoIPDictionary', () => {
        global.process.browser = true
        setClientSideDictionaries({
          dictionary: _dictionary,
          geoIPDictionary: _geoIPDictionary,
        })
        expect(
          translateGeoIPTextInPreferredLanguage(
            'en-gb',
            'fr-fr',
            'topshop',
            'foo'
          )
        ).toBe('quux')
      })
    })
  })

  describe('getGeoIPDictionary', () => {
    const fullDictionary = {
      topshop: {
        'fr-FR': {
          // geoIP entries:
          'Country preferences': 'Pays de préférence',
          'You are viewing the website for ${}. Would you like to view the website for ${} instead?':
            'Vous êtes sur le site pour ${currentSite }. Souhaitez-vous plutôt voir le site pour ${otherSite}?',
          // non geoIP entry: (not in RedirectionPrompt.dictionaryStrings mock at top of this file)
          'Add to bag': 'Ajouter au panier',
        },
      },
    }
    const fakeBrandConfig = { brandName: 'topshop', language: 'en-gb' }

    beforeAll(() => {
      clearOutDictionariesForTests()
      global.process.browser = false
      setServerSideDictionaries(fullDictionary)
    })

    describe('if the language specified is different to that of the brandConfig', () => {
      it('should return a mini dictionary with only the required geoIP strings', () => {
        const geoIPDictionary = getGeoIPDictionary(fakeBrandConfig, 'fr-fr')
        expect(geoIPDictionary).toEqual({
          'Country preferences': 'Pays de préférence',
          'You are viewing the website for ${}. Would you like to view the website for ${} instead?':
            'Vous êtes sur le site pour ${currentSite }. Souhaitez-vous plutôt voir le site pour ${otherSite}?',
        })
      })
    })

    describe('if the language specified and that of the brand config are en-gb / en-us', () => {
      it('should return undefined', () => {
        const geoIPDictionary = getGeoIPDictionary(fakeBrandConfig, 'en-us')
        expect(geoIPDictionary).toBeUndefined()
      })
    })

    describe('if the language specified is the same as the brand config', () => {
      it('should return undefined', () => {
        const geoIPDictionary = getGeoIPDictionary(fakeBrandConfig, 'en-gb')
        expect(geoIPDictionary).toBeUndefined()
      })
    })

    describe('if the language provided is not valid', () => {
      it('should return undefined', () => {
        const geoIPDictionary = getGeoIPDictionary(fakeBrandConfig, 'xx-yy')
        expect(geoIPDictionary).toBeUndefined()
      })
    })
  })
})
