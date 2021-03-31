import React from 'react'
import { assocPath } from 'ramda'
import * as actions from '../shoppingBagActions'
import {
  mockStoreCreator,
  getMockStoreWithInitialReduxState,
} from 'test/unit/helpers/get-redux-mock-store'

// mocks
import {
  setGenericError,
  setApiError,
  setUserErrorMessage,
} from '../errorMessageActions'
import { post, get, put, del } from '../../../lib/api-service'
import { browserHistory } from 'react-router'
import { getDeliveryStoreDetails } from '../../components/StoreLocatorActions'
import {
  getOrderSummary,
  updateOrderSummaryWithResponse,
} from '../checkoutActions'
import * as modalActions from '../modalActions'
import {
  shouldTransferShoppingBag,
  removeTransferShoppingBagParams,
} from '../../../lib/transfer-shopping-bag'
import { isDDPActiveUserPreRenewWindow } from '../../../selectors/ddpSelectors'
import {
  bagContainsDDPProduct,
  getShoppingBagTotalItems,
  isZeroValueBag,
  isShoppingBagEmpty,
  isBasketTotalCoveredByGiftCards,
  getShoppingBagProducts,
} from '../../../selectors/shoppingBagSelectors'
import * as espotActions from '../../common/espotActions'
import { isMobile } from '../../../selectors/viewportSelectors'
import {
  isInCheckout,
  getLocationQuery,
  isNotFound,
} from '../../../selectors/routingSelectors'
import { incrementSocialProofCounters } from './../socialProofActions'
import * as cookie from '../../../../client/lib/cookie'
import * as checkoutSelectors from '../../../selectors/checkoutSelectors'

updateOrderSummaryWithResponse.mockReturnValue({
  type: 'UPDATE_MOCK_ORDER',
})

jest.mock('../../../../client/lib/cookie')

jest.mock('../../../selectors/routingSelectors', () => ({
  isInCheckout: jest.fn().mockReturnValue(false),
  getLocationQuery: jest.fn().mockReturnValue({}),
  isNotFound: jest.fn(),
}))
jest.mock('../../../selectors/viewportSelectors', () => ({
  isMobile: jest.fn(),
}))
jest.mock('../../../selectors/ddpSelectors', () => ({
  isDDPActiveUserPreRenewWindow: jest.fn().mockReturnValue(false),
}))
jest.mock('../../../selectors/shoppingBagSelectors', () => ({
  bagContainsDDPProduct: jest.fn().mockReturnValue(false),
  getShoppingBagTotalItems: jest.fn().mockReturnValue(1),
  isShoppingBagEmpty: jest.fn().mockReturnValue(false),
  isZeroValueBag: jest.fn().mockReturnValue(false),
  isBasketTotalCoveredByGiftCards: jest.fn().mockRejectedValue(false),
  getShoppingBag: jest.fn(),
  getShoppingBagProducts: jest.fn(),
}))

jest.mock('../errorMessageActions', () => ({
  setUserErrorMessage: jest.fn(),
  setGenericError: jest.fn(),
  setApiError: jest.fn(),
}))

jest.spyOn(espotActions, 'setMiniBagEspots').mockImplementation(() => ({
  type: 'SET_ESPOT_CONTENT',
}))

jest.mock('../../../lib/api-service', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  del: jest.fn(),
}))
jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))
jest.mock('../../components/StoreLocatorActions', () => ({
  getDeliveryStoreDetails: jest.fn(),
}))
jest.mock('../checkoutActions', () => ({
  getOrderSummary: jest.fn(),
  updateOrderSummaryWithResponse: jest.fn(),
}))

jest.mock('../../../lib/transfer-shopping-bag', () => ({
  shouldTransferShoppingBag: jest.fn(),
  removeTransferShoppingBagParams: jest.fn(),
}))
jest.mock('../../../lib/localisation', () => ({
  localise: jest.fn().mockImplementation((l, b, m) => m),
}))

jest.mock('uuid', () => jest.fn(() => '1234'))

jest.mock('./../socialProofActions')

jest.mock('../../../selectors/checkoutSelectors')

const mockedCloseModalAction = {
  type: 'MOCKED_CLOSE_MODAL',
}

jest.spyOn(modalActions, 'closeModal').mockReturnValue(mockedCloseModalAction)

const getState = jest.fn()
const dispatch = jest.fn()

const getModalContent = (
  store // TODO merge with DES-4061
) => store.getActions().find((a) => a.type === 'SET_MODAL_CHILDREN').children

updateOrderSummaryWithResponse.mockReturnValue({
  type: 'UPDATE_MOCK_ORDER',
})

incrementSocialProofCounters.mockReturnValue({
  type: 'INCREMENT_SOCIAL_PROOF_COUNTERS_THUNK',
})

const basketResponse = {
  products: [
    {
      lineNumber: 'KSJ78213',
      name: 'cool product',
      quantity: 1,
    },
    {
      lineNumber: 'KSFS0213',
      name: 'cool second product',
      quantity: 1,
    },
  ],
}

