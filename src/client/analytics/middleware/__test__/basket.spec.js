import config, {
  listeners,
  mergingState,
  pauseBasket,
  clearBasketStateListenerPause,
  productsDiff,
  basketStateListener,
  startMerging,
  endMerging,
} from '../basket'
import dataLayer from '../../../../shared/analytics/dataLayer'

jest.mock('../../storeObserver', () => ({ addStateListeners: jest.fn() }))
jest.mock('../analytics-middleware', () => ({
  addPreDispatchListeners: jest.fn(),
  addPostDispatchListeners: jest.fn(),
}))

const fullBasket = {
  productList: [
    {
      brand: undefined,
      category: 'Jeans',
      colour: 'blue',
      department: undefined,
      ecmcCategory: 'EASY',
      id: '20N01JCRL',
      markdown: '16.67',
      name: '(20N01JCRL) Nails in Siren',
      price: '5.00',
      productId: '27738367',
      quantity: '1',
      reviewRating: '4.2',
      size: 'W2430',
      sizesAvailable: '60.00',
      sizesInStock: 'W2430,W2530,W2630',
      totalSizes: '5',
      unitNowPrice: '5.00',
      unitWasPrice: '6.00',
      list: '',
      isOnSale: true,
    },
  ],
  totalPrice: 5.0,
  totalQuantity: 1,
}
const emptyBasket = {
  productList: [],
  totalPrice: 0,
  totalQuantity: 0,
}

