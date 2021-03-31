global.process.browser = true

import {
  capitalize,
  titleCase,
  camelCaseify,
  trimFromFileExtension,
  removeSpacing,
  lastFourCharsOf,
  trimStringEnds,
  floatToPriceString,
} from '../string-utils'

describe('String Utils', () => {
  describe('capitalize', () => {
    it('capitalises the first letter of a word', () => {
      expect(capitalize('test')).toBe('Test')
    })

    it('returns an empty string if passed a non string', () => {
      expect(capitalize(0)).toBe('')
    })

    it('returns an empty string if passed an empty string', () => {
      expect(capitalize('')).toBe('')
    })
  })

  describe('titleCase', () => {
    it('returns a sentence in title case', () => {
      expect(titleCase('this is a test')).toBe('This Is A Test')
    })
  })

  describe('camelCaseify', () => {
    it('should convert string with spaces to camel case', () => {
      expect(camelCaseify('hello world')).toBe('helloWorld')
    })

    it('should convert string with multiple spaces to camel case', () => {
      expect(camelCaseify('hello world and goodbye')).toBe(
        'helloWorldAndGoodbye'
      )
    })

    it('should remove non-alphanumeric characters', () => {
      expect(camelCaseify('hello world & goodbye1!')).toBe('helloWorldGoodbye1')
    })

    it('should remove underscore characters', () => {
      expect(camelCaseify('hello world__goodbye')).toBe('helloWorldGoodbye')
    })

    it('should handle one letter words', () => {
      expect(camelCaseify('hello world s and b')).toBe('helloWorldSAndB')
    })

    it('should handle nothing supplied', () => {
      expect(camelCaseify()).toBeUndefined()
    })
  })

  describe('trimFromFileExtension', () => {
    const extension = 'jpg'

    it('should return empty string when empty string passed in', () => {
      const string = ''
      expect(trimFromFileExtension(string, extension)).toEqual(string)
    })

    it('should return same string when no extension specified', () => {
      const string = 'http://www.google.com/assets/foo.jpg'
      expect(trimFromFileExtension(string)).toEqual(string)
    })

    it('should return the same string when no extension found', () => {
      const string = 'http://www.google.com/assets/jpg/other-page-url'
      expect(trimFromFileExtension(string, extension)).toEqual(string)
    })

    it('should remove file extension from the end', () => {
      const string = 'http://www.google.com/assets/foo.jpg'
      expect(trimFromFileExtension(string, extension)).toBe(
        'http://www.google.com/assets/foo'
      )
    })

    it('should remove everything starting from file extension', () => {
      const string = 'http://www.google.com/assets/foo.jpg?$2col$'
      expect(trimFromFileExtension(string, extension)).toEqual(
        'http://www.google.com/assets/foo'
      )
    })
  })

  describe('removeSpacing', () => {
    it('should remove spacing from a phone number', () => {
      const num = '07708 475823'
      const res = '07708475823'

      expect(removeSpacing(num)).toEqual(res)
    })

    it('should remove spacing from a sentence', () => {
      const num = 'foo bar'
      const res = 'foobar'

      expect(removeSpacing(num)).toEqual(res)
    })

    it('return same string if there are no spaces', () => {
      const num = 'foobar'
      const res = 'foobar'
      expect(removeSpacing(num)).toEqual(res)
    })

    test.each([undefined, false, null, ''])(
      'should return the same value if it is falsey (%p)',
      (value) => {
        expect(removeSpacing(value)).toEqual(value)
      }
    )
  })

  describe('trimStringEnds', () => {
    it('should remove whitespace from both ends of the string', () => {
      const output = 'W4 3JY'
      expect(trimStringEnds('W4 3JY ')).toEqual(output)
      expect(trimStringEnds(' W4 3JY')).toEqual(output)
      expect(trimStringEnds(' W4 3JY ')).toEqual(output)
    })
    it('should return the same string if no whitespaces', () => {
      const input = 'W4 3JY'
      expect(trimStringEnds(input)).toEqual(input)
    })

    test.each([undefined, false, null, ''])(
      'should return the same value if it is falsey (%p)',
      (value) => {
        expect(trimStringEnds(value)).toEqual(value)
      }
    )
  })

  describe('lastFourCharsOf', () => {
    it('should return the last 4 characters of a string', () => {
      const giftCard = '6337850394873565'
      expect(lastFourCharsOf(giftCard)).toEqual('3565')
    })
  })

  describe('floatToPriceString', () => {
    describe('should convert a float to a string with 2 decimal places, rounding up', () => {
      test.each([
        [0, '0.00'],
        [1, '1.00'],
        [1.11, '1.11'],
        [2.6, '2.60'],
        [2.663, '2.66'],
        [2.665, '2.67'],
        [3.777, '3.78'],
        [1729.1453, '1729.15'],
      ])('the float %p becomes the string %s', (float, result) => {
        expect(floatToPriceString(float)).toEqual(result)
      })
    })
    describe('should return null for invalid input', () => {
      test.each([
        null,
        undefined,
        NaN,
        new Date(),
        new Error('this is not a valid price'),
        'over nine thousand',
        '$1.60',
      ])('the value %p returns null', (value) => {
        expect(floatToPriceString(value)).toEqual(null)
      })
    })
  })
})
