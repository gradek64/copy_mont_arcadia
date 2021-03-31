import dataLayer from '../../../../shared/analytics/dataLayer'

jest.mock('../../../../shared/analytics/dataLayer', () => ({
  push: jest.fn(),
}))

jest.mock('../analytics-middleware', () => ({
  addPostDispatchListeners: jest.fn(),
}))

describe('pageView analytics', () => {
  let pageLoadedListener
  let config

  const storeMock = {
    getState: () => ({
      config: {
        currencyCode: 'EUR',
      },
      checkout: {
        orderSummary: {
          basket: {
            products: [
              {
                items: [],
                wasPrice: '',
                size: 'ONE',
                lowStock: false,
                assets: [
                  {
                    assetType: 'IMAGE_SMALL',
                    index: 1,
                    url:
                      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS24E03JMUL_Thumb_F_1.jpg',
                  },
                  {
                    assetType: 'IMAGE_THUMB',
                    index: 1,
                    url:
                      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS24E03JMUL_Small_F_1.jpg',
                  },
                  {
                    assetType: 'IMAGE_NORMAL',
                    index: 1,
                    url:
                      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS24E03JMUL_2col_F_1.jpg',
                  },
                  {
                    assetType: 'IMAGE_LARGE',
                    index: 1,
                    url:
                      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS24E03JMUL_Zoom_F_1.jpg',
                  },
                ],
                totalPrice: '70.00',
                unitPrice: '70.00',
                bundleProducts: [],
                tpmLinks: [],
                productId: 23796668,
                quantity: 1,
                name: 'Premium Patchwork Shopper Bag - MULTI',
                inStock: true,
                isBundleOrOutfit: false,
                bundleSlots: [],
                colourSwatches: [],
                catEntryId: 23796683,
                attributes: {},
                ageVerificationRequired: false,
                shipModeId: 26504,
                orderItemId: 732402003,
                lineNumber: '24E03JMUL',
              },
            ],
          },
        },
      },
    }),
  }

  beforeEach(() => {
    jest.resetAllMocks()
    const checkoutStepsModule = require('../checkout-steps')
    pageLoadedListener = checkoutStepsModule.pageLoadedListener
    config = checkoutStepsModule.default
  })

  it("pageLoadedListener() when page is 'checkout-login' checkout step", () => {
    pageLoadedListener(
      {
        payload: {
          pageName: 'checkout-login',
        },
      },
      storeMock
    )
    expect(dataLayer.push).toHaveBeenCalledTimes(1)
    const actualDataLayerPushArgs = dataLayer.push.mock.calls[0]
    expect(actualDataLayerPushArgs).toEqual([
      {
        ecommerce: {
          currencyCode: 'EUR',
          checkout: {
            actionField: {
              step: 1,
            },
            products: [
              {
                brand: undefined,
                category: undefined,
                colour: undefined,
                id: '24E03JMUL',
                productId: '23796668',
                markdown: undefined,
                name: '(24E03JMUL) Premium Patchwork Shopper Bag - MULTI',
                price: '70.00',
                quantity: '1',
                reviewRating: undefined,
                size: 'ONE',
                sizesAvailable: undefined,
                sizesInStock: undefined,
                totalSizes: undefined,
                unitNowPrice: '70.00',
                unitWasPrice: undefined,
                list: '',
                isOnSale: false,
              },
            ],
          },
        },
      },
      null,
      'checkout',
    ])
  })

  it("pageLoadedListener() when page is 'delivery-details' checkout step", () => {
    pageLoadedListener(
      {
        payload: {
          pageName: 'delivery-details',
        },
      },
      storeMock
    )
    expect(dataLayer.push).toHaveBeenCalledTimes(1)
    const actualDataLayerPushArgs = dataLayer.push.mock.calls[0]
    expect(actualDataLayerPushArgs).toEqual([
      {
        ecommerce: {
          currencyCode: 'EUR',
          checkout: {
            actionField: {
              step: 2,
            },
            products: [
              {
                brand: undefined,
                category: undefined,
                colour: undefined,
                id: '24E03JMUL',
                productId: '23796668',
                markdown: undefined,
                name: '(24E03JMUL) Premium Patchwork Shopper Bag - MULTI',
                price: '70.00',
                quantity: '1',
                reviewRating: undefined,
                size: 'ONE',
                sizesAvailable: undefined,
                sizesInStock: undefined,
                totalSizes: undefined,
                unitNowPrice: '70.00',
                unitWasPrice: undefined,
                list: '',
                isOnSale: false,
              },
            ],
          },
        },
      },
      null,
      'checkout',
    ])
  })

  it("pageLoadedListener() when page is 'payment-details' checkout step", () => {
    pageLoadedListener({ payload: { pageName: 'payment-details' } }, storeMock)
    expect(dataLayer.push).toHaveBeenCalledTimes(1)
    const actualDataLayerPushArgs = dataLayer.push.mock.calls[0]
    expect(actualDataLayerPushArgs).toEqual([
      {
        ecommerce: {
          currencyCode: 'EUR',
          checkout: {
            actionField: {
              step: 3,
            },
            products: [
              {
                brand: undefined,
                category: undefined,
                colour: undefined,
                id: '24E03JMUL',
                productId: '23796668',
                markdown: undefined,
                name: '(24E03JMUL) Premium Patchwork Shopper Bag - MULTI',
                price: '70.00',
                quantity: '1',
                reviewRating: undefined,
                size: 'ONE',
                sizesAvailable: undefined,
                sizesInStock: undefined,
                totalSizes: undefined,
                unitNowPrice: '70.00',
                unitWasPrice: undefined,
                list: '',
                isOnSale: false,
              },
            ],
          },
        },
      },
      null,
      'checkout',
    ])
  })

  it("pageLoadedListener() when page is 'delivery-payment' checkout step", () => {
    pageLoadedListener(
      {
        payload: {
          pageName: 'delivery-payment',
        },
      },
      storeMock
    )
    expect(dataLayer.push).toHaveBeenCalledTimes(1)
    const actualDataLayerPushArgs = dataLayer.push.mock.calls[0]
    expect(actualDataLayerPushArgs).toEqual([
      {
        ecommerce: {
          currencyCode: 'EUR',
          checkout: {
            actionField: {
              step: 4,
            },
            products: [
              {
                brand: undefined,
                category: undefined,
                colour: undefined,
                id: '24E03JMUL',
                productId: '23796668',
                markdown: undefined,
                name: '(24E03JMUL) Premium Patchwork Shopper Bag - MULTI',
                price: '70.00',
                quantity: '1',
                reviewRating: undefined,
                size: 'ONE',
                sizesAvailable: undefined,
                sizesInStock: undefined,
                totalSizes: undefined,
                unitNowPrice: '70.00',
                unitWasPrice: undefined,
                list: '',
                isOnSale: false,
              },
            ],
          },
        },
      },
      null,
      'checkout',
    ])
  })

  it('pageLoadedListener() when page is not in checkout step', () => {
    pageLoadedListener(
      {
        payload: {
          pageName: 'pdp',
        },
      },
      storeMock
    )
    expect(dataLayer.push).not.toHaveBeenCalled()
  })

  it('default config export', () => {
    config()
    expect(
      require('../analytics-middleware').addPostDispatchListeners
    ).toHaveBeenCalledWith('PAGE_LOADED', pageLoadedListener)
  })

  describe('with existing dataLayer data', () => {
    beforeEach(() => {
      // We simulate existing data on the dataLayer:
      dataLayer[0] = {
        ecommerce: {
          currencyCode: 'EUR',
          checkout: {
            actionField: {
              step: Infinity,
            },
          },
        },
      }
      dataLayer.length = 1
      pageLoadedListener = require('../checkout-steps').pageLoadedListener
    })
  })
})