describe('basket analytics tracking', () => {
  let products1
  let products2
  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(dataLayer, 'push')
    products1 = [
      {
        productId: 1,
        orderItemId: 1,
        name: 'Test 1',
        price: '22.00',
        quantity: 1,
      },
      {
        productId: 2,
        orderItemId: 2,
        name: 'Test 2',
        price: '20.00',
        quantity: 8,
      },
      {
        productId: 3,
        orderItemId: 3,
        name: 'Test 3',
        price: '30.00',
        quantity: 5,
      },
    ]

    products2 = [
      ...products1,
      {
        productId: 4,
        orderItemId: 4,
        name: 'Test 4',
        price: '35.00',
        quantity: 2,
      },
      {
        productId: 5,
        orderItemId: 5,
        name: 'Test 5',
        price: '15.00',
        quantity: 1,
      },
    ]
  })

  const defaultMockProducts = [
    {
      productId: 27738367,
      orderItemId: 7977477,
      lineNumber: '20N01JCRL',
      size: 'W2430',
      name: 'Nails in Siren',
      quantity: 1,
      wasPrice: '6.00',
      unitPrice: '5.00',
      totalPrice: '5.00',
      colour: 'blue',
      iscmCategory: 'EASY',
      attributes: {
        AverageOverallRating: 4.2,
        ECMC_PROD_PRODUCT_TYPE_1: 'Clothing',
        ECMC_PROD_CE3_PRODUCT_TYPE_1: 'Jeans',
      },
      items: [
        {
          quantity: 10,
          size: 'W2430',
          sku: 602017001159710,
          selected: false,
        },
        {
          quantity: 10,
          size: 'W2530',
          sku: 602017001159711,
          selected: false,
        },
        {
          quantity: 10,
          size: 'W2630',
          sku: 602017001159712,
          selected: false,
        },
        {
          quantity: 0,
          size: 'W2830',
          sku: 602017001159713,
          selected: false,
        },
        {
          quantity: 0,
          size: 'W3030',
          sku: 602017001159714,
          selected: false,
        },
      ],
    },
  ]

  const createMockState = (products = defaultMockProducts) => ({
    config: {
      currencyCode: 'EUR',
    },
    shoppingBag: {
      bag: {
        products,
        total: products.length ? '5.00' : 0,
      },
      totalItems: products.length,
    },
  })

  describe('getting basket product list difference', () => {
    it('productsDiff(): new product added', () => {
      const oldStateProducts = products1
      const newStateProducts = products2

      const diff = productsDiff(oldStateProducts, newStateProducts)
      expect(diff).toEqual([
        {
          ...newStateProducts[3],
          $status: 'added',
        },
        {
          ...newStateProducts[4],
          $status: 'added',
        },
      ])
    })

    it('products removed', () => {
      const oldStateProducts = products2
      const newStateProducts = products1

      const diff = productsDiff(oldStateProducts, newStateProducts)
      expect(diff.length).toBe(2)
      expect(diff[0]).toEqual({
        ...oldStateProducts[3],
        $status: 'removed',
      })
      expect(diff[1]).toEqual({
        ...oldStateProducts[4],
        $status: 'removed',
      })
    })

    it('product added and existing product quantity increased', () => {
      const oldStateProducts = products1
      const newStateProducts = [...products2]
      newStateProducts[1] = {
        productId: 2,
        orderItemId: 2,
        name: 'Test 2',
        price: '20.00',
        quantity: 9, // quantity increased
      }
      const diff = productsDiff(oldStateProducts, newStateProducts)
      expect(diff).toEqual([
        {
          productId: 2,
          orderItemId: 2,
          name: 'Test 2',
          price: '20.00',
          quantity: 1, // quantity difference i.e. this product has increased in quantity by 1
          $status: 'increased',
        },
        {
          ...newStateProducts[3],
          $status: 'added',
        },
        {
          ...newStateProducts[4],
          $status: 'added',
        },
      ])
    })

    it('products same so should return 0', () => {
      const oldStateProducts = products2
      const newStateProducts = products2

      const diff1 = productsDiff(oldStateProducts, newStateProducts)
      expect(diff1.length).toBe(0)
      const diff2 = productsDiff(newStateProducts, oldStateProducts)
      expect(diff2.length).toBe(0)
    })

    it('product removed and existing product quantity decreased', () => {
      const oldStateProducts = [...products2]
      oldStateProducts[1] = {
        productId: 2,
        orderItemId: 2,
        name: 'Test 2',
        price: '20.00',
        quantity: 1, // quantity decreased
      }
      const newStateProducts = products1

      const diff = productsDiff(oldStateProducts, newStateProducts)
      expect(diff.length).toBe(3)
      expect(diff[0]).toEqual({
        productId: 2,
        orderItemId: 2,
        name: 'Test 2',
        price: '20.00',
        quantity: 7, // quantity decreased,
        $status: 'increased',
      })
      expect(diff[1]).toEqual({
        ...oldStateProducts[3],
        $status: 'removed',
      })
      expect(diff[2]).toEqual({
        ...oldStateProducts[4],
        $status: 'removed',
      })
    })

    it('product list same length but item replaced because of size change', () => {
      const oldStateProducts = [...products1]
      const newStateProducts = [...products1]
      newStateProducts[1] = {
        productId: 2,
        orderItemId: 20, // order ID different because of size change
        name: 'Test 2',
        price: '20.00',
        quantity: 8,
      }

      const diff = productsDiff(oldStateProducts, newStateProducts)
      expect(diff).toEqual([
        {
          ...newStateProducts[1],
          $status: 'added',
        },
        {
          ...oldStateProducts[1],
          $status: 'removed',
        },
      ])
    })

    it('first product removed', () => {
      expect(productsDiff(products1, products1.slice(1))).toEqual([
        { ...products1[0], $status: 'removed' },
      ])
    })

    it('first product removed, and new added', () => {
      expect(
        productsDiff(products1, products1.slice(1).concat(products2[3]))
      ).toEqual([
        {
          ...products1[0],
          $status: 'removed',
        },
        {
          ...products2[3],
          $status: 'added',
        },
      ])
    })

    it('all items removed', () => {
      expect(productsDiff(products1, [])).toEqual(
        products1.map((p) => ({ ...p, $status: 'removed' }))
      )
    })

    it('multiple items added', () => {
      expect(productsDiff([], products1)).toEqual(
        products1.map((p) => ({ ...p, $status: 'added' }))
      )
    })
  })

  describe('analytics triggering', () => {
    describe('basketStateListener() records analytics when items have been', () => {
      beforeAll(() => {
        listeners.pause = false
      })

      afterAll(() => {
        listeners.pause = true
      })

      it('removed from the basket', () => {
        const oldStateProducts = createMockState()
        const newStateProducts = createMockState([])
        basketStateListener(oldStateProducts, newStateProducts)
        expect(dataLayer.push).toHaveBeenCalledTimes(1)
        const removeFromBasketEventPush = dataLayer.push.mock.calls[0]
        const setCurrentProductsPush = dataLayer.push.mock.calls[1]
        expect(removeFromBasketEventPush).toMatchSnapshot()
        expect(setCurrentProductsPush).toMatchSnapshot()
      })

      it('removed from the basket (merging from currentProduct)', () => {
        const oldStateProducts = createMockState()
        const newStateProducts = {
          ...createMockState([]),
          currentProduct: defaultMockProducts[0],
        }
        basketStateListener(oldStateProducts, newStateProducts)
        expect(dataLayer.push).toHaveBeenCalledTimes(1)
        const removeFromBasketEventPush = dataLayer.push.mock.calls[0]
        const setCurrentProductsPush = dataLayer.push.mock.calls[1]
        expect(removeFromBasketEventPush).toMatchSnapshot()
        expect(setCurrentProductsPush).toMatchSnapshot()
      })

      it('added to the basket', () => {
        const oldStateProducts = createMockState([])
        const newStateProducts = createMockState()
        basketStateListener(oldStateProducts, newStateProducts)
        expect(dataLayer.push).toHaveBeenCalledTimes(1)
        const addToBasketEventPush = dataLayer.push.mock.calls[0]
        const setCurrentProductsPush = dataLayer.push.mock.calls[1]
        expect(addToBasketEventPush).toMatchSnapshot()
        expect(setCurrentProductsPush).toMatchSnapshot()
      })

      it('added to the basket (merging from quickview)', () => {
        const oldStateProducts = createMockState([])
        const newStateProducts = {
          ...createMockState(),
          quickview: {
            product: defaultMockProducts[0],
          },
        }
        basketStateListener(oldStateProducts, newStateProducts)
        expect(dataLayer.push).toHaveBeenCalledTimes(1)
        const addToBasketEventPush = dataLayer.push.mock.calls[0]
        const setCurrentProductsPush = dataLayer.push.mock.calls[1]
        expect(addToBasketEventPush).toMatchSnapshot()
        expect(setCurrentProductsPush).toMatchSnapshot()
      })

      it('uses the data from currentProduct when the state exists', () => {
        const oldStateProducts = createMockState([])
        const newStateProducts = {
          ...createMockState(),
          currentProduct: defaultMockProducts[0],
        }
        basketStateListener(oldStateProducts, newStateProducts)
        expect(dataLayer.push).toHaveBeenCalledTimes(1)
        const firstDataLayerPushArgs = dataLayer.push.mock.calls[0]
        expect(firstDataLayerPushArgs).toEqual([
          {
            ecommerce: {
              currencyCode: 'EUR',
              add: {
                actionField: {
                  addType: 'Add to Basket',
                },
                products: [
                  {
                    id: '20N01JCRL',
                    productId: '27738367',
                    name: '(20N01JCRL) Nails in Siren',
                    price: '5.00',
                    unitWasPrice: '6.00',
                    unitNowPrice: '5.00',
                    markdown: '16.67',
                    brand: undefined,
                    colour: 'blue',
                    quantity: '1',
                    category: 'Jeans',
                    size: 'W2430',
                    totalSizes: '5',
                    sizesInStock: 'W2430,W2530,W2630',
                    sizesAvailable: '60.00',
                    reviewRating: '4.2',
                    ecmcCategory: 'EASY',
                    list: '',
                    isOnSale: true,
                  },
                ],
              },
            },
            fullBasket,
          },
          'basketSchema',
          'addToBasket',
        ])
      })

      it('should differentiate when products are added as a result of a bag merge', () => {
        const oldMergingState = mergingState.isMergingBag
        mergingState.isMergingBag = true

        const oldStateProducts = createMockState([])
        const newStateProducts = {
          ...createMockState(),
          currentProduct: defaultMockProducts[0],
        }
        basketStateListener(oldStateProducts, newStateProducts)
        expect(dataLayer.push).toHaveBeenCalledTimes(1)
        const firstDataLayerPushArgs = dataLayer.push.mock.calls[0]
        expect(firstDataLayerPushArgs).toEqual([
          {
            ecommerce: {
              currencyCode: 'EUR',
              add: {
                actionField: {
                  addType: 'Merge Bag',
                },
                products: [
                  {
                    id: '20N01JCRL',
                    productId: '27738367',
                    name: '(20N01JCRL) Nails in Siren',
                    price: '5.00',
                    unitWasPrice: '6.00',
                    unitNowPrice: '5.00',
                    markdown: '16.67',
                    brand: undefined,
                    colour: 'blue',
                    quantity: '1',
                    category: 'Jeans',
                    size: 'W2430',
                    totalSizes: '5',
                    sizesInStock: 'W2430,W2530,W2630',
                    sizesAvailable: '60.00',
                    reviewRating: '4.2',
                    ecmcCategory: 'EASY',
                    list: '',
                    isOnSale: true,
                  },
                ],
              },
            },
            fullBasket,
          },
          'basketSchema',
          'mergeBag',
        ])

        mergingState.isMergingBag = oldMergingState
      })

      it('When removing a product from the basket', () => {
        basketStateListener(createMockState(), {
          shoppingBag: {
            bag: {
              products: [],
            },
          },
        })

        expect(dataLayer.push).toHaveBeenCalledTimes(1)
        const actualDataLayerPushArgs = dataLayer.push.mock.calls[0]
        expect(actualDataLayerPushArgs).toEqual([
          {
            ecommerce: {
              remove: {
                products: [
                  {
                    id: '20N01JCRL',
                    productId: '27738367',
                    name: '(20N01JCRL) Nails in Siren',
                    price: '5.00',
                    unitWasPrice: '6.00',
                    unitNowPrice: '5.00',
                    markdown: '16.67',
                    brand: undefined,
                    colour: 'blue',
                    quantity: '1',
                    category: 'Jeans',
                    size: 'W2430',
                    totalSizes: '5',
                    sizesInStock: 'W2430,W2530,W2630',
                    sizesAvailable: '60.00',
                    reviewRating: '4.2',
                    ecmcCategory: 'EASY',
                    list: '',
                    isOnSale: true,
                  },
                ],
              },
            },
            fullBasket: emptyBasket,
          },
          'basketSchema',
          'removeFromBasket',
        ])
      })
    })

    it('pauseBasket() should set listener.pause to true if the action type is LOGOUT', () => {
      const actionType = {
        type: 'LOGOUT',
      }
      pauseBasket(actionType)
      expect(listeners.pause).toBe(true)
      expect(listeners.pauseTimer).not.toBeNull()
    })

    it('pauseBasket() should set listener.pause to false if the action type is not LOGOUT', () => {
      const actionType = {
        type: 'FETCH_ORDER_SUMMARY_SUCCESS',
      }
      pauseBasket(actionType)
      expect(listeners.pause).toBe(false)
      expect(listeners.pauseTimer).not.toBeNull()
    })

    it('clearBasketStateListenerPause()', () => {
      listeners.pause = true
      listeners.pauseTimer = setTimeout()
      clearBasketStateListenerPause()
      expect(listeners.pause).toBe(false)
      expect(listeners.pauseTimer).toBeNull()
      listeners.pause = true
    })

    describe('#mergingState', () => {
      let oldMergingState
      beforeAll(() => {
        oldMergingState = mergingState.isMergingBag
      })
      afterAll(() => {
        mergingState.isMergingBag = oldMergingState
      })

      describe('#startMerging', () => {
        it('should set isMergingBag to true', () => {
          mergingState.isMergingBag = false
          startMerging()
          expect(mergingState.isMergingBag).toBe(true)
        })
      })

      describe('#endMerging', () => {
        it('should set isMergingBag to false', () => {
          mergingState.isMergingBag = true
          endMerging()
          expect(mergingState.isMergingBag).toBe(false)
        })
      })
    })

    it('default config export', () => {
      config()

      expect(
        require('../../storeObserver').addStateListeners
      ).toHaveBeenCalledWith(basketStateListener)

      expect(
        require('../analytics-middleware').addPostDispatchListeners
      ).toHaveBeenCalledWith(
        ['UPDATE_BAG', 'NO_BAG'],
        clearBasketStateListenerPause
      )

      expect(
        require('../analytics-middleware').addPostDispatchListeners
      ).toHaveBeenCalledWith('BAG_MERGE_STARTED', startMerging)

      expect(
        require('../analytics-middleware').addPostDispatchListeners
      ).toHaveBeenCalledWith('BAG_MERGE_FINISHED', endMerging)

      expect(
        require('../analytics-middleware').addPostDispatchListeners
      ).toHaveBeenCalledWith('RESET_FORM', expect.any(Function))

      expect(
        require('../analytics-middleware').addPreDispatchListeners
      ).toHaveBeenCalledWith('LOGOUT', pauseBasket)

      expect(
        require('../analytics-middleware').addPreDispatchListeners
      ).toHaveBeenCalledWith('FETCH_ORDER_SUMMARY_SUCCESS', pauseBasket)
    })

    describe('basketStateListener()', () => {
      beforeAll(() => {
        listeners.pause = false
      })

      afterAll(() => {
        listeners.pause = true
      })

      it('records analytics when items have been removed from the basket', () => {
        const oldStateProducts = createMockState()
        const newStateProducts = createMockState([])
        basketStateListener(oldStateProducts, newStateProducts)
        expect(dataLayer.push).toHaveBeenCalledTimes(1)
        const firstDataLayerPushArgs = dataLayer.push.mock.calls[0]
        expect(firstDataLayerPushArgs).toEqual([
          {
            ecommerce: {
              currencyCode: 'EUR',
              remove: {
                products: [
                  {
                    id: '20N01JCRL',
                    productId: '27738367',
                    name: '(20N01JCRL) Nails in Siren',
                    price: '5.00',
                    unitWasPrice: '6.00',
                    unitNowPrice: '5.00',
                    markdown: '16.67',
                    brand: undefined,
                    colour: 'blue',
                    quantity: '1',
                    category: 'Jeans',
                    size: 'W2430',
                    totalSizes: '5',
                    sizesInStock: 'W2430,W2530,W2630',
                    sizesAvailable: '60.00',
                    reviewRating: '4.2',
                    ecmcCategory: 'EASY',
                    list: '',
                    isOnSale: true,
                  },
                ],
              },
            },
            fullBasket: emptyBasket,
          },
          'basketSchema',
          'removeFromBasket',
        ])
      })

      it('records analytics when items have been added to the basket', () => {
        const oldStateProducts = createMockState([])
        const newStateProducts = createMockState()
        basketStateListener(oldStateProducts, newStateProducts)
        expect(dataLayer.push).toHaveBeenCalledTimes(1)
        const firstDataLayerPushArgs = dataLayer.push.mock.calls[0]
        expect(firstDataLayerPushArgs).toEqual([
          {
            ecommerce: {
              currencyCode: 'EUR',
              add: {
                actionField: {
                  addType: 'Add to Basket',
                },
                products: [
                  {
                    id: '20N01JCRL',
                    productId: '27738367',
                    name: '(20N01JCRL) Nails in Siren',
                    price: '5.00',
                    unitWasPrice: '6.00',
                    unitNowPrice: '5.00',
                    markdown: '16.67',
                    brand: undefined,
                    colour: 'blue',
                    quantity: '1',
                    category: 'Jeans',
                    size: 'W2430',
                    totalSizes: '5',
                    sizesInStock: 'W2430,W2530,W2630',
                    sizesAvailable: '60.00',
                    reviewRating: '4.2',
                    ecmcCategory: 'EASY',
                    list: '',
                    isOnSale: true,
                  },
                ],
              },
            },
            fullBasket,
          },
          'basketSchema',
          'addToBasket',
        ])
      })

      it('uses the data from currentProduct when the state exists', () => {
        const oldStateProducts = createMockState([])
        const newStateProducts = {
          ...createMockState(),
          currentProduct: defaultMockProducts[0],
        }
        basketStateListener(oldStateProducts, newStateProducts)
        expect(dataLayer.push).toHaveBeenCalledTimes(1)
        const firstDataLayerPushArgs = dataLayer.push.mock.calls[0]
        expect(firstDataLayerPushArgs).toEqual([
          {
            ecommerce: {
              currencyCode: 'EUR',
              add: {
                actionField: {
                  addType: 'Add to Basket',
                },
                products: [
                  {
                    id: '20N01JCRL',
                    productId: '27738367',
                    name: '(20N01JCRL) Nails in Siren',
                    price: '5.00',
                    unitWasPrice: '6.00',
                    unitNowPrice: '5.00',
                    markdown: '16.67',
                    brand: undefined,
                    colour: 'blue',
                    quantity: '1',
                    category: 'Jeans',
                    size: 'W2430',
                    totalSizes: '5',
                    sizesInStock: 'W2430,W2530,W2630',
                    sizesAvailable: '60.00',
                    reviewRating: '4.2',
                    ecmcCategory: 'EASY',
                    list: '',
                    isOnSale: true,
                  },
                ],
              },
            },
            fullBasket,
          },
          'basketSchema',
          'addToBasket',
        ])
      })

      it("should do nothing, if the basket hasn't changed", () => {
        const oldStateProducts = createMockState()
        const newStateProducts = createMockState()
        basketStateListener(oldStateProducts, newStateProducts)
        expect(dataLayer.push).toHaveBeenCalledTimes(0)
      })
    })
  })
})
