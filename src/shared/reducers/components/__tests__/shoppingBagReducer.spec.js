import reducerWithStorage, { reducer } from '../shoppingBagReducer'
import configureMockStore from '../../../../../test/unit/lib/configure-mock-store'
import { UPDATE_LOCATION } from 'react-router-redux'
import mockdate from 'mockdate'
import * as logger from '../../../../client/lib/logger'

jest.mock('../../../../client/lib/logger')

describe('Shopping Bag Reducer', () => {
  beforeAll(() => {
    mockdate.set('1/1/2019')
  })

  afterAll(() => {
    mockdate.reset()
  })

  describe('decorated reducer withStorage', () => {
    it('should update bag with lastPersistTime', () => {
      const bag = { foo: 'bar' }
      expect(
        reducerWithStorage(
          { bag: {} },
          {
            type: 'UPDATE_BAG',
            bag,
          }
        )
      ).toEqual({
        bag: {
          ...bag,
          deliveryMessageThresholds: {},
        },
        lastPersistTime: 1546300800000,
      })
    })
  })

  describe('reducer', () => {
    it('Default values', () => {
      const state = configureMockStore().getState()
      expect(state.shoppingBag.totalItems).toBe(0)
      expect(state.shoppingBag.isAddingToBag).toBe(false)
      expect(state.shoppingBag.miniBagOpen).toBe(false)
      expect(state.shoppingBag.autoClose).toBe(false)
      expect(state.shoppingBag.promotionCodeConfirmation).toBe(false)
      expect(state.shoppingBag.bag.products).toEqual([])
      expect(state.shoppingBag.bag.orderId).toBe(0)
      expect(state.shoppingBag.loadingShoppingBag).toBe(false)
      expect(state.shoppingBag.recentlyAdded.products).toEqual([])
      expect(state.shoppingBag.recentlyAdded.quantity).toBe(0)
      expect(state.shoppingBag.recentlyAdded.isMiniBagConfirmShown).toBe(false)
    })
    describe('UPDATE_SHOPPING_BAG_BADGE_COUNT', () => {
      it('should update `totalItems`', () => {
        expect(
          reducer(
            {},
            {
              type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT',
              count: 12,
            }
          )
        ).toEqual({
          totalItems: 12,
        })
      })
    })
    describe('SET_CURRENTLY_ADDING_TO_BAG', () => {
      it('should set `isAddingToBag`', () => {
        expect(
          reducer(
            {},
            {
              type: 'SET_ADDING_TO_BAG',
            }
          )
        ).toEqual({
          isAddingToBag: true,
        })
      })
      it('should clear `isAddingToBag`', () => {
        expect(
          reducer(
            {},
            {
              type: 'CLEAR_ADDING_TO_BAG',
            }
          )
        ).toEqual({
          isAddingToBag: false,
        })
      })
    })
    describe('OPEN_MINI_BAG', () => {
      it('should open mini bag', () => {
        expect(
          reducer(
            {},
            {
              type: 'OPEN_MINI_BAG',
            }
          )
        ).toEqual({
          miniBagOpen: true,
        })
      })

      it('should open mini bag with autoClose enabled', () => {
        expect(
          reducer(
            {},
            {
              type: 'OPEN_MINI_BAG',
              autoClose: true,
            }
          )
        ).toEqual({
          miniBagOpen: true,
          autoClose: true,
        })
      })

      it('should open mini bag with autoClose disabled', () => {
        expect(
          reducer(
            {},
            {
              type: 'OPEN_MINI_BAG',
              autoClose: false,
            }
          )
        ).toEqual({
          miniBagOpen: true,
          autoClose: false,
        })
      })
    })
    describe('CLOSE_MINI_BAG', () => {
      it('should close mini bag', () => {
        expect(
          reducer(
            { bag: { products: [], orderId: 0 } },
            {
              type: 'CLOSE_MINI_BAG',
            }
          ).miniBagOpen
        ).toBe(false)
      })

      it('should reset all products to their non-editing state', () => {
        const products = [
          { productId: 1, editing: true },
          { productId: 2, editing: false },
          { productId: 3, editing: true },
        ]
        expect(
          reducer(
            { bag: { products } },
            {
              type: 'CLOSE_MINI_BAG',
            }
          ).bag.products
        ).toEqual([
          { productId: 1, editing: false },
          { productId: 2, editing: false },
          { productId: 3, editing: false },
        ])
      })

      it('should return the original products array if all items have `editing: false`', () => {
        const products = [
          { productId: 1, editing: false },
          { productId: 2, editing: false },
          { productId: 3, editing: false },
        ]
        expect(
          reducer(
            { bag: { products } },
            {
              type: 'CLOSE_MINI_BAG',
            }
          ).bag.products
        ).toBe(products)
      })
    })
    describe('SET_LOADING_SHOPPING_BAG', () => {
      it('should set `loadingShoppingBag`', () => {
        expect(
          reducer(
            {},
            {
              type: 'SET_LOADING_SHOPPING_BAG',
              isLoading: true,
            }
          )
        ).toEqual({
          loadingShoppingBag: true,
        })
      })
    })
    describe('SET_PROMOTION_CODE_CONFIRMATION', () => {
      it('should set `promotionCodeConfirmation`', () => {
        expect(
          reducer(
            {},
            {
              type: 'SET_PROMOTION_CODE_CONFIRMATION',
              promotionCodeConfirmation: true,
            }
          )
        ).toEqual({
          promotionCodeConfirmation: true,
        })
      })
    })

    describe('UPDATE_BAG', () => {
      const bag = {
        products: [
          {
            productId: 30275174,
            catEntryId: 30275208,
            orderItemId: 8800490,
            lineNumber: '35S13MMUS',
            size: '16',
            name: 'Velvet Square Neck Mini Slip Dress',
            quantity: 1,
            lowStock: false,
            inStock: true,
            unitPrice: '26.00',
            totalPrice: '26.00',
            isBundleOrOutfit: false,
          },
        ],
        orderId: 123456,
        subTotal: '26.00',
        total: '30.00',
      }

      it('should update bag details', () => {
        const expectedBag = {
          ...bag,
          deliveryMessageThresholds: {},
        }

        expect(
          reducer(
            {},
            {
              type: 'UPDATE_BAG',
              bag,
            }
          )
        ).toEqual({
          bag: {
            ...expectedBag,
          },
        })

        expect(logger.error).toHaveBeenCalledTimes(0)
        expect(logger.nrBrowserLogError).toHaveBeenCalledTimes(0)
      })

      it('decode and parse deliveryThresholdsJson', () => {
        expect(
          reducer(
            {},
            {
              type: 'UPDATE_BAG',
              bag: {
                ...bag,
                deliveryThresholdsJson:
                  '%7B%22nudgeMessageThreshold%22%3A30.0%2C%22standardDeliveryThreshold%22%3A50.0%7D',
              },
            }
          )
        ).toEqual({
          bag: {
            ...bag,
            deliveryMessageThresholds: {
              nudgeMessageThreshold: 30.0,
              standardDeliveryThreshold: 50.0,
            },
          },
        })

        expect(logger.error).toHaveBeenCalledTimes(0)
        expect(logger.nrBrowserLogError).toHaveBeenCalledTimes(0)
      })

      it('logs an error if deliveryThresholdsJson is not valid', () => {
        const bagWithWrongDeliveryThresholds = {
          ...bag,
          deliveryThresholdsJson: 'thisIsNotValid',
        }
        expect(
          reducer(
            {},
            {
              type: 'UPDATE_BAG',
              bag: bagWithWrongDeliveryThresholds,
            }
          )
        ).toEqual({
          bag: {
            ...bag,
            deliveryMessageThresholds: {},
          },
        })

        expect(logger.error).toHaveBeenCalledTimes(1)
        expect(logger.error).toHaveBeenCalledWith(
          'deliveryThresholdsJson',
          expect.objectContaining({
            name: 'SyntaxError',
            message: 'Unexpected token h in JSON at position 1',
          })
        )
        expect(logger.nrBrowserLogError).toHaveBeenCalledTimes(1)
        expect(logger.nrBrowserLogError).toHaveBeenCalledWith(
          'Error parsing deliveryThresholdsJson',
          expect.objectContaining({
            name: 'SyntaxError',
            message: 'Unexpected token h in JSON at position 1',
          })
        )
      })
    })

    describe('UPDATE_SHOPPING_BAG_PRODUCT', () => {
      const bag = {
        products: [
          {
            productId: 30275174,
            size: '16',
            name: 'Velvet Square Neck Mini Slip Dress',
            quantity: 1,
          },
        ],
        orderId: 123456,
      }
      it('should update bag product details if index is equal', () => {
        expect(
          reducer(
            { bag },
            {
              type: 'UPDATE_SHOPPING_BAG_PRODUCT',
              index: 0,
              update: {
                quantity: 3,
              },
            }
          )
        ).toEqual({
          bag: {
            products: [
              {
                productId: 30275174,
                size: '16',
                name: 'Velvet Square Neck Mini Slip Dress',
                quantity: 3,
              },
            ],
            orderId: 123456,
          },
        })
      })
      it('should not update bag product details if index is not equal', () => {
        expect(
          reducer(
            { bag },
            {
              type: 'UPDATE_SHOPPING_BAG_PRODUCT',
              index: 13,
              update: {
                quantity: 3,
              },
            }
          )
        ).toEqual({
          bag: {
            products: [
              {
                productId: 30275174,
                size: '16',
                name: 'Velvet Square Neck Mini Slip Dress',
                quantity: 1,
              },
            ],
            orderId: 123456,
          },
        })
      })
    })
    describe('EMPTY_SHOPPING_BAG', () => {
      it('should reset shopping bag details', () => {
        const bag = {
          products: [
            {
              productId: 30275174,
              catEntryId: 30275208,
              orderItemId: 8800490,
              lineNumber: '35S13MMUS',
              size: '16',
              name: 'Velvet Square Neck Mini Slip Dress',
              quantity: 1,
              lowStock: false,
              inStock: true,
              unitPrice: '26.00',
              totalPrice: '26.00',
              isBundleOrOutfit: false,
            },
          ],
          orderId: 123456,
          subTotal: '26.00',
          total: '30.00',
        }
        expect(
          reducer(
            { bag, totalItems: 1 },
            {
              type: 'EMPTY_SHOPPING_BAG',
            }
          )
        ).toEqual({
          bag: {
            products: [],
            orderId: 0,
          },
          totalItems: 0,
          recentlyAdded: {
            products: [],
            quantity: 0,
            isMiniBagConfirmShown: false,
          },
        })
      })
    })
    describe('FETCH_ORDER_SUMMARY_SUCCESS', () => {
      it('should set details if basket', () => {
        const basket = {
          products: [
            {
              productId: 30275174,
              catEntryId: 30275208,
              orderItemId: 8800490,
              lineNumber: '35S13MMUS',
              size: '16',
              name: 'Velvet Square Neck Mini Slip Dress',
              quantity: 1,
              lowStock: false,
              inStock: true,
              unitPrice: '26.00',
              totalPrice: '26.00',
              isBundleOrOutfit: false,
            },
            {
              quantity: 3,
            },
          ],
          orderId: 123456,
          subTotal: '26.00',
          total: '30.00',
        }
        expect(
          reducer(
            {
              bag: {
                products: [{}, {}],
              },
              totalItems: 2,
            },
            {
              type: 'FETCH_ORDER_SUMMARY_SUCCESS',
              data: {
                basket,
              },
            }
          )
        ).toEqual({
          bag: basket,
          totalItems: 4,
        })
      })
      it('should reset details if basket not there', () => {
        expect(
          reducer(
            {
              totalItems: 9,
              bag: {
                products: [{}],
              },
            },
            {
              type: 'FETCH_ORDER_SUMMARY_SUCCESS',
              data: {},
            }
          )
        ).toEqual({
          totalItems: 0,
          bag: {
            products: [],
            orderId: 0,
          },
          recentlyAdded: {
            products: [],
            quantity: 0,
            isMiniBagConfirmShown: false,
          },
        })
      })
    })
    describe('PRODUCTS_ADDED_TO_BAG', () => {
      it('should update `recentlyAdded`', () => {
        const products = [
          {
            productId: 30275174,
            catEntryId: 30275208,
            orderItemId: 8800490,
            lineNumber: '35S13MMUS',
            size: '16',
            name: 'Velvet Square Neck Mini Slip Dress',
            quantity: 1,
            lowStock: false,
            inStock: true,
            unitPrice: '26.00',
            totalPrice: '26.00',
            isBundleOrOutfit: false,
          },
        ]
        expect(
          reducer(
            {},
            {
              type: 'PRODUCTS_ADDED_TO_BAG',
              payload: {
                products,
                quantity: 2,
              },
            }
          )
        ).toEqual({
          recentlyAdded: {
            isMiniBagConfirmShown: false,
            products,
            quantity: 2,
          },
        })
      })
    })
    describe('SHOW_MINIBAG_CONFIRM', () => {
      it('should update `isMiniBagConfirmShown`', () => {
        const products = [
          {
            productId: 30275174,
            catEntryId: 30275208,
            orderItemId: 8800490,
            lineNumber: '35S13MMUS',
            size: '16',
            name: 'Velvet Square Neck Mini Slip Dress',
            quantity: 1,
            lowStock: false,
            inStock: true,
            unitPrice: '26.00',
            totalPrice: '26.00',
            isBundleOrOutfit: false,
          },
        ]
        expect(
          reducer(
            {
              recentlyAdded: {
                products,
                quantity: 2,
              },
            },
            {
              type: 'SHOW_MINIBAG_CONFIRM',
              payload: true,
            }
          )
        ).toEqual({
          recentlyAdded: {
            isMiniBagConfirmShown: true,
            products,
            quantity: 2,
          },
        })
      })
    })
    describe('UPDATE_ACTIVE_ITEM', () => {
      it('should update whole `recentlyAdded`', () => {
        const products = [
          {
            productId: 30275174,
            catEntryId: 30275208,
            orderItemId: 8800490,
            lineNumber: '35S13MMUS',
            size: '16',
            name: 'Velvet Square Neck Mini Slip Dress',
            quantity: 1,
            lowStock: false,
            inStock: true,
            unitPrice: '26.00',
            totalPrice: '26.00',
            isBundleOrOutfit: false,
          },
        ]
        expect(
          reducer(
            {
              recentlyAdded: {
                products,
              },
            },
            {
              type: 'UPDATE_ACTIVE_ITEM',
            }
          )
        ).toEqual({
          recentlyAdded: {
            isMiniBagConfirmShown: false,
            products,
            quantity: 0,
          },
        })
      })
    })
    describe('PRE_CACHE_RESET', () => {
      it('should set initial state', () => {
        const bag = {
          products: [
            {
              productId: 30275174,
              size: '16',
              name: 'Velvet Square Neck Mini Slip Dress',
              quantity: 1,
            },
          ],
          orderId: 123456,
          subTotal: '26.00',
          total: '30.00',
        }
        expect(
          reducer(
            { bag, miniBagOpen: true, totalItems: 1 },
            {
              type: 'PRE_CACHE_RESET',
            }
          )
        ).toEqual({
          totalItems: 0,
          isAddingToBag: false,
          miniBagOpen: false,
          autoClose: false,
          promotionCodeConfirmation: false,
          bag: {
            products: [],
            orderId: 0,
          },
          loadingShoppingBag: false,
          recentlyAdded: {
            products: [],
            quantity: 0,
            isMiniBagConfirmShown: false,
          },
          messages: [],
        })
      })
    })
    describe('LOGOUT', () => {
      it('should reset mini bag and not change `miniBagOpen` state when logout', () => {
        const bag = {
          products: [
            {
              productId: 30275174,
              size: '16',
              name: 'Velvet Square Neck Mini Slip Dress',
              quantity: 1,
            },
          ],
          orderId: 123456,
          subTotal: '26.00',
          total: '30.00',
        }
        expect(
          reducer(
            { bag, miniBagOpen: true, totalItems: 1 },
            {
              type: 'LOGOUT',
            }
          )
        ).toEqual({
          totalItems: 0,
          isAddingToBag: false,
          miniBagOpen: true,
          autoClose: false,
          promotionCodeConfirmation: false,
          bag: {
            products: [],
            orderId: 0,
          },
          loadingShoppingBag: false,
          recentlyAdded: {
            products: [],
            quantity: 0,
            isMiniBagConfirmShown: false,
          },
          messages: [],
        })
      })
    })
    describe('`UPDATE_LOCATION`', () => {
      it('should close mini bag when change location', () => {
        const bag = {
          products: [
            {
              productId: 30275174,
              size: '16',
              name: 'Velvet Square Neck Mini Slip Dress',
              quantity: 1,
            },
          ],
          orderId: 123456,
          subTotal: '26.00',
          total: '30.00',
        }
        expect(
          reducer(
            { bag, miniBagOpen: true, totalItems: 1 },
            {
              type: UPDATE_LOCATION,
            }
          )
        ).toEqual({
          bag,
          miniBagOpen: false,
          totalItems: 1,
        })
      })
    })

    describe('ADD_MINIBAG_MESSAGE', () => {
      it('adds a message to the store', () => {
        const initialState = {
          messages: [],
        }
        const payload = { message: 'this is a message' }
        const action = {
          type: 'ADD_MINIBAG_MESSAGE',
          payload,
        }
        const expectedState = { messages: [payload] }

        expect(reducer(initialState, action)).toEqual(expectedState)
      })
    })

    describe('REMOVE_MINIBAG_MESSAGE', () => {
      it('removes a message from the store', () => {
        const initialState = {
          messages: [
            { message: 'this is a message', id: '1234' },
            { message: 'this is another message', id: '5678' },
          ],
        }
        const id = '1234'
        const action = {
          type: 'REMOVE_MINIBAG_MESSAGE',
          id,
        }
        const expectedState = {
          messages: [{ message: 'this is another message', id: '5678' }],
        }

        expect(reducer(initialState, action)).toEqual(expectedState)
      })
    })

    describe('CLEAR_MINIBAG_MESSAGES', () => {
      it('clears all messages from the store', () => {
        const initialState = {
          messages: [
            { message: 'this is a message', id: '1234' },
            { message: 'this is another message', id: '5678' },
          ],
        }
        const action = {
          type: 'CLEAR_MINIBAG_MESSAGES',
        }
        const expectedState = { messages: [] }

        expect(reducer(initialState, action)).toEqual(expectedState)
      })
    })

    describe('SHOW_MINIBAG_MESSAGE', () => {
      it('sets message visibility to true', () => {
        const initialState = {
          messages: [
            { message: 'this is a message', id: '1234', isVisible: false },
          ],
        }
        const action = {
          type: 'SHOW_MINIBAG_MESSAGE',
          id: '1234',
        }
        const expectedState = {
          messages: [
            { message: 'this is a message', id: '1234', isVisible: true },
          ],
        }

        expect(reducer(initialState, action)).toEqual(expectedState)
      })
    })

    describe('HIDE_MINIBAG_MESSAGE', () => {
      it('sets message visibility to false', () => {
        const initialState = {
          messages: [
            { message: 'this is a message', id: '1234', isVisible: true },
          ],
        }
        const action = {
          type: 'HIDE_MINIBAG_MESSAGE',
          id: '1234',
        }
        const expectedState = {
          messages: [
            { message: 'this is a message', id: '1234', isVisible: false },
          ],
        }

        expect(reducer(initialState, action)).toEqual(expectedState)
      })
    })

    describe('RESET_SHOPPING_BAG', () => {
      it('resets bag to initial state', () => {
        const initialState = {}
        const action = {
          type: 'RESET_SHOPPING_BAG',
        }
        const newState = reducer(initialState, action)

        expect(newState.totalItems).toBe(0)
        expect(newState.isAddingToBag).toBe(false)
        expect(newState.miniBagOpen).toBe(false)
        expect(newState.autoClose).toBe(false)
        expect(newState.promotionCodeConfirmation).toBe(false)
        expect(newState.bag.products).toEqual([])
        expect(newState.bag.orderId).toBe(0)
        expect(newState.loadingShoppingBag).toBe(false)
        expect(newState.recentlyAdded.products).toEqual([])
        expect(newState.recentlyAdded.quantity).toBe(0)
        expect(newState.recentlyAdded.isMiniBagConfirmShown).toBe(false)
      })
    })

    describe('NO_BAG', () => {
      it('reverts to empty bag and keeps other state', () => {
        const initialState = {
          bag: {
            orderId: 23312321,
            products: [{}, {}],
          },
          foo: 'bar',
        }
        const action = { type: 'NO_BAG' }
        const expectedState = {
          bag: {
            orderId: 0,
            products: [],
          },
          foo: 'bar',
          totalItems: 0,
          messages: [],
        }

        expect(reducer(initialState, action)).toEqual(expectedState)
      })
    })
  })
})
