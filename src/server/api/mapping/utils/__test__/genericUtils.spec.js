import {
  getExpiryYears,
  removeStateDiacritics,
  removeCanadaDiacritics,
  removeBillingShippingStateDiacritics,
  toTwoDecimalPlaces,
} from '../genericUtils'

const currentYear = new Date().getFullYear()
const currentYearString = currentYear.toString()

describe('# genericUtils', () => {
  describe('# getExpiryYears', () => {
    it('given a falsy argument returns an array containing the current year as a string', () => {
      expect(getExpiryYears(false)).toEqual([currentYearString])
      expect(getExpiryYears(null)).toEqual([currentYearString])
      expect(getExpiryYears(undefined)).toEqual([currentYearString])
    })
    it('given a string as argument returns an array containing the current year as a string', () => {
      expect(getExpiryYears('a')).toEqual([currentYearString])
    })
    it('given a negative integer as argument returns an array containing the current year as a string', () => {
      expect(getExpiryYears(-1)).toEqual([currentYearString])
    })
    it('given 0 as argument returns an array containing the current year as a string', () => {
      expect(getExpiryYears(0)).toEqual([currentYearString])
    })
    it('given 1 as argument returns an array containing the current year as a string', () => {
      expect(getExpiryYears(1)).toEqual([currentYearString])
    })
    it('given 2 as argument returns an array containing 8 consecutive years (from the current year) as strings', () => {
      expect(getExpiryYears(2)).toEqual([
        currentYearString,
        (currentYear + 1).toString(),
      ])
    })
  })

  describe('# remove diacritics', () => {
    it('should remove Diacritics from non-Canadian states', () => {
      expect(removeStateDiacritics('Košice', 'United Kingdom')).toEqual(
        'Kosice'
      )
    })
    it('should return empty if shipping country is Canada', () => {
      expect(removeStateDiacritics('Košice', 'Canada')).toEqual('')
    })
    it('should remove Diacritics if the shipping country is different from the compared country', () => {
      expect(
        removeStateDiacritics('Košice', 'United Kingdom', 'Italy')
      ).toEqual('Kosice')
    })
    it('should return empty if shipping country is the same as the compared country', () => {
      expect(removeStateDiacritics('Košice', 'France', 'France')).toEqual('')
    })
    it('should remove Diacritics if shipping country is Canada', () => {
      expect(removeCanadaDiacritics('Košice', 'Canada')).toEqual('Kosice')
    })
    it('should return empty if shipping country is not Canada', () => {
      expect(removeCanadaDiacritics('Košice', 'United Kingdom')).toEqual('')
    })
    it('should remove Diacritics from billing or shipping state', () => {
      expect(removeBillingShippingStateDiacritics('Košice')).toEqual('Kosice')
    })
    it('should return empty if billing or shipping state is null', () => {
      expect(removeBillingShippingStateDiacritics(null)).toEqual('')
    })
  })

  describe('# toTwoDecimalPlaces', () => {
    it('should return the empty string for faulty inputs', () => {
      expect(toTwoDecimalPlaces()).toEqual('')
      expect(toTwoDecimalPlaces(null)).toEqual('')
      expect(toTwoDecimalPlaces('bad-input')).toEqual('')
      expect(toTwoDecimalPlaces('-Infinity')).toEqual('')
      expect(toTwoDecimalPlaces({})).toEqual('')
      expect(toTwoDecimalPlaces([])).toEqual('')
    })

    it('should return the supplied default for faulty inputs', () => {
      const defaultValue = '0.00'
      expect(toTwoDecimalPlaces(undefined, defaultValue)).toEqual(defaultValue)
      expect(toTwoDecimalPlaces(null, defaultValue)).toEqual(defaultValue)
      expect(toTwoDecimalPlaces('bad-input', defaultValue)).toEqual(
        defaultValue
      )
      expect(toTwoDecimalPlaces('-Infinity', defaultValue)).toEqual(
        defaultValue
      )
      expect(toTwoDecimalPlaces({}, defaultValue)).toEqual(defaultValue)
      expect(toTwoDecimalPlaces([], defaultValue)).toEqual(defaultValue)
    })

    it('should convert a valid number to a string with two decimal places', () => {
      expect(toTwoDecimalPlaces(2)).toEqual('2.00')
      expect(toTwoDecimalPlaces(2.12)).toEqual('2.12')
      expect(toTwoDecimalPlaces(-2)).toEqual('-2.00')
      expect(toTwoDecimalPlaces(-2.12)).toEqual('-2.12')
      expect(toTwoDecimalPlaces('2')).toEqual('2.00')
      expect(toTwoDecimalPlaces('2.12')).toEqual('2.12')
      expect(toTwoDecimalPlaces('-2')).toEqual('-2.00')
      expect(toTwoDecimalPlaces('-2.12')).toEqual('-2.12')
    })

    it('should convert a valid number and ignore the default value', () => {
      const defaultValue = '0.00'
      expect(toTwoDecimalPlaces(2, defaultValue)).toEqual('2.00')
      expect(toTwoDecimalPlaces(2.12, defaultValue)).toEqual('2.12')
      expect(toTwoDecimalPlaces(-2, defaultValue)).toEqual('-2.00')
      expect(toTwoDecimalPlaces(-2.12, defaultValue)).toEqual('-2.12')
      expect(toTwoDecimalPlaces('2', defaultValue)).toEqual('2.00')
      expect(toTwoDecimalPlaces('2.12', defaultValue)).toEqual('2.12')
      expect(toTwoDecimalPlaces('-2', defaultValue)).toEqual('-2.00')
      expect(toTwoDecimalPlaces('-2.12', defaultValue)).toEqual('-2.12')
    })
  })
})
