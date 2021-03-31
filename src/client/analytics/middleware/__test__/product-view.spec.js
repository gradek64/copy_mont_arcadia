import { productQuickViewListener, pageLoadedListener } from '../product-view'
import dataLayer from '../../../../shared/analytics/dataLayer'
import {
  GTM_LIST_TYPES,
  GTM_PAGE_TYPES,
} from '../../../../shared/analytics/analytics-constants'

jest.mock('../analytics-middleware', () => ({
  addPostDispatchListeners: jest.fn(),
}))

describe('ProductView analytics', () => {
  const stateMock = {
    config: {
      currencyCode: 'EUR',
    },
    currentProduct: {
      lineNumber: '123',
      list: '',
      name: 'Top T-Shirt Blue',
      productId: '123',
    },
  }

  const expectedPushData = [
    {
      ecommerce: {
        currencyCode: 'EUR',
        detail: {
          actionField: { list: undefined },
          products: [
            {
              category: undefined,
              id: '123',
              list: '',
              name: '(123) Top T-Shirt Blue',
              productId: '123',
              quantity: '1',
              isOnSale: false,
            },
          ],
        },
      },
    },
    null,
    'detail',
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(dataLayer, 'push')
  })

  describe('productQuickViewListener', () => {
    it('should not call dataLayer when there is no product in action', () => {
      const action = { product: {} }
      productQuickViewListener(action)
      expect(dataLayer.push).not.toHaveBeenCalled()
    })

    it('should call dataLayer with correct data', () => {
      const action = { product: stateMock.currentProduct }
      const store = {
        getState: () => stateMock,
      }
      productQuickViewListener(action, store)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(...expectedPushData)
    })
  })

  describe('pageLoadedListener', () => {
    it('should not call dataLayer when page is not PDP', () => {
      const action = {
        payload: { pageName: GTM_PAGE_TYPES.HOMEPAGE_PAGE_TYPE },
      }
      pageLoadedListener(action)
      expect(dataLayer.push).not.toHaveBeenCalled()
    })

    it('should call dataLayer with correct data for pdp', () => {
      const action = { payload: { pageName: GTM_PAGE_TYPES.PDP_PAGE_TYPE } }
      const store = {
        getState: () => stateMock,
      }
      pageLoadedListener(action, store)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(...expectedPushData)
    })

    it('should call dataLayer with correct data for bundle', () => {
      const action = {
        payload: { pageName: GTM_PAGE_TYPES.PDP_BUNDLE_PAGE_TYPE },
      }
      const store = {
        getState: () => stateMock,
      }
      pageLoadedListener(action, store)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(...expectedPushData)
    })

    it('should call dataLayer with correct data for Recently Viewed product', () => {
      const action = { payload: { pageName: GTM_PAGE_TYPES.PDP_PAGE_TYPE } }
      const store = {
        getState: () => ({
          ...stateMock,
          pageType: GTM_PAGE_TYPES.PDP_PAGE_TYPE,
          currentProduct: {
            ...stateMock.currentProduct,
            list: GTM_LIST_TYPES.PDP_RECENTLY_VIEWED,
          },
        }),
      }
      const expectedData = [
        {
          ecommerce: {
            currencyCode: 'EUR',
            detail: {
              actionField: { list: GTM_LIST_TYPES.PDP_RECENTLY_VIEWED },
              products: [
                {
                  category: GTM_PAGE_TYPES.PDP_PAGE_TYPE,
                  id: '123',
                  list: GTM_LIST_TYPES.PDP_RECENTLY_VIEWED,
                  name: '(123) Top T-Shirt Blue',
                  productId: '123',
                  quantity: '1',
                  isOnSale: false,
                },
              ],
            },
          },
        },
        null,
        'detail',
      ]

      pageLoadedListener(action, store)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(...expectedData)
    })

    it('should call dataLayer with correct data for pdp when previous page was plp', () => {
      const action = {
        payload: {
          pageName: GTM_PAGE_TYPES.PDP_PAGE_TYPE,
        },
      }

      const store = {
        getState: () => ({
          ...stateMock,
          pageType: GTM_PAGE_TYPES.PLP_PAGE_TYPE,
          products: {
            categoryTitle: 'Jeans',
          },
        }),
      }

      const expectedData = [
        {
          ecommerce: {
            currencyCode: 'EUR',
            detail: {
              actionField: { list: 'Jeans' },
              products: [
                {
                  category: 'Jeans',
                  id: '123',
                  list: 'Jeans',
                  name: '(123) Top T-Shirt Blue',
                  productId: '123',
                  quantity: '1',
                  isOnSale: false,
                },
              ],
            },
          },
        },
        null,
        'detail',
      ]

      pageLoadedListener(action, store)
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      expect(dataLayer.push).toHaveBeenCalledWith(...expectedData)
    })
  })
})
