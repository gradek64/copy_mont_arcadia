import { path } from 'ramda'
import { createStore } from 'redux'
import nock from 'nock'
import configureStore from '../../../../shared/lib/configure-store'
import configureMockStore from 'test/unit/lib/configure-mock-store'

import checkoutReducer from '../checkoutReducer'
import {
  setDeliveryEditingEnabled,
  setStoreUpdating,
  setOrderSummaryError,
  setOrderSummary,
  putOrderSummary,
  clearOrderSummaryBasket,
} from '../../../actions/common/checkoutActions'

const createOrderSummaryResponse = () => ({
  ageVerificationDeliveryConfirmationRequired: false,
  basket: {
    ageVerificationRequired: false,
    deliveryOptions: [
      {
        deliveryOptionExternalId: 'retail_store_immediate',
        deliveryOptionId: 51017,
        enabled: false,
        label: 'Collect From Store Today \u00a33.00',
        selected: false,
      },
      {
        deliveryOptionExternalId: 'retail_store_standard',
        deliveryOptionId: 45019,
        enabled: true,
        label: 'Free Collect From Store Standard \u00a30.00',
        selected: true,
      },
      {
        deliveryOptionExternalId: 'retail_store_collection',
        deliveryOptionId: 50517,
        enabled: true,
        label: 'Collect from ParcelShop \u00a34.00',
        selected: false,
      },
      {
        deliveryOptionExternalId: 'n3',
        deliveryOptionId: 28004,
        enabled: true,
        label: 'Express / Nominated Day Delivery \u00a36.00',
        selected: false,
      },
      {
        deliveryOptionExternalId: 'retail_store_express',
        deliveryOptionId: 56018,
        enabled: true,
        label: 'Collect From Store Express \u00a33.00',
        selected: false,
      },
      {
        deliveryOptionExternalId: 's',
        deliveryOptionId: 26504,
        enabled: true,
        label: 'Standard Delivery \u00a34.00',
        selected: false,
      },
    ],
    discounts: [],
    inventoryPositions: {
      item_1: {
        catentryId: '20688467',
        inventorys: [
          {
            cutofftime: '2100',
            expressdates: ['2018-01-10', '2018-01-11'],
            ffmcenterId: 12556,
            quantity: 45,
          },
        ],
        partNumber: '602015000864158',
      },
    },
    orderId: 700381188,
    products: [
      {
        ageVerificationRequired: false,
        assets: [
          {
            assetType: 'IMAGE_SMALL',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/30T08IGRY_small.jpg',
          },
          {
            assetType: 'IMAGE_THUMB',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/30T08IGRY_thumb.jpg',
          },
          {
            assetType: 'IMAGE_NORMAL',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/30T08IGRY_normal.jpg',
          },
          {
            assetType: 'IMAGE_LARGE',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/30T08IGRY_large.jpg',
          },
        ],
        attributes: {},
        bundleProducts: [],
        bundleSlots: [],
        catEntryId: 20688467,
        colourSwatches: [],
        inStock: true,
        isBundleOrOutfit: false,
        items: [],
        lineNumber: '30T08IGRY',
        lowStock: false,
        name: 'TALL Flannel Belted Peg Trousers',
        orderItemId: 7940619,
        productId: 20688452,
        quantity: 1,
        shipModeId: 45019,
        size: '12',
        totalPrice: '40.00',
        tpmLinks: [],
        unitPrice: '40.00',
      },
    ],
    promotions: [],
    restrictedDeliveryItem: false,
    savedProducts: [],
    subTotal: '40.00',
    total: '40.00',
    totalBeforeDiscount: '40.00',
  },
  deliveryInstructions: '',
  deliveryLocations: [
    {
      deliveryLocationType: 'HOME',
      deliveryMethods: [],
      enabled: true,
      label:
        'Home Delivery Standard (UK up to 4 working days; worldwide varies)  Express (UK next or nominated day; worldwide varies)',
      selected: false,
    },
    {
      deliveryLocationType: 'STORE',
      deliveryMethods: [
        {
          additionalDescription: 'Collection date Sunday 14 January 2018',
          cost: '3.00',
          deliveryOptions: [],
          deliveryType: 'STORE_EXPRESS',
          enabled: true,
          label: 'Collect From Store Express',
          selected: false,
          shipModeId: 56018,
        },
        {
          additionalDescription: 'Collection date Sunday 14 January 2018',
          deliveryOptions: [],
          deliveryType: 'STORE_STANDARD',
          enabled: true,
          label: 'Collect From Store Standard',
          selected: true,
          shipCode: 'Retail Store Standard',
          shipModeId: 45019,
        },
      ],
      enabled: true,
      label:
        'Collect from Store Standard (3-7 working days) Express (next day)',
      selected: true,
    },
    {
      deliveryLocationType: 'PARCELSHOP',
      deliveryMethods: [],
      enabled: true,
      label:
        'Collect from ParcelShop - UK only Thousands of local shops open early and late Next Day Delivery',
      selected: false,
    },
  ],
  deliveryStoreCode: 'TM8137',
  estimatedDelivery: ['No later than\u00a0Sunday 14 January 2018'],
  giftCards: [],
  savedAddresses: [],
  shippingCountry: 'United Kingdom',
  smsMobileNumber: '',
  storeDetails: {
    address1: 'c/o Top Shop, 60/64 The Strand',
    address2: '',
    city: 'Strand',
    country: 'United Kingdom',
    postcode: 'WC2N 5LR',
  },
  version: '1.10',
})

