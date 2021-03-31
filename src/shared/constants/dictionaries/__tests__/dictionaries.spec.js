import { difference } from 'ramda'

import dictionaries, { removeExpressions } from '../'
import de from '../default/de-DE.json'
import gb from '../default/en-GB.json'
import us from '../default/en-US.json'
import fr from '../default/fr-FR.json'

describe('Dictionaries', () => {
  const brands = [
    'burton',
    'dorothyperkins',
    'evans',
    'missselfridge',
    'topman',
    'topshop',
    'wallis', // eslint-disable-line comma-dangle
  ]
  const localeDictionaries = {
    'en-GB': gb,
    'en-US': us,
    'de-DE': de,
    'fr-FR': fr, // eslint-disable-line comma-dangle
  }

  it('should a separate localisation object for each brand', () => {
    const dictionaryBrands = Object.keys(dictionaries)
    expect(difference(brands, dictionaryBrands)).toEqual([])
    dictionaryBrands.forEach((dictionaryBrand) => {
      const brandLocales = Object.keys(dictionaries[dictionaryBrand])
      expect(difference(brandLocales, Object.keys(localeDictionaries))).toEqual(
        []
      )
    })
  })

  it('should translate all text', () => {
    Object.keys(localeDictionaries).forEach((locale) => {
      const localeDictionary = localeDictionaries[locale]
      brands.forEach((brand) => {
        expect(
          difference(dictionaries[brand][locale], localeDictionary)
        ).toEqual([])
      })
    })
  })

  it('should accept overrides from brands', () => {
    expect(dictionaries.wallis['de-DE'].outfit).toBe('Model')
  })

  describe('removeExpressions', () => {
    it('should replace an expression with an empty expression', () => {
      /* eslint-disable no-template-curly-in-string */
      expect(removeExpressions('foo ${bar} foo')).toBe('foo ${} foo')
      expect(removeExpressions('foo ${bar} foo ${bar}')).toBe('foo ${} foo ${}')
    })

    it('should do nothing with empty expressions', () => {
      expect(removeExpressions('foo ${} foo')).toBe('foo ${} foo')
      expect(removeExpressions('foo ${} foo ${}')).toBe('foo ${} foo ${}')
      /* eslint-enable no-template-curly-in-string */
    })
  })
})
