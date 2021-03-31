import config, {
  transformProducts,
  setProductsListener,
  addToProductsListener,
  setRecommendationsListener,
  setRecentlyViewedListener,
} from '../product-impressions'
import dataLayer from '../../../../shared/analytics/dataLayer'
import { GTM_LIST_TYPES, GTM_PAGE_TYPES } from '../../../../shared/analytics'

jest.mock('../analytics-middleware', () => ({
  addPostDispatchListeners: jest.fn(),
}))

describe('productImpressions analytics', () => {
  const mockProduct1 = {
    attributes: {
      ECMC_PROD_CE3_PRODUCT_TYPE: 'Jeans & Jackets',
    },
    productId: 123456789,
    lineNumber: 'TS09D12MWHT',
    name: 'Long Sleeve Crew Neck Top',
    wasPrice: '20.00',
    unitPrice: '15.00',
    items: [
      {
        size: '8',
        quantity: 2,
      },
      {
        size: '10',
        quantity: 0,
      },
    ],
    bazaarVoiceData: {
      average: '4.0',
    },
  }

  const mockProduct2 = {
    attributes: {
      ECMC_PROD_CE3_PRODUCT_TYPE: 'Jeans & Jackets',
    },
    productId: 987654321,
    lineNumber: 'TS32K05MWHT',
    name: 'KLUELESS Studded Mule',
    unitPrice: '62.00',
    items: [],
  }

  const peeriusProductMock = {
    prices: {
      GBP: {
        unitPrice: 42,
        salePrice: 42,
      },
    },
    url: 'http://www.topshop.com/random-link-so-random',
    img:
      'https://images.topshop.com/i/it-was-a-real-image-link-but-i-shortened-it',
    attributes: {
      size: 'w3634',
      productterm: 'jeans',
      type1: 'shop all jeans',
      term: 'jean',
      pcatcomp: 'jean',
    },
    id: 1977429789961,
    title: 'Authentic Raw Hem Jamie Jeans',
    refCode: 'TS02K03PBLG',
  }

  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(dataLayer, 'push')
  })

  describe('utilities', () => {
    it('transformProducts()', () => {
      expect(
        transformProducts([mockProduct1], null, 'plp', 'Jeans & Jackets')
      ).toEqual([
        {
          id: 'TS09D12MWHT',
          productId: '123456789',
          name: '(TS09D12MWHT) Long Sleeve Crew Neck Top',
          price: '15.00',
          unitWasPrice: '20.00',
          unitNowPrice: '15.00',
          markdown: '25.00',
          quantity: '1',
          category: 'Jeans & Jackets',
          totalSizes: '2',
          sizesInStock: '8',
          sizesAvailable: '50.00',
          reviewRating: '4.0',
          position: '1',
          list: 'Jeans & Jackets',
          isOnSale: true,
        },
      ])

      expect(
        transformProducts([mockProduct2], null, 'plp', 'Jeans & Jackets')
      ).toEqual([
        {
          id: 'TS32K05MWHT',
          productId: '987654321',
          name: '(TS32K05MWHT) KLUELESS Studded Mule',
          price: '62.00',
          unitNowPrice: '62.00',
          quantity: '1',
          category: 'Jeans & Jackets',
          position: '1',
          list: 'Jeans & Jackets',
          isOnSale: false,
        },
      ])
    })
  })

  describe('dataLayer', () => {
    it('Scenario where PLP or search loads initial batch of products', () => {
      setProductsListener(
        {
          body: {
            products: [mockProduct1],
          },
        },
        {
          getState: () => ({
            config: {
              currencyCode: 'EUR',
            },
            pageType: GTM_PAGE_TYPES.PLP_PAGE_TYPE,
            products: {
              categoryTitle: 'Jeans & Jackets',
              products: [mockProduct1],
            },
          }),
        }
      )

      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      const actualDataLayerPushArgs = dataLayer.push.mock.calls[0]
      expect(actualDataLayerPushArgs).toEqual([
        {
          ecommerce: {
            currencyCode: 'EUR',
            impressions: [
              {
                id: 'TS09D12MWHT',
                productId: '123456789',
                name: '(TS09D12MWHT) Long Sleeve Crew Neck Top',
                price: '15.00',
                unitWasPrice: '20.00',
                unitNowPrice: '15.00',
                markdown: '25.00',
                quantity: '1',
                category: 'Jeans & Jackets',
                totalSizes: '2',
                sizesInStock: '8',
                sizesAvailable: '50.00',
                reviewRating: '4.0',
                position: '1',
                list: 'Jeans & Jackets',
                isOnSale: true,
              },
            ],
          },
        },
        null,
        'impression',
      ])
    })

    it('Scenario where PLP or search loads no products', () => {
      setProductsListener(
        {
          body: {},
        },
        {
          getState: () => ({
            config: {
              currencyCode: 'EUR',
            },
          }),
        }
      )
      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      const actualDataLayerPushArgs = dataLayer.push.mock.calls[0]
      expect(actualDataLayerPushArgs).toEqual([
        {
          ecommerce: {
            currencyCode: 'EUR',
            impressions: [],
          },
        },
        null,
        'impression',
      ])
    })

    it('Scenario where user scrolls down to load more products', () => {
      // initial page of products
      setProductsListener(
        {
          body: {
            products: [mockProduct1],
          },
        },
        {
          getState: () => ({
            config: {
              currencyCode: 'EUR',
            },
            pageType: GTM_PAGE_TYPES.PLP_PAGE_TYPE,
            products: {
              categoryTitle: 'Jeans & Jackets',
              products: [mockProduct1],
            },
          }),
        }
      )

      // scroll down triggers additional product to be loaded
      addToProductsListener(
        {
          products: [mockProduct2],
        },
        {
          getState: () => ({
            config: {
              currencyCode: 'EUR',
            },
            pageType: GTM_PAGE_TYPES.PLP_PAGE_TYPE,
            products: {
              categoryTitle: 'Jeans & Jackets',
              products: [mockProduct1, mockProduct2],
            },
          }),
        }
      )

      expect(dataLayer.push).toHaveBeenCalledTimes(2)
      const actualDataLayerPushArgs = dataLayer.push.mock.calls[1]
      expect(actualDataLayerPushArgs).toEqual([
        {
          ecommerce: {
            currencyCode: 'EUR',
            impressions: [
              {
                category: 'Jeans & Jackets',
                id: 'TS32K05MWHT',
                list: 'Jeans & Jackets',
                name: '(TS32K05MWHT) KLUELESS Studded Mule',
                position: '2',
                price: '62.00',
                productId: '987654321',
                quantity: '1',
                unitNowPrice: '62.00',
                isOnSale: false,
              },
            ],
          },
        },
        null,
        'impression',
      ])
    })

    it('Why Not Try recommendations impressions are sent on pdp after being set in redux and loaded on a page', () => {
      setRecommendationsListener(
        {
          recommendations: [peeriusProductMock],
        },
        {
          getState: () => ({
            config: {
              currencyCode: 'GBP',
            },
            currentProduct: {
              list: GTM_LIST_TYPES.PDP_WHY_NOT_TRY,
            },
            pageType: GTM_PAGE_TYPES.PDP_PAGE_TYPE,
          }),
        }
      )

      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      const actualDataLayerPushArgs = dataLayer.push.mock.calls[0]
      expect(actualDataLayerPushArgs).toEqual([
        {
          ecommerce: {
            currencyCode: 'GBP',
            impressions: [
              {
                category: GTM_PAGE_TYPES.PDP_PAGE_TYPE,
                id: 'TS02K03PBLG',
                list: GTM_LIST_TYPES.PDP_WHY_NOT_TRY,
                name: '(TS02K03PBLG) Authentic Raw Hem Jamie Jeans',
                position: 1,
                price: '42',
                productId: '',
                quantity: 1,
                unitNowPrice: '42',
              },
            ],
          },
        },
        null,
        'impression',
      ])
    })

    it('Recently Viewed products impressions are sent on pdp after one last product being added', () => {
      setRecentlyViewedListener(null, {
        getState: () => ({
          config: {
            currencyCode: 'GBP',
          },
          pageType: GTM_PAGE_TYPES.PDP_PAGE_TYPE,
          recentlyViewed: [mockProduct1],
        }),
      })

      expect(dataLayer.push).toHaveBeenCalledTimes(1)
      const actualDataLayerPushArgs = dataLayer.push.mock.calls[0]
      expect(actualDataLayerPushArgs).toEqual([
        {
          ecommerce: {
            currencyCode: 'GBP',
            impressions: [
              {
                category: GTM_PAGE_TYPES.PDP_PAGE_TYPE,
                id: 'TS09D12MWHT',
                list: GTM_LIST_TYPES.PDP_RECENTLY_VIEWED,
                markdown: '25.00',
                name: '(TS09D12MWHT) Long Sleeve Crew Neck Top',
                position: '2',
                price: '15.00',
                productId: '123456789',
                quantity: '1',
                reviewRating: '4.0',
                sizesAvailable: '50.00',
                sizesInStock: '8',
                totalSizes: '2',
                unitNowPrice: '15.00',
                unitWasPrice: '20.00',
                isOnSale: true,
              },
            ],
          },
        },
        null,
        'impression',
      ])
    })
  })

  it('listeners configured correctly', () => {
    config()

    const addPostDispatchListeners = require('../analytics-middleware')
      .addPostDispatchListeners
    expect(addPostDispatchListeners).toHaveBeenCalledWith(
      'ADD_TO_PRODUCTS',
      addToProductsListener
    )
    expect(addPostDispatchListeners).toHaveBeenCalledWith(
      'SET_PRODUCTS',
      setProductsListener
    )
    expect(addPostDispatchListeners).toHaveBeenCalledWith(
      'SET_RECOMMENDATIONS',
      setRecommendationsListener
    )
    expect(addPostDispatchListeners).toHaveBeenCalledWith(
      'PAGE_LOADED',
      setRecentlyViewedListener
    )
  })
})
