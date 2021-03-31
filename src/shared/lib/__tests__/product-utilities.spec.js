import {
  checkIfOneSizedItem,
  getMatchingAttribute,
  getTotalQuantityFromProducts,
  isProductId,
  recommendationCategorySelector,
  recommendationListSelector,
  getPDPCategoryAndUrl,
} from '../product-utilities'
import { GTM_PAGE_TYPES, GTM_LIST_TYPES } from '../../analytics'

describe('product-utilities', () => {
  describe('getMatchingAttribute', () => {
    it('should return undefined value when object is not valid', () => {
      expect(getMatchingAttribute('freddieMercury', undefined)).toEqual(
        undefined
      )

      expect(getMatchingAttribute('freddieMercury', null)).toEqual(undefined)

      expect(getMatchingAttribute('freddieMercury', 0)).toEqual(undefined)

      expect(
        getMatchingAttribute('freddieMercury', 'trying to be an object')
      ).toEqual(undefined)
    })
    it('should be undefined if object is not passed', () => {
      expect(getMatchingAttribute(123)).toBeUndefined()
    })
    it('should return matching value for given key', () => {
      expect(getMatchingAttribute('brianMay', { brianMay: 321 })).toEqual(321)
    })
    it('should return undefined value for given key that does not exist', () => {
      expect(getMatchingAttribute('freddieMercury', { brianMay: 321 })).toEqual(
        undefined
      )
    })
  })

  describe('checkIfOneSizedItem', () => {
    it('should be false if items is falsey', () => {
      expect(checkIfOneSizedItem(false)).toBe(false)
    })
    it('should be false if items.length === 0', () => {
      expect(checkIfOneSizedItem([])).toBe(false)
    })
    it('should be false if items.length > 0', () => {
      expect(checkIfOneSizedItem([{ size: 1 }, { size: 2 }])).toBe(false)
    })
    it('should be false if items.length === 1 and size is not "ONE" or "000"', () => {
      expect(checkIfOneSizedItem([{ size: 1 }])).toBe(false)
    })
    it('should be false if items.length === 1 and size is "000"', () => {
      expect(checkIfOneSizedItem([{ size: '000' }])).toBe(true)
    })
    it('should be false if items.length === 1 and size is "ONE"', () => {
      expect(checkIfOneSizedItem([{ size: 'ONE' }])).toBe(true)
    })
  })

  describe('getTotalQuantityFromProducts', () => {
    it('should return zero for a zero length array', () => {
      const result = getTotalQuantityFromProducts([])

      expect(result).toBe(0)
    })

    it('should return the total quantity for all products', () => {
      const products = [{ quantity: 5 }, { quantity: 5 }, { quantity: 2 }]

      const result = getTotalQuantityFromProducts(products)

      expect(result).toBe(12)
    })
  })

  describe('isProductId', () => {
    it('should return true for numeric values', () => {
      expect(isProductId(1234)).toBe(true)
    })

    it('should return true for string identifiers', () => {
      expect(isProductId('AGasnmdnmsd')).toBe(true)
    })

    it('should return true for bundle identifiers', () => {
      expect(isProductId('BUNDLE_abc123')).toBe(true)
    })

    it('should return false for other values', () => {
      ;[null, undefined, 'abc123', '!AB_23'].forEach((value) => {
        expect(isProductId(value)).toBe(false)
      })
    })
  })

  describe('list and category for the recommended product', () => {
    const recommendation = {
      attributes: {
        pcatcomp: 'Jeans',
      },
    }

    it('displays correct category based on page type', () => {
      expect(
        recommendationCategorySelector(
          GTM_PAGE_TYPES.PDP_PAGE_TYPE,
          recommendation
        )
      ).toEqual(GTM_PAGE_TYPES.PDP_PAGE_TYPE)

      expect(
        recommendationCategorySelector('something unclear', recommendation)
      ).toEqual(recommendation.attributes.pcatcomp)

      expect(recommendationCategorySelector('unclear', {})).toEqual('')
    })

    it('displays correct list', () => {
      expect(recommendationListSelector(GTM_PAGE_TYPES.PDP_PAGE_TYPE)).toEqual(
        GTM_LIST_TYPES.PDP_WHY_NOT_TRY
      )

      expect(recommendationListSelector('unknown page type')).toEqual('')
    })
  })

  describe('getPDPCategoryAndUrl', () => {
    it('should return array if breadcrumbs params is not an array ', () => {
      expect(getPDPCategoryAndUrl('string')).toEqual([])
      expect(getPDPCategoryAndUrl(21122)).toEqual([])
      expect(getPDPCategoryAndUrl({})).toEqual([])
    })

    it('should return empty array if breadcrumbs length is not length of two', () => {
      const breadCrumbs = [
        {
          label: 'test.com',
          url: 'http://www.test.com',
        },
      ]

      expect(getPDPCategoryAndUrl(breadCrumbs)).toEqual([])
    })

    it('should return breadcrumbs object with url and label ', () => {
      const breadCrumbs = [
        {
          label: 'test.com',
          url: 'http://www.test.com',
        },
        {
          label: 'test.com',
          url: 'http://www.test.com',
        },
        {
          label: 'dresses',
          url: 'http://www.topshop.com/dresses',
        },
        { label: 'Black Shirred Long Sleeve Top' },
      ]

      expect(getPDPCategoryAndUrl(breadCrumbs)).toEqual({
        label: 'dresses',
        url: 'http://www.topshop.com/dresses',
      })
    })
  })
})