describe('Shopping Bag Actions', () => {
  const initialState = {
    config: {
      langHostnames: {
        default: {
          defaultLanguage: 'English',
        },
      },
      language: '',
      brandName: 'topshop',
    },
    routing: { location: { pathname: '/login' } },
  }

  const store = getMockStoreWithInitialReduxState(initialState)
  beforeEach(() => {
    // action creators mocks
    // for those external functions which don't return a plain action creator
    // best idea is to mock them all returning a valid action creator { type: 'xxx' }
    getDeliveryStoreDetails.mockImplementation(() => ({
      type: 'MOCK_getDeliveryStoreDetails',
    }))
    getOrderSummary.mockImplementation(() => ({ type: 'MOCK_getOrderSummary' }))
    setUserErrorMessage.mockImplementation(() => ({
      type: 'MOCK_setUserErrorMessage',
    }))
    setGenericError.mockImplementation(() => ({ type: 'MOCK_setGenericError' }))
    setApiError.mockImplementation(() => ({ type: 'MOCK_setApiError' }))
    // that's default post implementation,
    // if we need to reject then implement then use jest.mockImplementationOnce in that specific test
    post.mockImplementation((url) => () => {
      switch (url) {
        case '/shopping_bag/addPromotionCode':
          return Promise.resolve({
            body: {
              products: [],
              invetoryPositions: {},
              total: '',
              subTotal: '',
            },
          })
        case '/shopping_bag/add_item2':
          return Promise.resolve({
            text: '{"success" : true}',
            body: basketResponse,
          })
        default:
          return Promise.resolve({})
      }
    })
    get.mockImplementation((url) => () => {
      switch (url) {
        case '/shopping_bag/get_items':
          return Promise.resolve({
            // that's been called with dispatch as well
            type: 'MOCK_get_items',
            body: {
              products: [],
              invetoryPositions: {},
              total: '5',
              subTotal: '5',
            },
          })
        default:
          return Promise.resolve({})
      }
    })
    del.mockImplementation((url) => () => {
      switch (true) {
        case url.indexOf('/shopping_bag/delete_item') >= 0:
          return Promise.resolve({
            text: '{"success" : true}',
            body: {
              products: [{}],
            },
          })
        case url === '/shopping_bag/empty_bag':
          return Promise.resolve({
            body: 'hello',
          })
        case url === '/shopping_bag/delPromotionCode':
          return Promise.resolve({
            type: 'MOCK_delPromotionCode',
            body: {
              products: [],
              invetoryPositions: {},
              total: '',
              subTotal: '',
            },
          })
        default:
          return Promise.resolve({})
      }
    })
    jest.clearAllMocks()
    // important to clearActions to avoid concatenation
    store.clearActions()
  })

  describe('Action Creators', () => {
    describe('showMiniBagConfirm', () => {
      it('should create an action to show mini bag confirm (default true)', () => {
        expect(actions.showMiniBagConfirm(undefined)).toEqual({
          type: 'SHOW_MINIBAG_CONFIRM',
          payload: true,
        })
      })
      it('should create an action to show mini bag confirm (true)', () => {
        expect(actions.showMiniBagConfirm(true)).toEqual({
          type: 'SHOW_MINIBAG_CONFIRM',
          payload: true,
        })
      })
      it('should create an action to show mini bag confirm (false)', () => {
        expect(actions.showMiniBagConfirm(false)).toEqual({
          type: 'SHOW_MINIBAG_CONFIRM',
          payload: false,
        })
      })
    })
    describe('productsAdded', () => {
      it('should create an action to notify products have been added to bag', () => {
        const products = [{ productId: 'super modern jeans', size: 6 }]
        const quantity = 2
        expect(actions.productsAdded(products, quantity)).toEqual({
          type: 'PRODUCTS_ADDED_TO_BAG',
          payload: {
            products,
            quantity,
          },
        })
      })
    })
    describe('setLoadingShoppingBag', () => {
      it('should create an action to set loading shopping bad (true)', () => {
        expect(actions.setLoadingShoppingBag(true)).toEqual({
          type: 'SET_LOADING_SHOPPING_BAG',
          isLoading: true,
        })
      })
      it('should create an action to set loading shopping bad (false)', () => {
        expect(actions.setLoadingShoppingBag(false)).toEqual({
          type: 'SET_LOADING_SHOPPING_BAG',
          isLoading: false,
        })
      })
    })
    describe('updateShoppingBagBadgeCount', () => {
      describe('when persist flag is not set by default', () => {
        it('should create an action with bag badge counter (no-params) persist=false by default', () => {
          const count = 250
          expect(actions.updateShoppingBagBadgeCount(count)).toEqual({
            type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT',
            count,
            persist: false,
          })
        })
      })
      describe('when persist flag is true for tab-sync', () => {
        it('should create an action with bag badge counter with persist:true for multi-tab sync', () => {
          const count = 250
          expect(actions.updateShoppingBagBadgeCount(count, true)).toEqual({
            type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT',
            count,
            persist: true,
          })
        })
      })
    })
    describe('setPromotionCodeConfirmation', () => {
      it('should create an action to set promotion code confirmation', () => {
        const promotionCodeConfirmation = 'confirmed.'
        expect(
          actions.setPromotionCodeConfirmation(promotionCodeConfirmation)
        ).toEqual({
          type: 'SET_PROMOTION_CODE_CONFIRMATION',
          promotionCodeConfirmation,
        })
      })
    })
    describe('updateOrderId', () => {
      it('should create an action to update orderId in the bag', () => {
        expect(actions.updateOrderId(777)).toEqual({
          type: 'UPDATE_ORDER_ID',
          payload: { orderId: 777 },
        })
      })
    })
  })

  describe('updateBag', () => {
    it('should call getDeliveryStoreDetails when bag.total and bag.subTotal is not empty', () => {
      const bag = {
        products: [],
        invetoryPositions: {},
        total: '5',
        subTotal: '5',
      }
      store.dispatch(actions.updateBag(bag))
      const expectedAction = [{ type: 'MOCK_getDeliveryStoreDetails' }]
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
    })

    it('should update shopping bag badge count with number of products', () => {
      const bag = {
        products: [
          { product: 'p1', quantity: 5 },
          { product: 'p2', quantity: 2 },
        ],
        invetoryPositions: {},
        total: '',
        subTotal: '',
      }
      store.dispatch(actions.updateBag(bag))
      const expectedAction = [
        {
          type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT',
          count: 7,
          persist: false,
        },
      ]
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
    })

    it('should display message when bag is zero, bag is not empty and the order is not paid in full with a giftcard', () => {
      isZeroValueBag.mockReturnValueOnce(true)
      isShoppingBagEmpty.mockReturnValueOnce(false)
      isBasketTotalCoveredByGiftCards.mockReturnValueOnce(false)
      const bag = {
        products: [{ product: 'p1', quantity: 5 }],
        invetoryPositions: {},
        total: '0',
        subTotal: '10',
        isOrderCoveredByGiftCards: false,
      }

      store.dispatch(actions.updateBag(bag))

      const expectedAction = [
        {
          type: 'SET_MODAL_CHILDREN',
          children: expect.any(String),
        },
      ]
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
      expect(getModalContent(store)).toMatch(
        /We are unable to accept a zero value order/
      )
      expect(isZeroValueBag).toHaveBeenCalledTimes(1)
      expect(isShoppingBagEmpty).toHaveBeenCalledTimes(1)
      expect(isBasketTotalCoveredByGiftCards).toHaveBeenCalledTimes(1)
    })
    it('should not display message when bag is zero and bag is empty', () => {
      isZeroValueBag.mockReturnValueOnce(true)
      isShoppingBagEmpty.mockReturnValueOnce(true)
      const bag = {
        products: [],
        invetoryPositions: {},
        total: '0',
        subTotal: '10',
      }

      store.dispatch(actions.updateBag(bag))

      const expectedAction = [
        {
          type: 'SET_MODAL_CHILDREN',
          children: expect.any(String),
        },
      ]
      expect(store.getActions()).not.toEqual(
        expect.arrayContaining(expectedAction)
      )
      expect(isZeroValueBag).toHaveBeenCalledTimes(1)
      expect(isShoppingBagEmpty).toHaveBeenCalledTimes(1)
    })
    it('should not display message when bag is non-zero', () => {
      isZeroValueBag.mockReturnValueOnce(false)
      const bag = {
        products: [],
        invetoryPositions: {},
        total: '1',
        subTotal: '1',
      }

      store.dispatch(actions.updateBag(bag))

      const expectedAction = [
        {
          type: 'SET_MODAL_CHILDREN',
          children: expect.any(String),
        },
      ]
      expect(store.getActions()).not.toEqual(
        expect.arrayContaining(expectedAction)
      )
      expect(isZeroValueBag).toHaveBeenCalledTimes(1)
    })
    it('should not display message when bag is zero, bag contains products and the order is paid in full with giftcards', () => {
      isZeroValueBag.mockReturnValueOnce(true)
      isShoppingBagEmpty.mockReturnValueOnce(false)
      isBasketTotalCoveredByGiftCards.mockReturnValueOnce(true)
      const bag = {
        products: [{ product: 'p1', quantity: 5 }],
        invetoryPositions: {},
        total: '0',
        subTotal: '10.05',
        isOrderCoveredByGiftCards: true,
      }

      store.dispatch(actions.updateBag(bag))

      const expectedAction = [
        {
          type: 'SET_MODAL_CHILDREN',
          children: expect.any(String),
        },
      ]
      expect(store.getActions()).not.toEqual(
        expect.arrayContaining(expectedAction)
      )
      expect(isZeroValueBag).toHaveBeenCalledTimes(1)
      expect(isShoppingBagEmpty).toHaveBeenCalledTimes(1)
      expect(isBasketTotalCoveredByGiftCards).toHaveBeenCalledTimes(1)
    })
  })

  describe('addPromotionCode', () => {
    const promotionId = 'PROMO'
    const gtmCategory = 'shoppingBag'
    const errorCallback = jest.fn()

    it('addPromotionCode action creators snapshot [post SUCCESS]', () => {
      return store
        .dispatch(actions.addPromotionCode({ promotionId, gtmCategory }))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot()
          expect(updateOrderSummaryWithResponse).not.toHaveBeenCalled()
          expect(getOrderSummary).not.toHaveBeenCalled()
        })
    })

    it('should call getOrderSummary when in checkout', () => {
      initialState.routing = { location: { pathname: '/checkout' } }
      isInCheckout.mockReturnValue(true)
      const store = getMockStoreWithInitialReduxState(initialState)
      return store
        .dispatch(actions.addPromotionCode({ promotionId }))
        .then(() => {
          const expectedAction = [{ type: 'UPDATE_MOCK_ORDER' }]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
          expect(updateOrderSummaryWithResponse).toHaveBeenCalledTimes(1)
          expect(getOrderSummary).not.toHaveBeenCalled()
        })
    })

    describe('On Failure', () => {
      beforeEach(() => {
        post.mockImplementationOnce(() => () =>
          Promise.reject({
            response: {
              body: {
                message: 'error',
              },
            },
          })
        )
      })
      it('addPromotionCode action creators snapshot [post FAILURE] and scroll to container', async () => {
        try {
          await store.dispatch(
            actions.addPromotionCode({ promotionId, errorCallback })
          )
        } catch (e) {
          expect(errorCallback).toHaveBeenCalled()
          expect(store.getActions()).toMatchSnapshot()
        }
      })

      it('addPromotionCode action creators and do not scroll to container', async () => {
        try {
          await store.dispatch(actions.addPromotionCode({ promotionId }))
        } catch (e) {
          expect(errorCallback).not.toHaveBeenCalled()
        }
      })
    })
  })

  describe('addStoredPromoCode', () => {
    const state = {
      ...initialState,
      shoppingBag: {
        bag: {
          products: [
            {
              product: 'p1',
            },
          ],
          promotions: ['PROMO'],
        },
      },
    }
    const store = getMockStoreWithInitialReduxState(state)
    it('should call addPromotionCode when promotionCode and products exists in the state', () => {
      cookie.getItem.mockReturnValue('PROMO')
      store.dispatch(actions.addStoredPromoCode())
      const expectedActions = [
        {
          type: 'SET_FORM_LOADING',
          formName: 'promotionCode',
          isLoading: true,
        },
      ]
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })
  })

  describe('getBagRequest', () => {
    const state = {
      ...initialState,
      shoppingBag: {
        bag: {
          products: [
            {
              product: 'p1',
            },
          ],
          promotions: ['PROMO'],
        },
        promotionCode: 'PROMO',
      },
    }

    const store = getMockStoreWithInitialReduxState(state)

    it('should call setEspotGroup when get shopping bag items successfully', () => {
      return store.dispatch(actions.getBagRequest()).then(() => {
        expect(espotActions.setMiniBagEspots).toHaveBeenCalledWith({
          products: [],
          invetoryPositions: {},
          total: '5',
          subTotal: '5',
        })
      })
    })

    it('should call updateBag when get shopping bag items successfully', () => {
      return store.dispatch(actions.getBagRequest()).then(() => {
        const expectedAction = [
          {
            type: 'UPDATE_BAG',
            bag: {
              products: [],
              invetoryPositions: {},
              total: '5',
              subTotal: '5',
            },
            persist: true,
          },
        ]
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedAction)
        )
      })
    })

    it('should snapshot all the actions when success', () => {
      return store.dispatch(actions.getBagRequest()).then(() => {
        expect(store.getActions()).toMatchSnapshot()
      })
    })

    describe('On Failure', () => {
      it('should set Error Form when error message', () => {
        get.mockImplementationOnce(() => () =>
          Promise.reject({
            response: {
              body: {
                message: 'error',
              },
            },
          })
        )
        return store.dispatch(actions.getBagRequest()).then(() => {
          const expectedAction = [{ type: 'MOCK_setGenericError' }]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
        })
      })
      it('should set API Error if failure when not error message', () => {
        get.mockImplementationOnce(() => () =>
          Promise.reject({
            response: {},
          })
        )
        return store.dispatch(actions.getBagRequest()).then(() => {
          const expectedAction = [{ type: 'MOCK_setApiError' }]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
        })
      })
    })
  })

  describe('getBag', () => {
    const state = {
      ...initialState,
      shoppingBag: {
        bag: {
          products: [
            {
              product: 'p1',
            },
          ],
          promotions: ['PROMO'],
        },
        promotionCode: 'PROMO',
        miniBagOpen: true,
      },
    }

    describe('merge request', () => {
      let store
      beforeEach(() => {
        store = getMockStoreWithInitialReduxState(state)
      })

      it('should fire BAG_MERGE_STARTED and BAG_MERGE_FINISHED actions if isMergeRequest = true', () => {
        return store.dispatch(actions.getBag(true)).then(() => {
          expect(store.getActions()).toEqual(
            expect.arrayContaining([
              { type: 'BAG_MERGE_STARTED' },
              { type: 'BAG_MERGE_FINISHED' },
            ])
          )
        })
      })

      it('should not fire the bag merge actions if isMergeRequest = false', () => {
        const actionHasBeenFired = (type) =>
          store.getActions().some((action) => action.type === type)
        return store.dispatch(actions.getBag(false)).then(() => {
          expect(actionHasBeenFired('BAG_MERGE_STARTED')).toBe(false)
          expect(actionHasBeenFired('BAG_MERGE_FINISHED')).toBe(false)
        })
      })

      it('should not fire the bag merge actions if isMergeRequest is not provided', () => {
        const actionHasBeenFired = (type) =>
          store.getActions().some((action) => action.type === type)
        return store.dispatch(actions.getBag()).then(() => {
          expect(actionHasBeenFired('BAG_MERGE_STARTED')).toBe(false)
          expect(actionHasBeenFired('BAG_MERGE_FINISHED')).toBe(false)
        })
      })
    })
  })

  describe('syncBag', () => {
    const mockPush = browserHistory.push
    const noBagAction = { type: 'NO_BAG' }

    describe('bag is empty', () => {
      it('should call getBag with correct parameters when cookie is not set', () => {
        const expectedActions = [noBagAction]
        cookie.getItem.mockReturnValue(undefined)

        store.dispatch(actions.syncBag())

        expect(mockPush).toHaveBeenCalledTimes(0)
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })

      it('should call getBag with correct parameters when cookie is set to zero', () => {
        const expectedActions = [
          {
            type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT',
            count: 0,
            persist: false,
          },
          noBagAction,
        ]
        cookie.getItem.mockReturnValue('0')

        store.dispatch(actions.syncBag())

        expect(mockPush).toHaveBeenCalledTimes(0)
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })

      it('should redirect to home page when bag is empty on checkout page', () => {
        const initialState = {
          routing: {
            location: {
              pathname: '/checkout',
              pageStatusCode: 200,
            },
          },
        }
        const store = getMockStoreWithInitialReduxState(initialState)
        cookie.getItem.mockReturnValue('0')

        store.dispatch(actions.syncBag())

        expect(store.getActions()).toContainEqual(noBagAction)
        expect(mockPush).toHaveBeenCalledTimes(1)
        expect(mockPush).toHaveBeenCalledWith('/')
        expect(mockPush).toHaveBeenCalled()
      })

      it('should handle 404 inside checkout', () => {
        const initialState = {
          routing: {
            location: {
              pathname: '/checkout/boo',
              pageStatusCode: 404,
            },
          },
        }
        const store = getMockStoreWithInitialReduxState(initialState)
        cookie.getItem.mockReturnValue('0')
        isNotFound.mockReturnValueOnce(true)

        store.dispatch(actions.syncBag())

        expect(getOrderSummary).not.toHaveBeenCalled()
        expect(store.getActions()).toContainEqual(noBagAction)
        expect(mockPush).not.toHaveBeenCalled()
      })
    })

    describe('bag is not empty', () => {
      it('should call getBag with correct parameters', () => {
        const expectedActions = [
          { type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT', count: 1, persist: false },
          { type: 'BAG_MERGE_STARTED' },
          { type: 'SET_LOADING_SHOPPING_BAG', isLoading: true },
        ]
        cookie.getItem.mockReturnValue('1')

        store.dispatch(actions.syncBag())

        expect(store.getActions()).not.toContainEqual(noBagAction)
        expect(mockPush).toHaveBeenCalledTimes(0)
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })

      describe('sync user account in multi-tab', () => {
        let store
        const state = {
          routing: {
            location: {
              pathname: '/checkout',
            },
          },
        }
        beforeEach(() => {
          localStorage.setItem('cached_auth', `{ "bvToken": "12345" }`)
          cookie.getItem.mockReturnValue('1')
          checkoutSelectors.isGuestOrder.mockReturnValue(true)
          store = getMockStoreWithInitialReduxState(state)
        })

        it('should call the correct actions when syncing the user authentication between tabs', async () => {
          const expectedActions = [
            {
              type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT',
              count: 1,
              persist: false,
            },
            { type: 'BAG_MERGE_STARTED' },
            { type: 'SET_LOADING_SHOPPING_BAG', isLoading: true },
            { type: 'AUTH_PENDING', loading: true },
            {
              type: 'LOGIN',
              bvToken: '12345',
              loginLocation: { pathname: '/checkout', query: {} },
            },
            { type: 'SET_AUTHENTICATION', authentication: 'full' },
            { type: 'SET_LOADING_SHOPPING_BAG', isLoading: false },
            {
              type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT',
              count: 0,
              persist: false,
            },
            {
              type: 'UPDATE_BAG',
              bag: {
                products: [],
                invetoryPositions: {},
                total: '5',
                subTotal: '5',
              },
              persist: false,
            },
            { type: 'MOCK_getDeliveryStoreDetails' },
            { type: 'SET_ESPOT_CONTENT' },
            { type: 'AUTH_PENDING', loading: false },
            { type: 'MOCK_getOrderSummary' },
            { type: 'BAG_MERGE_FINISHED' },
          ]
          await store.dispatch(actions.syncBag())
          expect(store.getActions()).toEqual(expectedActions)
        })

        it('should call the correct actions when syncing a guest user authentication between tabs on the thank you page', async () => {
          cookie.getItem.mockReturnValue('0')
          const expectedActions = [
            {
              type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT',
              count: 0,
              persist: false,
            },
            { type: 'NO_BAG' },
            { type: 'AUTH_PENDING', loading: true },
            {
              type: 'LOGIN',
              bvToken: '12345',
              loginLocation: { pathname: '/order-complete', query: {} },
            },
            { type: 'SET_AUTHENTICATION', authentication: 'full' },
            { type: 'AUTH_PENDING', loading: false },
          ]

          const state = {
            routing: {
              location: {
                pathname: '/order-complete',
              },
            },
          }
          store = getMockStoreWithInitialReduxState(state)
          await store.dispatch(actions.syncBag())

          expect(store.getActions()).toEqual(expectedActions)
          expect(mockPush).toHaveBeenCalledWith('/checkout')
        })

        it('should redirect the user to the /checkout route', async () => {
          await store.dispatch(actions.syncBag())
          expect(mockPush).toHaveBeenCalledWith('/checkout')
        })

        it('should redirect the user to the home page if cached_auth is not found', async () => {
          localStorage.removeItem('cached_auth')
          await store.dispatch(actions.syncBag())
          expect(mockPush).toHaveBeenCalledWith('/')
        })
      })

      describe('checkout pages', () => {
        const fakeOrderSummaryReturn = {
          type: 'FAKE_RETURN',
        }
        const expectedActions = [
          { type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT', count: 1, persist: false },
          { type: 'BAG_MERGE_STARTED' },
          { type: 'SET_LOADING_SHOPPING_BAG', isLoading: true },
          fakeOrderSummaryReturn,
        ]

        it('should update order summary when in checkout but not on delivery payment page', () => {
          cookie.getItem.mockReturnValue('1')
          getOrderSummary.mockReturnValue(fakeOrderSummaryReturn)
          checkoutSelectors.isGuestOrder.mockReturnValue(false)
          const initialState = {
            routing: { location: { pathname: '/checkout' } },
          }
          const store = getMockStoreWithInitialReduxState(initialState)

          store.dispatch(actions.syncBag())

          expect(store.getActions()).not.toContainEqual(noBagAction)
          expect(mockPush).toHaveBeenCalledTimes(0)
          expect(getOrderSummary).toHaveBeenCalledTimes(1)
          expect(getOrderSummary).toHaveBeenCalledWith({
            shouldUpdateBag: false,
            shouldUpdateForms: false,
            shouldSync: false,
          })
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })

        it('should update order summary when in checkout on delivery payment page', () => {
          cookie.getItem.mockReturnValue('1')
          getOrderSummary.mockReturnValue(fakeOrderSummaryReturn)
          const initialState = {
            routing: { location: { pathname: '/checkout/delivery-payment' } },
          }
          const store = getMockStoreWithInitialReduxState(initialState)

          store.dispatch(actions.syncBag())

          expect(store.getActions()).not.toContainEqual(noBagAction)
          expect(mockPush).toHaveBeenCalledTimes(0)
          expect(getOrderSummary).toHaveBeenCalledTimes(1)
          expect(getOrderSummary).toHaveBeenCalledWith({
            shouldUpdateBag: false,
            shouldUpdateForms: true,
            shouldSync: false,
          })
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })

        it('should handle 404 inside checkout', () => {
          const initialState = {
            routing: {
              location: {
                pathname: '/checkout/boo',
                pageStatusCode: 404,
              },
            },
          }
          const store = getMockStoreWithInitialReduxState(initialState)
          cookie.getItem.mockReturnValue('1')
          isNotFound.mockReturnValueOnce(true)

          store.dispatch(actions.syncBag())

          expect(getOrderSummary).toHaveBeenCalled()
          expect(mockPush).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('openMiniBag', () => {
    it('should call close modal and open mini bag', () => {
      store.dispatch(actions.openMiniBag())
      expect(modalActions.closeModal).toHaveBeenCalled()
      const expectedAction = [
        mockedCloseModalAction,
        { type: 'OPEN_MINI_BAG', autoClose: false },
      ]
      expect(store.getActions()).toEqual(expectedAction)
      modalActions.closeModal.mockRestore()
    })
    it('should call open mini bag with autoClose set to true', () => {
      store.dispatch(actions.openMiniBag(true))
      const expectedAction = [{ type: 'OPEN_MINI_BAG', autoClose: true }]

      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
    })
  })

  describe('closeMiniBag', () => {
    it('should call CLOSE_MINI_BAG action creator', () => {
      store.dispatch(actions.closeMiniBag())
      const expectedAction = [{ type: 'CLOSE_MINI_BAG' }]
      expect(store.getActions()).toEqual(expectedAction)
    })
  })

  describe('toggleMiniBag', () => {
    const initialState = {
      shoppingBag: {
        miniBagOpen: true,
      },
    }
    const store = getMockStoreWithInitialReduxState(initialState)

    it('should call CLOSE_MINI_BAG when mini bag is open', () => {
      store.dispatch(actions.toggleMiniBag())
      const expectedAction = [{ type: 'CLOSE_MINI_BAG' }]
      expect(store.getActions()).toEqual(expectedAction)
    })
    it('should call CLOSE_MINI_BAG when mini bag is open', () => {
      const initialState = {
        shoppingBag: {
          miniBagOpen: false,
        },
      }
      const mockedCloseModalAction = {
        type: 'MOCKED_CLOSE_MODAL',
      }
      jest
        .spyOn(modalActions, 'closeModal')
        .mockReturnValue(mockedCloseModalAction)
      const store = getMockStoreWithInitialReduxState(initialState)
      store.dispatch(actions.toggleMiniBag())
      const expectedAction = [
        mockedCloseModalAction,
        { type: 'OPEN_MINI_BAG', autoClose: false },
      ]
      expect(store.getActions()).toEqual(expectedAction)
    })
  })

  describe('checkForMergedItemsInBag', () => {
    const preLoginState = {
      preLogin: true,
    }
    const initialState = {
      routing: { location: { pathname: '/checkout/login' } },
    }

    const mergedBagMessagePayload = {
      id: '1234',
      message: ['You have items in your shopping bag from a previous visit.'],
      duration: false,
      isError: false,
      isVisible: true,
      showOnce: true,
    }
    const ddpMessagePayload = {
      id: '1234',
      message: ['Great news! You already have a delivery subscription.'],
      duration: false,
      isError: false,
      isVisible: true,
      showOnce: false,
    }

    // we have to add clearActions here because we are using scoped store variable
    // instead the global one for the whole test
    beforeEach(() => {
      store.clearActions()
      jest.clearAllMocks()
    })

    describe('checkout login messaging', () => {
      it('should add `merged items` message if bag count has changed', () => {
        const store = getMockStoreWithInitialReduxState(initialState)
        getShoppingBagTotalItems.mockReturnValueOnce(1)
        getShoppingBagTotalItems.mockReturnValueOnce(2)
        bagContainsDDPProduct.mockReturnValueOnce(false)
        isInCheckout.mockReturnValueOnce(true)
        store.dispatch(actions.checkForMergedItemsInBag(preLoginState, 2))
        const expectedActions = [
          {
            type: 'ADD_MINIBAG_MESSAGE',
            payload: mergedBagMessagePayload,
          },
        ]

        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
      it('should not call `openMiniBag` if bag count has not changed', () => {
        const store = getMockStoreWithInitialReduxState(initialState)
        getShoppingBagTotalItems.mockReturnValueOnce(1)
        getShoppingBagTotalItems.mockReturnValueOnce(1)
        bagContainsDDPProduct.mockReturnValueOnce(false)
        isInCheckout.mockReturnValueOnce(true)
        store.dispatch(actions.checkForMergedItemsInBag(preLoginState, 1))
        const expectedActions = [
          {
            type: 'OPEN_MINI_BAG',
            autoClose: false,
          },
        ]

        expect(store.getActions()).not.toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
      it('should not display `merged-items` message if bag count has changed', () => {
        const store = getMockStoreWithInitialReduxState(initialState)
        getShoppingBagTotalItems.mockReturnValueOnce(1)
        getShoppingBagTotalItems.mockReturnValueOnce(1)
        bagContainsDDPProduct.mockReturnValueOnce(false)
        isInCheckout.mockReturnValueOnce(true)
        store.dispatch(actions.checkForMergedItemsInBag(preLoginState, 1))
        const expectedActions = [
          {
            type: 'SHOW_MINIBAG_MESSAGE',
            id: 'merged-items',
          },
        ]

        expect(store.getActions()).not.toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
    })

    describe('non-checkout login messaging', () => {
      it('should add `merged items` message if bag count has changed', () => {
        const store = getMockStoreWithInitialReduxState(initialState)
        getShoppingBagTotalItems.mockReturnValueOnce(1)
        getShoppingBagTotalItems.mockReturnValueOnce(2)
        bagContainsDDPProduct.mockReturnValueOnce(false)
        isInCheckout.mockReturnValueOnce(false)
        store.dispatch(actions.checkForMergedItemsInBag(preLoginState, 2))
        const expectedActions = [
          {
            type: 'ADD_MINIBAG_MESSAGE',
            payload: {
              ...mergedBagMessagePayload,
              message: [
                'You have items in your shopping bag from a previous visit.',
              ],
            },
          },
        ]

        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
      it('should call `openMiniBag` if bag count has changed', () => {
        const store = getMockStoreWithInitialReduxState(initialState)
        getShoppingBagTotalItems.mockReturnValueOnce(1)
        getShoppingBagTotalItems.mockReturnValueOnce(2)
        isInCheckout.mockReturnValueOnce(false)
        store.dispatch(actions.checkForMergedItemsInBag(preLoginState, 2))
        const expectedActions = [
          {
            type: 'OPEN_MINI_BAG',
            autoClose: false,
          },
        ]

        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
      it('should not call `openMiniBag` if bag count has not changed', () => {
        const store = getMockStoreWithInitialReduxState(initialState)
        getShoppingBagTotalItems.mockReturnValueOnce(1)
        getShoppingBagTotalItems.mockReturnValueOnce(1)
        bagContainsDDPProduct.mockReturnValueOnce(false)
        isInCheckout.mockReturnValueOnce(false)
        store.dispatch(actions.checkForMergedItemsInBag(preLoginState, 1))
        const expectedActions = [
          {
            type: 'OPEN_MINI_BAG',
            autoClose: false,
          },
        ]

        expect(store.getActions()).not.toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
    })

    describe('DDP messaging', () => {
      it('should add DDP message if has DDP product in bag and is active DDP user', () => {
        const store = getMockStoreWithInitialReduxState(initialState)
        getShoppingBagTotalItems.mockReturnValueOnce(1)
        bagContainsDDPProduct.mockReturnValueOnce(true)
        isDDPActiveUserPreRenewWindow.mockReturnValueOnce(true)
        isInCheckout.mockReturnValueOnce(true)
        store.dispatch(actions.checkForMergedItemsInBag(preLoginState, 1))
        const expectedActions = [
          {
            type: 'ADD_MINIBAG_MESSAGE',
            payload: ddpMessagePayload,
          },
        ]

        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedActions)
        )
      })
      it('should add not add message if bag count has not changed and no DDP product in bag or not active DDP user', () => {
        const store = getMockStoreWithInitialReduxState(initialState)
        getShoppingBagTotalItems.mockReturnValueOnce(1)
        getShoppingBagTotalItems.mockReturnValueOnce(1)
        bagContainsDDPProduct.mockReturnValueOnce(false)
        isInCheckout.mockReturnValueOnce(false)
        store.dispatch(actions.checkForMergedItemsInBag(preLoginState, 1))

        expect(
          store
            .getActions()
            .find((action) => action.type === 'ADD_MINIBAG_MESSAGE')
        ).toEqual(undefined)
      })
    })
  })

  describe('synchroniseBagPostLogin', () => {
    const preLoginState = {
      preLogin: true,
    }

    beforeEach(() => {})
    afterEach(() => {
      jest.clearAllMocks()
    })
    afterAll(() => {
      actions.getBag.mockRestore()
    })

    it('should call getBag if bag has changed and is in checkout', () => {
      expect(getOrderSummary).toHaveBeenCalledTimes(0)
      getShoppingBagTotalItems.mockReturnValueOnce(1)
      getShoppingBagTotalItems.mockReturnValueOnce(0)
      isInCheckout.mockReturnValue(true)
      const expectedAction = [
        { type: 'BAG_MERGE_STARTED' },
        {
          type: 'SET_LOADING_SHOPPING_BAG',
          isLoading: true,
        },
      ]
      store.dispatch(actions.synchroniseBagPostLogin(preLoginState))
      expect(store.getActions()).toEqual(expectedAction)
    })

    it('should not call getBag if bag has changed but not in checkout', () => {
      getShoppingBagTotalItems.mockReturnValueOnce(1)
      getShoppingBagTotalItems.mockReturnValueOnce(0)
      isInCheckout.mockReturnValueOnce(false)

      const expectedAction = []
      store.dispatch(actions.synchroniseBagPostLogin(preLoginState))
      expect(store.getActions()).toEqual(expectedAction)
    })

    it('should not call getBag if bag has not changed', () => {
      getShoppingBagTotalItems.mockReturnValueOnce(0)
      getShoppingBagTotalItems.mockReturnValueOnce(0)
      isInCheckout.mockReturnValueOnce(true)

      const expectedAction = []
      store.dispatch(actions.synchroniseBagPostLogin(preLoginState))
      expect(store.getActions()).toEqual(expectedAction)
    })

    it('should call get bag with false if callback is passed in', () => {
      expect(getOrderSummary).toHaveBeenCalledTimes(0)
      getShoppingBagTotalItems.mockReturnValueOnce(1)
      getShoppingBagTotalItems.mockReturnValueOnce(0)
      isInCheckout.mockReturnValue(true)

      const expectedAction = [
        { type: 'BAG_MERGE_STARTED' },
        {
          type: 'SET_LOADING_SHOPPING_BAG',
          isLoading: true,
        },
      ]
      store.dispatch(actions.synchroniseBagPostLogin(preLoginState, () => {}))
      expect(store.getActions()).toEqual(expectedAction)
    })
  })

  describe('addToBag', () => {
    const data = {
      productId: 123,
      sku: 123456,
      partNumber: 123456,
    }
    const product = {
      lineNumber: 'KSJ78213',
      name: 'cool product',
      quantity: 1,
    }
    const state = {
      ...initialState,
      routing: { location: { pathname: '/login' } },
      viewport: { media: 'mobile' },
      shoppingBag: {
        bag: {
          products: [product],
          invetoryPositions: {},
          total: '5',
          subTotal: '5',
        },
        promotionCode: 'PROMO',
        isAddingToBag: false,
      },
    }
    const store = mockStoreCreator(state)
    const newProduct = {
      lineNumber: 'KSFS0213',
      name: 'cool second product',
      quantity: 1,
    }
    const products = [product, newProduct]

    beforeEach(() => {
      store.clearActions()
      getShoppingBagProducts.mockReturnValue(products)
    })

    it('should call buyNowSuccess then Update shopping bag badge count', () => {
      isInCheckout.mockReturnValueOnce(false)
      return store
        .dispatch(actions.addToBag(data.productId, data.sku))
        .then(() => {
          const expectedAction = [
            {
              type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT',
              count: 2,
              persist: false,
            },
            {
              type: 'UPDATE_BAG',
              bag: { products },
              persist: true,
            },
          ]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
          expect(getOrderSummary).not.toHaveBeenCalled()
        })
    })

    it('should get basket from orderSummary Response and call updateOrderSummary when in checkout', () => {
      const orderSummary = {
        basket: basketResponse,
      }
      post.mockImplementationOnce(() => () =>
        Promise.resolve({
          body: {
            ...orderSummary,
          },
        })
      )
      getShoppingBagProducts.mockReturnValueOnce([product])
      isInCheckout.mockReturnValueOnce(true)
      return store
        .dispatch(actions.addToBag(data.productId, data.sku))
        .then(() => {
          const expectedActions = [
            {
              type: 'SET_ADDING_TO_BAG',
            },
            { type: 'INCREMENT_SOCIAL_PROOF_COUNTERS_THUNK' },
            {
              type: 'PRODUCTS_ADDED_TO_BAG',
              payload: {
                products: [
                  {
                    lineNumber: 'KSFS0213',
                    name: 'cool second product',
                    quantity: 1,
                  },
                ],
                quantity: 1,
              },
            },
            { type: 'UPDATE_MOCK_ORDER' },
            {
              type: 'CLEAR_ADDING_TO_BAG',
            },
            { type: 'SET_ESPOT_CONTENT' },
          ]

          expect(store.getActions()).toEqual(expectedActions)
          expect(updateOrderSummaryWithResponse).toHaveBeenCalledTimes(1)
          expect(updateOrderSummaryWithResponse).toHaveBeenCalledWith({
            body: orderSummary,
          })
          expect(getOrderSummary).not.toHaveBeenCalled()
        })
    })

    it('should call addToBagSuccess then show modal if mobile', () => {
      isInCheckout.mockReturnValueOnce(false)
      isMobile.mockReturnValueOnce(true)
      const successHTML = <div>success</div>

      return store
        .dispatch(
          actions.addToBag(
            data.productId,
            data.sku,
            data.partNumber,
            1,
            successHTML
          )
        )
        .then(() => {
          const expectedAction = [
            {
              type: 'SET_MODAL_CHILDREN',
              children: '<div data-reactroot="">success</div>',
            },
          ]

          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
        })
    })

    it('should dispatch `PRODUCTS_ADDED_TO_BAG` action with added products', () => {
      post.mockImplementation(() => () =>
        Promise.resolve({
          text: '{"success" : true}',
          body: {
            products: [
              product,
              {
                lineNumber: 'KSFS0213',
                name: 'cool second product',
                quantity: 2,
              },
            ],
          },
        })
      )
      const store = mockStoreCreator(state)
      isInCheckout.mockReturnValueOnce(false)
      return store.dispatch(actions.addToBag(data)).then(() => {
        expect(store.getActions()).toContainEqual({
          type: 'PRODUCTS_ADDED_TO_BAG',
          payload: {
            products: [
              {
                lineNumber: 'KSFS0213',
                name: 'cool second product',
                quantity: 2,
              },
            ],
            quantity: 1,
          },
        })
      })
    })

    it('add to bag from wishlist using catEntryId', async () => {
      const successHTML = <div>success</div>
      const product = {
        lineNumber: 'KSJ78213',
        name: 'cool product',
      }
      const body = {
        products: [product],
      }
      post.mockImplementation(() => () =>
        Promise.resolve({
          text: '{"success" : true}',
          body,
        })
      )
      post.type = 'MOCK_addToBag'

      const expectedActions = [
        {
          type: 'PRODUCTS_ADDED_TO_BAG',
          payload: { products: [product], quantity: 1 },
        },
        {
          type: 'SET_FORM_LOADING',
          formName: 'promotionCode',
          isLoading: true,
        },
        {
          type: 'SET_FORM_MESSAGE',
          formName: 'promotionCode',
          message: {
            message: '',
          },
          key: null,
        },
        { type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT', count: NaN, persist: false },
        {
          type: 'UPDATE_BAG',
          bag: { products: [product] },
          persist: true,
        },
        { type: 'MOCK_getDeliveryStoreDetails' },
        { type: 'MOCKED_CLOSE_MODAL' },
        { type: 'OPEN_MINI_BAG', autoClose: true },
        { type: 'SET_ESPOT_CONTENT' },
        {
          type: 'SET_FORM_LOADING',
          formName: 'promotionCode',
          isLoading: false,
        },
        { type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT', count: NaN, persist: false },
        {
          type: 'UPDATE_BAG',
          bag: { products: [product] },
          persist: true,
        },
        { type: 'MOCK_getDeliveryStoreDetails' },
        {
          type: 'RESET_FORM',
          formName: 'promotionCode',
          initialValues: { promotionCode: '' },
          key: null,
        },
        {
          type: 'SET_FORM_META',
          field: 'isVisible',
          formName: 'promotionCode',
          value: false,
          key: null,
        },
        {
          type: 'SET_PROMOTION_CODE_CONFIRMATION',
          promotionCodeConfirmation: true,
        },
      ]

      await store.dispatch(actions.addToBagWithCatEntryId(1234, successHTML))

      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })

    it('toggles the mini bag if we are not viewing on a mobile', async () => {
      isMobile.mockReturnValueOnce(false)
      const successHTML = <div>success</div>
      const body = {
        products: [
          {
            lineNumber: 'KSJ78213',
            name: 'cool product',
          },
        ],
      }
      post.mockImplementation(() => () =>
        Promise.resolve({
          text: '{"success" : true}',
          body,
        })
      )
      post.type = 'MOCK_addToBag'

      await store.dispatch(actions.addToBagWithCatEntryId(1234, successHTML))

      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          {
            type: 'OPEN_MINI_BAG',
            autoClose: true,
          },
        ])
      )
    })

    it('does not open the mini bag when we are viewing the application on a small viewport', async () => {
      isMobile.mockReturnValueOnce(true)
      const successHTML = <div>success</div>
      const body = {
        products: [
          {
            lineNumber: 'KSJ78213',
            name: 'cool product',
          },
        ],
      }
      post.mockImplementation(() => () =>
        Promise.resolve({
          text: '{"success" : true}',
          body,
        })
      )
      post.type = 'MOCK_addToBag'

      await store.dispatch(actions.addToBagWithCatEntryId(1234, successHTML))
      expect(store.getActions()).not.toEqual(
        expect.arrayContaining([
          {
            type: 'OPEN_MINI_BAG',
          },
        ])
      )
    })

    describe('On Failure', () => {
      it('should call decrement counter if [post FAILURE]', () => {
        post.mockImplementationOnce(() => () =>
          Promise.reject({
            response: {
              body: {
                message: 'error',
              },
            },
          })
        )

        return store.dispatch(actions.addToBag(data)).then(() => {
          expect(store.getActions()).toEqual(
            expect.arrayContaining([{ type: 'MOCK_setUserErrorMessage' }])
          )
        })
      })
      it('should set Error Form when error message', () => {
        post.mockImplementationOnce(() => () =>
          Promise.reject({
            response: {
              body: {
                message: 'error',
              },
            },
          })
        )
        return store.dispatch(actions.addToBag(data)).then(() => {
          const expectedAction = [{ type: 'MOCK_setUserErrorMessage' }]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
        })
      })
      it('should set API Error if failure when not error message', () => {
        post.mockImplementationOnce(() => () =>
          Promise.reject({
            response: {},
          })
        )
        return store.dispatch(actions.addToBag(data)).then(() => {
          const expectedAction = [{ type: 'MOCK_setApiError' }]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
        })
      })
    })
  })

  describe('persistShoppingBagProduct', () => {
    it('should call decrement counter if failure', () => {
      const product2 = {
        lineNumber: 'LSJ78213',
        name: 'cool product 2',
        quantity: 1,
        catEntryId: 321,
      }
      const product1 = {
        lineNumber: 'KSJ78213',
        name: 'cool product',
        quantity: 1,
        catEntryId: 123,
        catEntryIdToAdd: 1,
        items: [{}, product2],
      }
      const initialState = {
        shoppingBag: {
          bag: {
            products: [product1, product2],
          },
        },
      }
      isInCheckout.mockReturnValueOnce(false)
      const store = getMockStoreWithInitialReduxState(initialState)
      put.mockImplementationOnce(() => () =>
        Promise.reject({
          response: {
            body: {
              message: 'error',
            },
          },
        })
      )
      return store.dispatch(actions.persistShoppingBagProduct(0)).then(() => {
        const expectedAction = [
          { type: 'AJAXCOUNTER_INCREMENT' },
          { type: 'MOCK_setGenericError' },
          { type: 'AJAXCOUNTER_DECREMENT' },
        ]
        expect(store.getActions()).toEqual(
          expect.arrayContaining(expectedAction)
        )
      })
    })

    it('should call getOrderSummary if in Checkout', () => {
      const product2 = {
        lineNumber: 'LSJ78213',
        name: 'cool product 2',
        quantity: 1,
        catEntryId: 321,
      }
      const product1 = {
        lineNumber: 'KSJ78213',
        name: 'cool product',
        quantity: 1,
        catEntryId: 123,
        catEntryIdToAdd: 1,
        items: [{}, product2],
      }
      const initialState = {
        shoppingBag: {
          bag: {
            products: [product1, product2],
          },
        },
      }
      isInCheckout.mockReturnValueOnce(true)
      const store = getMockStoreWithInitialReduxState(initialState)
      put.mockImplementation(() => () =>
        Promise.resolve({ body: { products: [product1, product2] } })
      )
      return store.dispatch(actions.persistShoppingBagProduct(0)).then(() => {
        expect(put).toHaveBeenCalledWith(
          '/shopping_bag/update_item',
          {
            catEntryIdToAdd: 321,
            catEntryIdToDelete: 123,
            quantity: 1,
            responseType: 'orderSummary',
          },
          false
        )
        expect(updateOrderSummaryWithResponse).toHaveBeenCalledWith({
          body: { products: [product1, product2] },
        })
      })
    })
  })

  describe('deleteFromBag', () => {
    const orderId = 12345
    const product = {
      name: 'cool product',
    }
    it('should not show modal if there is no modal text', () => {
      isInCheckout.mockReturnValue(false)
      return store
        .dispatch(actions.deleteFromBag(orderId, product))
        .then(() => {
          const modalChildrenAction = store
            .getActions()
            .find((e) => e.type === 'SET_MODAL_CHILDREN')
          expect(modalChildrenAction).toBeUndefined()
          expect(updateOrderSummaryWithResponse).not.toHaveBeenCalled()
          expect(getOrderSummary).not.toHaveBeenCalled()
        })
    })
    it('should show modal with provided text', () => {
      isInCheckout.mockReturnValue(false)
      const successText = 'Success'
      return store
        .dispatch(actions.deleteFromBag(orderId, product, successText))
        .then(() => {
          const modalChildrenAction = store
            .getActions()
            .find((e) => e.type === 'SET_MODAL_CHILDREN')
          expect(modalChildrenAction).not.toBeNull()
          expect(updateOrderSummaryWithResponse).not.toHaveBeenCalled()
          expect(getOrderSummary).not.toHaveBeenCalled()
        })
    })
    it('should call updateOrderSummary if in checkout', () => {
      const successText = 'Success'
      isInCheckout.mockReturnValue(true)
      return store
        .dispatch(actions.deleteFromBag(orderId, product, successText))
        .then(() => {
          expect(updateOrderSummaryWithResponse).toHaveBeenCalledTimes(1)
          expect(getOrderSummary).not.toHaveBeenCalled()
        })
    })
  })

  describe('delPromotionCode', () => {
    it('should call increment and decrement', () => {
      isInCheckout.mockReturnValue(false)
      return store.dispatch(actions.delPromotionCode({})).then(() => {
        expect(store.getActions()).toEqual([
          { type: 'AJAXCOUNTER_INCREMENT' },
          { type: 'AJAXCOUNTER_DECREMENT' },
          { type: 'UPDATE_SHOPPING_BAG_BADGE_COUNT', count: 0, persist: false },
        ])
        expect(updateOrderSummaryWithResponse).not.toHaveBeenCalled()
        expect(getOrderSummary).not.toHaveBeenCalled()
      })
    })

    it('should getOrderSummary and update Response', () => {
      isInCheckout.mockReturnValue(true)
      return store.dispatch(actions.delPromotionCode({})).then(() => {
        expect(store.getActions()).toEqual([
          { type: 'AJAXCOUNTER_INCREMENT' },
          { type: 'AJAXCOUNTER_DECREMENT' },
          { type: 'UPDATE_MOCK_ORDER' },
        ])
        expect(updateOrderSummaryWithResponse).toHaveBeenCalledTimes(1)
        expect(getOrderSummary).not.toHaveBeenCalled()
      })
    })

    describe('On Failure', () => {
      it('should set Error Form when error message', () => {
        del.mockImplementationOnce(() => () =>
          Promise.reject({
            response: {
              body: {
                message: 'error',
              },
            },
          })
        )
        return store.dispatch(actions.delPromotionCode({})).then(() => {
          const expectedAction = [{ type: 'MOCK_setGenericError' }]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
        })
      })
      it('should set API Error if failure when not error message', () => {
        del.mockImplementationOnce(() => () =>
          Promise.reject({
            response: {},
          })
        )
        return store.dispatch(actions.delPromotionCode({})).then(() => {
          const expectedAction = [{ type: 'MOCK_setApiError' }]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
        })
      })
    })

    describe('initShoppingBag', () => {
      const query = {
        transferStoreID: '1234',
        transferOrderID: '5678',
      }
      const initialState = {
        features: {
          status: {
            FEATURE_NEW_CHECKOUT: true,
            FEATURE_TRANSFER_BASKET: true,
          },
        },
      }
      beforeEach(() => {
        dispatch.mockImplementation(() => ({
          finally: (f) => f(),
        }))
        getState.mockImplementation(() => initialState)
        shouldTransferShoppingBag.mockImplementation(() => true)
      })

      it(
        'transfers the shopping bag when the "FEATURE_TRANSFER_BASKET" feature flag is enabled' +
          'and the url contains the "transferStoreID" and "transferOrderID" valid params',
        () => {
          getState.mockImplementationOnce(() => initialState)
          getLocationQuery.mockReturnValueOnce(query)
          actions.initShoppingBag()(dispatch, getState)
          expect(post).toHaveBeenCalledWith('/shopping_bag/transfer', {
            transferStoreID: 1234,
            transferOrderID: 5678,
          })
          expect(removeTransferShoppingBagParams).toHaveBeenCalled()
        }
      )

      it('doesn\'t transfer the bag when the "FEATURE_TRANSFER_BASKET" feature flag is disabled', () => {
        const state = assocPath(
          ['features', 'status', 'FEATURE_TRANSFER_BASKET'],
          false,
          initialState
        )
        getLocationQuery.mockReturnValueOnce(query)
        getState.mockImplementation(() => state)
        actions.initShoppingBag()(dispatch, getState)
        expect(post).not.toHaveBeenCalled()
      })
    })
  })

  describe('changeDeliveryType', () => {
    function rejectWithError(error) {
      const promise = new Promise((resolve, reject) => reject(error))

      promise.type = 'IGNORE'

      return promise
    }

    it('updates the bag delivery type', async () => {
      put.mockReturnValue(() => Promise.resolve({ body: {} }))
      const payload = {}

      await actions.changeDeliveryType(payload)(store.dispatch, store.getState)

      expect(put).toHaveBeenCalledWith('/shopping_bag/delivery', payload, false)
    })

    it('on error from backend raise a generic error', async () => {
      const err = { response: { body: { message: 'ERROR' } } }
      put.mockReturnValue(rejectWithError(err))
      const payload = {}

      await actions.changeDeliveryType(payload)(store.dispatch, store.getState)

      expect(setGenericError).toHaveBeenCalledWith({ ...err, message: 'ERROR' })
    })

    it('on error without body raises API error', async () => {
      const err = {}
      put.mockReturnValue(rejectWithError(err))
      const payload = {}

      await actions.changeDeliveryType(payload)(store.dispatch, store.getState)

      expect(setApiError).toHaveBeenCalledWith(err)
    })
  })

  describe('MiniBag message actions', () => {
    const defaultMessage = {
      id: '1234',
      message: 'this is a message',
      duration: false,
      isError: false,
      isVisible: true,
      showOnce: false,
    }

    describe('addMiniBagMessage', () => {
      it('returns an action with default message if no options provided', () => {
        const message = 'this is a message'
        const expectedAction = {
          type: 'ADD_MINIBAG_MESSAGE',
          payload: defaultMessage,
        }
        expect(actions.addMiniBagMessage(message)).toEqual(expectedAction)
      })
      it('returns an action with custom message if options provided', () => {
        const message = 'this is a message'
        const options = { duration: 1000 }
        const expectedAction = {
          type: 'ADD_MINIBAG_MESSAGE',
          payload: {
            ...defaultMessage,
            duration: 1000,
          },
        }
        expect(actions.addMiniBagMessage(message, options)).toEqual(
          expectedAction
        )
      })
    })

    describe('removeMiniBagMessage', () => {
      it('creates an action to remove a message', () => {
        const id = '1234'
        const expectedAction = {
          type: 'REMOVE_MINIBAG_MESSAGE',
          id,
        }
        expect(actions.removeMiniBagMessage('1234')).toEqual(expectedAction)
      })
    })

    describe('clearMiniBagMessages', () => {
      it('creates an action to clear all messages', () => {
        const expectedAction = {
          type: 'CLEAR_MINIBAG_MESSAGES',
        }
        expect(actions.clearMiniBagMessages()).toEqual(expectedAction)
      })
    })

    describe('showMiniBagMessage', () => {
      it('creates an action to show a message', () => {
        const id = '1234'
        const expectedAction = {
          type: 'SHOW_MINIBAG_MESSAGE',
          id,
        }
        expect(actions.showMiniBagMessage('1234')).toEqual(expectedAction)
      })
    })

    describe('hideMiniBagMessage', () => {
      it('creates an action to show a message', () => {
        const id = '1234'
        const expectedAction = {
          type: 'HIDE_MINIBAG_MESSAGE',
          id,
        }
        expect(actions.hideMiniBagMessage('1234')).toEqual(expectedAction)
      })
    })

    describe('resetShoppingBag', () => {
      it('creates an action of the correct type', () => {
        const action = actions.resetShoppingBag()

        expect(typeof action).toBe('object')
        expect(action.type).toBe('RESET_SHOPPING_BAG')
        expect(action).toMatchSnapshot()
      })
    })

    describe('emptyShoppingBag', () => {
      it('creates an action of the correct type', () => {
        const action = actions.emptyShoppingBag()

        expect(typeof action).toBe('object')
        expect(action.type).toBe('EMPTY_SHOPPING_BAG')
        expect(action).toMatchSnapshot()
      })
    })
  })
})
