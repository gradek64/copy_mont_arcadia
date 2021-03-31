jest.mock('../../../Mapper')
import Basket from '../Basket'

jest.mock('../../../transforms/basket')
import transform from '../../../transforms/basket'

import { basketConstants } from '../../../constants/basketConstants'

const wcsParameters = {
  ...basketConstants,
  langId: '-1',
  storeId: 12556,
  catalogId: 33057,
}

const storeConfig = {
  catalogId: 33057,
  langId: '-1',
  siteId: 12556,
  currencySymbol: '£',
}

const wcsBody = {
  Basket: {
    products: {
      Product: [{ quantity: 1 }, { quantity: 3 }],
    },
  },
}

const transformedBody = { body: 'I am a transformed basket body for Monty' }

describe('Basket mapper', () => {
  describe('mapEndpoint', () => {
    it('should set the destinationEndpoint to /webapp/wcs/stores/servlet/OrderCalculate', () => {
      const basket = new Basket()
      expect(basket.destinationEndpoint).toBeUndefined()
      basket.mapEndpoint()
      expect(basket.destinationEndpoint).toBe(
        '/webapp/wcs/stores/servlet/OrderCalculate'
      )
    })
  })

  describe('mapRequestParameters', () => {
    it('should set the query to a format expected by WCS', () => {
      const basket = new Basket()
      basket.storeConfig = storeConfig
      basket.mapRequestParameters()
      expect(basket.query).toEqual(wcsParameters)
    })
  })

  describe('mapResponseBody', () => {
    afterEach(() => {
      jest.resetAllMocks()
    })

    it('should use the basket transform function to transform the response to a format expected by WCS', () => {
      transform.mockReturnValue(transformedBody)
      const basket = new Basket()
      basket.storeConfig = {
        cookie: '',
      }
      expect(basket.mapResponseBody(wcsBody)).toEqual(transformedBody)
    })

    it('should call the transform function with the correct parameters', () => {
      const basket = new Basket()
      basket.storeConfig = storeConfig
      basket.mapResponseBody(wcsBody)
      expect(transform).toHaveBeenCalledTimes(1)
      expect(transform).toHaveBeenCalledWith(wcsBody.Basket, '£')
    })
  })
})