describe('checkoutReducer', () => {
  // EXP-313
  describe('SET_STORE_WITH_PARCEL', () => {
    it('should set storeWithParcel value to true', () => {
      const store = createStore(checkoutReducer)
      store.dispatch({
        type: 'SET_STORE_WITH_PARCEL',
        storeWithParcel: true,
      })
      expect(path(['storeWithParcel'], store.getState())).toEqual(true)
    })
  })

  describe('DELIVERY_AND_PAYMENT_SET_DELIVERY_EDITING_ENABLED', () => {
    it('set deliveryEditingEnabled to true when "enabled" = true', () => {
      const store = createStore(checkoutReducer)
      store.dispatch(setDeliveryEditingEnabled(true))
      expect(
        path(['deliveryAndPayment', 'deliveryEditingEnabled'], store.getState())
      ).toEqual(true)
    })

    it('set deliveryEditingEnabled to false when "enabled" = false', () => {
      const store = createStore(checkoutReducer)
      store.dispatch(setDeliveryEditingEnabled(false))
      expect(
        path(['deliveryAndPayment', 'deliveryEditingEnabled'], store.getState())
      ).toEqual(false)
    })
  })

  describe('SET_SAVE_PAYMENT_DETAILS_ENABLED', () => {
    it('set savePaymentDetails to true when "enabled" = true', () => {
      const store = createStore(checkoutReducer)
      store.dispatch(setDeliveryEditingEnabled(true))
      expect(
        path(['deliveryAndPayment', 'deliveryEditingEnabled'], store.getState())
      ).toEqual(true)
    })

    it('set savePaymentDetails to false when "enabled" = false', () => {
      const store = createStore(checkoutReducer)
      store.dispatch(setDeliveryEditingEnabled(false))
      expect(
        path(['deliveryAndPayment', 'deliveryEditingEnabled'], store.getState())
      ).toEqual(false)
    })
  })

  describe('FETCH_ORDER_SUMMARY_SUCCESS', () => {
    it('set orderSummary and orderCompleted to object', () => {
      const store = createStore(checkoutReducer)
      const state = store.getState()
      store.dispatch(clearOrderSummaryBasket())
      expect(path(['orderSummary'], state)).toEqual({})
      expect(path(['orderCompleted'], state)).toEqual({})
    })
  })

  describe('order summary', () => {
    it('sets the order summary error', () => {
      const store = createStore(checkoutReducer)
      const obj = { test: 'test' }
      expect(store.getState().orderSummaryError).toEqual({})
      store.dispatch(setOrderSummaryError(obj))
      expect(store.getState().orderSummaryError).toEqual(obj)
    })

    it("set's the order summary", () => {
      const resp = createOrderSummaryResponse()
      const store = configureStore()
      expect(store.getState().checkout.orderSummary).toEqual({})
      store.dispatch(setOrderSummary(resp))
      expect(store.getState().checkout.orderSummary).toEqual(resp)
    })

    it('putOrderSummary() empties order summary error', (done) => {
      const store = configureMockStore({
        checkout: {
          orderSummaryError: {
            message: 'error',
          },
        },
      })

      nock('http://localhost:3000')
        .put('/api/checkout/order_summary', {})
        .reply(200, { basket: { products: [] } })

      store.subscribeUntilPasses(() => {
        expect(store.getState().checkout.orderSummaryError).toEqual({})
        done()
      })

      store.dispatch(putOrderSummary({}))
    })
  })

  describe('setStoreUpdating()', () => {
    it('sets boolean', () => {
      const store = createStore(checkoutReducer)
      store.dispatch(setStoreUpdating(true))
      expect(store.getState().storeUpdating).toEqual(true)
    })
  })

  describe('ADDRESS_BOOK_DELETE_ADDRESS', () => {
    it('should update the savedAddresses with the request payload', () => {
      const address1 = 'somewhere'
      const address2 = 'somewhere else'
      const store = configureMockStore({
        checkout: { orderSummary: { savedAddresses: [address1, address2] } },
      })
      const payload = {
        DeliveryOptionsDetails: {
          deliveryoptionsform: {
            savedAddresses: [address1],
          },
        },
      }
      store.dispatch({
        type: 'ADDRESS_BOOK_DELETE_ADDRESS',
        payload,
      })
      const updatedSavedAddresses = store.getState().checkout.orderSummary
        .savedAddresses
      expect(updatedSavedAddresses).toEqual([address1])
    })

    it('should set savedAddresses to an empty array if the payload does not contain savedAddresses', () => {
      const store = configureMockStore({
        checkout: { orderSummary: {} },
      })
      const payload = {
        DeliveryOptionsDetails: {
          deliveryoptionsform: {
            savedAddresses: undefined,
          },
        },
      }
      store.dispatch({
        type: 'ADDRESS_BOOK_DELETE_ADDRESS',
        payload,
      })
      const updatedSavedAddresses = store.getState().checkout.orderSummary
        .savedAddresses
      expect(updatedSavedAddresses).toEqual([])
    })
  })

  describe('LOGOUT', () => {
    it('LOGOUT should wipe checkout container session state', () => {
      const initialState = checkoutReducer(undefined, {})

      let state = checkoutReducer(initialState, {
        type: 'SET_DELIVERY_STORE',
        store: 'legendary store',
      })
      expect(state).not.toEqual(initialState)

      state = checkoutReducer(state, { type: 'LOGOUT' })
      expect(state).toEqual(initialState)
    })
  })

  describe('EMPTY_ORDER_SUMMARY', () => {
    it('EMPTY_ORDER_SUMMARY should wipe checkout order summary', () => {
      const initialState = {
        somethingElse: 'somethingElse',
        orderSummary: {
          products: [],
        },
      }
      const expectedState = {
        somethingElse: 'somethingElse',
        orderSummary: {},
      }

      const state = checkoutReducer(initialState, {
        type: 'EMPTY_ORDER_SUMMARY',
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('SET_ORDER_SUMMARY_OUT_OF_STOCK', () => {
    it('handles set OSS', () => {
      const initialState = {
        somethingElse: 'somethingElse',
        orderSummary: {
          products: [],
        },
        isOutOfStockInCheckout: undefined,
      }
      const expectedState = {
        somethingElse: 'somethingElse',
        orderSummary: {
          products: [],
        },
        isOutOfStockInCheckout: true,
      }

      const state = checkoutReducer(initialState, {
        type: 'SET_ORDER_SUMMARY_OUT_OF_STOCK',
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('CLEAR_ORDER_SUMMARY_OUT_OF_STOCK', () => {
    it('handles clear', () => {
      const initialState = {
        somethingElse: 'somethingElse',
        orderSummary: {
          products: [],
        },
        isOutOfStockInCheckout: true,
      }
      const expectedState = {
        somethingElse: 'somethingElse',
        orderSummary: {
          products: [],
        },
        isOutOfStockInCheckout: undefined,
      }

      const state = checkoutReducer(initialState, {
        type: 'CLEAR_ORDER_SUMMARY_OUT_OF_STOCK',
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('UPDATE_ORDER_SUMMARY_BASKET', () => {
    it('handles update', () => {
      const initialState = {
        somethingElse: 'somethingElse',
        orderSummary: {
          basket: '123',
          products: [],
        },
      }
      const expectedState = {
        somethingElse: 'somethingElse',
        orderSummary: {
          basket: '235',
          products: [],
        },
      }

      const state = checkoutReducer(initialState, {
        type: 'UPDATE_ORDER_SUMMARY_BASKET',
        data: '235',
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('SHOW_COLLECT_FROM_STORE_MODAL', () => {
    it('handles showing', () => {
      const initialState = {
        showCollectFromStore: false,
      }
      const expectedState = {
        showCollectFromStore: true,
      }

      const state = checkoutReducer(initialState, {
        type: 'SHOW_COLLECT_FROM_STORE_MODAL',
        show: true,
      })

      expect(state).toEqual(expectedState)
    })

    it('handles hiding', () => {
      const initialState = {
        showCollectFromStore: true,
      }
      const expectedState = {
        showCollectFromStore: false,
      }

      const state = checkoutReducer(initialState, {
        type: 'SHOW_COLLECT_FROM_STORE_MODAL',
        show: false,
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('SET_NEWLY_CONFIRMED_ORDER', () => {
    it('sets newlyConfirmedOrder', () => {
      const initialState = {
        newlyConfirmedOrder: false,
      }
      const expectedState = {
        newlyConfirmedOrder: true,
      }

      const state = checkoutReducer(initialState, {
        type: 'SET_NEWLY_CONFIRMED_ORDER',
        newlyConfirmedOrder: true,
      })

      expect(state).toEqual(expectedState)
    })

    it('clears newlyConfirmedOrder', () => {
      const initialState = {
        newlyConfirmedOrder: true,
      }
      const expectedState = {
        newlyConfirmedOrder: false,
      }

      const state = checkoutReducer(initialState, {
        type: 'SET_NEWLY_CONFIRMED_ORDER',
        newlyConfirmedOrder: false,
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('SET_ORDER_ERROR', () => {
    it('sets the order error', () => {
      const error = 'test-error'

      const initialState = {
        orderError: false,
      }

      const expectedState = {
        orderError: error,
      }

      const state = checkoutReducer(initialState, {
        type: 'SET_ORDER_ERROR',
        error,
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('CLEAR_ORDER_ERROR', () => {
    it('clears the order error', () => {
      const initialState = {
        orderError: 'test-error',
      }

      const expectedState = {
        orderError: false,
      }

      const state = checkoutReducer(initialState, {
        type: 'CLEAR_ORDER_ERROR',
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('SET_ORDER_PENDING', () => {
    it('sets the order pending data', () => {
      const data = 'test-data'

      const initialState = {
        verifyPayment: null,
      }

      const expectedState = {
        verifyPayment: data,
      }

      const state = checkoutReducer(initialState, {
        type: 'SET_ORDER_PENDING',
        data,
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('UPDATE_ORDER_PENDING', () => {
    it('updates the order pending data', () => {
      const data = {
        payerId: 'XBNL7XLVDEW66',
        userApproved: '1',
      }

      const initialState = {
        verifyPayment: {
          hostname: 'local.m.topshop.com',
          policyId: '25000',
          orderId: '10477489',
          token: 'EC-6RL69752KN730973R',
          tranId: '1180502',
          authProvider: 'PYPAL',
        },
      }

      const expectedState = {
        verifyPayment: { ...initialState.verifyPayment, ...data },
      }

      const state = checkoutReducer(initialState, {
        type: 'UPDATE_ORDER_PENDING',
        data,
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('CLEAR_ORDER_PENDING', () => {
    it('clears the order pending data', () => {
      const initialState = {
        verifyPayment: 'test-data',
      }

      const expectedState = {
        verifyPayment: null,
      }

      const state = checkoutReducer(initialState, {
        type: 'CLEAR_ORDER_PENDING',
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('SET_THREE_D_SECURE_PROMPT', () => {
    it('sets the 3D Secure prompt data', () => {
      const data = 'test-data'

      const initialState = {
        threeDSecurePrompt: null,
      }

      const expectedState = {
        threeDSecurePrompt: data,
      }

      const state = checkoutReducer(initialState, {
        type: 'SET_THREE_D_SECURE_PROMPT',
        data,
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('CLEAR_THREE_D_SECURE_PROMPT', () => {
    it('clears the 3D Secure prompt data', () => {
      const initialState = {
        threeDSecurePrompt: 'test-data',
      }

      const expectedState = {
        threeDSecurePrompt: null,
      }

      const state = checkoutReducer(initialState, {
        type: 'CLEAR_THREE_D_SECURE_PROMPT',
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('SAVE_SELECTED_PAYMENT_METHOD', () => {
    it('saves a new payment method ', () => {
      const selectedPaymentMethod = 'KLARNA'
      const initialState = {
        selectedPaymentMethod: 'CARD',
      }

      const expectedState = {
        selectedPaymentMethod,
      }

      const state = checkoutReducer(initialState, {
        type: 'SAVE_SELECTED_PAYMENT_METHOD',
        selectedPaymentMethod,
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('SET_ORDER_ERROR_PAYMENT_DETAILS', () => {
    it('sets the order error payment details data', () => {
      const data = 'test-data'

      const initialState = {
        orderErrorPaymentDetails: null,
      }

      const expectedState = {
        orderErrorPaymentDetails: data,
      }

      const state = checkoutReducer(initialState, {
        type: 'SET_ORDER_ERROR_PAYMENT_DETAILS',
        data,
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('CLEAR_ORDER_ERROR_PAYMENT_DETAILS', () => {
    it('clears the order error payment details prompt data', () => {
      const initialState = {
        orderErrorPaymentDetails: 'test-data',
      }

      const expectedState = {
        orderErrorPaymentDetails: null,
      }

      const state = checkoutReducer(initialState, {
        type: 'CLEAR_ORDER_ERROR_PAYMENT_DETAILS',
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('SET_PRE_PAYMENT_CONFIG', () => {
    it('sets the pre payment config', () => {
      const config = 'test-config'

      const initialState = {
        prePaymentConfig: null,
      }

      const expectedState = {
        prePaymentConfig: config,
      }

      const state = checkoutReducer(initialState, {
        type: 'SET_PRE_PAYMENT_CONFIG',
        config,
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('CLEAR_PRE_PAYMENT_CONFIG', () => {
    it('clears the pre payment config', () => {
      const initialState = {
        prePaymentConfig: 'test-config',
      }

      const expectedState = {
        prePaymentConfig: null,
      }

      const state = checkoutReducer(initialState, {
        type: 'CLEAR_PRE_PAYMENT_CONFIG',
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('SET_FINALISED_ORDER', () => {
    it('sets the finalised order payload', () => {
      const order = 'test-order'

      const initialState = {
        finalisedOrder: null,
      }

      const expectedState = {
        finalisedOrder: order,
      }

      const state = checkoutReducer(initialState, {
        type: 'SET_FINALISED_ORDER',
        finalisedOrder: order,
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('CLEAR_FINALISED_ORDER', () => {
    it('clears the finalised order payload', () => {
      const initialState = {
        finalisedOrder: 'test-order',
      }

      const expectedState = {
        finalisedOrder: null,
      }

      const state = checkoutReducer(initialState, {
        type: 'CLEAR_FINALISED_ORDER',
      })

      expect(state).toEqual(expectedState)
    })
  })

  describe('OPEN_PAYMENT_METHODS', () => {
    const initialState = {
      paymentMethodsAreOpen: false,
    }
    const expectedState = {
      paymentMethodsAreOpen: true,
    }
    const state = checkoutReducer(initialState, {
      type: 'OPEN_PAYMENT_METHODS',
    })
    expect(state).toEqual(expectedState)
  })

  describe('CLOSE_PAYMENT_METHODS', () => {
    const initialState = {
      paymentMethodsAreOpen: true,
    }
    const expectedState = {
      paymentMethodsAreOpen: false,
    }
    const state = checkoutReducer(initialState, {
      type: 'CLOSE_PAYMENT_METHODS',
    })
    expect(state).toEqual(expectedState)
  })

  describe('SET_RECAPTCHA_TOKEN', () => {
    const recaptchaToken = '7bc78545b1a3923cc1e1e19523fd5c3f20b40950'
    const initialState = {
      recaptchaToken: '',
    }
    const expectedState = {
      recaptchaToken,
    }
    const state = checkoutReducer(initialState, {
      type: 'SET_RECAPTCHA_TOKEN',
      recaptchaToken,
    })
    expect(state).toEqual(expectedState)
  })
})
