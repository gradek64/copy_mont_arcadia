import { selectDeliveryStore } from '../../../checkoutActions'
import { setStoreCookie } from '../../../../../../client/lib/cookie'
import { setSelectedBrandFulfilmentStore } from '../../../../common/selectedBrandFulfilmentStoreActions'
import { browserHistory } from 'react-router'
import { isReturningCustomer } from '../../../../../selectors/checkoutSelectors'
import { isFeatureCheckoutV2Enabled } from '../../../../../selectors/featureSelectors'

jest.mock('../../../../../../client/lib/cookie', () => ({
  setStoreCookie: jest.fn(),
}))
jest.mock('../../../../common/selectedBrandFulfilmentStoreActions')
jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))
jest.mock('../../../../../selectors/checkoutSelectors', () => ({
  isStoreOrParcelDelivery: jest.fn(() => true),
  isReturningCustomer: jest.fn(() => false),
  getDeliveryStoreForOrderUpdate: jest.fn(() => null),
  getCheckoutOrderSummaryBasket: jest.fn(),
  getCheckoutOrderSummaryShippingCountry: jest.fn(),
  isGuestOrder: jest.fn(() => false),
  isStoreWithParcel: jest.fn(),
}))
jest.mock('../../../../../selectors/featureSelectors', () => ({
  isFeatureCheckoutV2Enabled: jest.fn(() => false),
  isFeatureApplePayEnabled: jest.fn(() => false),
  isFeatureClearPayEnabled: jest.fn(() => false),
}))
jest.mock('../../../../../selectors/ddpSelectors', () => ({}))

describe('selectDeliveryStore()', () => {
  const dispatch = jest.fn((fn) => fn)
  const getState = jest.fn()
  const deliveryStore = {
    storeId: 'TS001',
    brandName: 'Topshop',
    address: {
      line1: 'line1',
      line2: 'line2',
      city: 'city',
      postcode: 'postcode',
    },
  }
  const initialState = {
    routing: {
      location: {
        query: {
          isAnonymous: true,
        },
      },
    },
    config: {
      brandName: 'Topshop',
    },
    account: {
      user: {},
    },
    checkout: {
      orderSummary: {
        deliveryLocations: [
          {
            selected: true,
          },
        ],
      },
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    getState.mockReturnValue(initialState)
  })

  async function executeThunk(action) {
    dispatch.mockImplementation(
      (action) =>
        typeof action === 'function'
          ? action(dispatch, getState)
          : Promise.resolve()
    )

    return action(dispatch, getState)
  }

  describe('default execution', () => {
    it('sets DeliveryStore', async () => {
      await executeThunk(selectDeliveryStore(deliveryStore))

      expect(dispatch.mock.calls[1][0]).toEqual({
        type: 'SET_DELIVERY_STORE',
        store: {
          deliveryStoreCode: 'TS001',
          storeAddress1: 'line1',
          storeAddress2: 'line2',
          storeCity: 'city',
          storePostcode: 'postcode',
        },
      })
    })

    it('updates UI', () => {
      executeThunk(selectDeliveryStore(deliveryStore))
      expect(dispatch.mock.calls[2][0]).toEqual({
        type: 'SET_STORE_UPDATING',
        updating: false,
      })
    })

    it('updates Delivery options with selected store', () => {
      executeThunk(selectDeliveryStore(deliveryStore))
      expect(dispatch.mock.calls[4][0].name).toBe('updateDeliveryOptionsThunk')
    })

    describe('with brand store selected (aka arcadia shop)', () => {
      it('sets cookie and delivery store details', () => {
        executeThunk(selectDeliveryStore(deliveryStore))
        expect(setStoreCookie).toHaveBeenCalledTimes(1)
        expect(setStoreCookie).toHaveBeenCalledWith(deliveryStore)
        expect(setSelectedBrandFulfilmentStore).toHaveBeenCalledTimes(1)
        expect(setSelectedBrandFulfilmentStore).toHaveBeenLastCalledWith(
          deliveryStore
        )
      })
    })

    describe('with parcel shop selected', () => {
      it('should not set cookie or delivery store details', () => {
        executeThunk(
          selectDeliveryStore({
            ...deliveryStore,
            storeId: 'S0007',
          })
        )
        expect(setStoreCookie).not.toHaveBeenCalled()
        expect(setSelectedBrandFulfilmentStore).not.toHaveBeenCalled()
      })
    })
  })

  it('redirects to delivery', () => {
    const promise = executeThunk(selectDeliveryStore(deliveryStore))
    isReturningCustomer.mockImplementation(() => false)

    return promise.then(() => {
      expect(browserHistory.push).toHaveBeenCalledTimes(1)
      expect(browserHistory.push).toHaveBeenCalledWith({
        pathname: '/checkout/delivery',
        query: {
          isAnonymous: true,
        },
      })
    })
  })

  describe('in checkout V2 workflow', () => {
    it('redirects to delivery and payment when the delivery details and credit card details are available', () => {
      isReturningCustomer.mockImplementation(() => true)
      isFeatureCheckoutV2Enabled.mockImplementation(() => true)
      getState.mockReturnValue({
        ...initialState,
        features: {
          status: {
            FEATURE_NEW_CHECKOUT: true,
          },
        },
      })
      const promise = executeThunk(selectDeliveryStore(deliveryStore))

      return promise.then(() => {
        expect(browserHistory.push).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenCalledWith({
          pathname: '/checkout/delivery-payment',
          query: {
            isAnonymous: true,
          },
        })
      })
    })
  })
})
