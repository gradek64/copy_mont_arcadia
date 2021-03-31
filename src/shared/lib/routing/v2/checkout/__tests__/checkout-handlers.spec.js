import {
  checkoutRedirect,
  paymentRedirect,
  onEnterPayment,
  onEnterDelivery,
  redirectOnSSR,
} from '../checkout-handlers'

const getState = () => ({
  account: {
    user: {},
  },
  checkout: {},
  shoppingBag: {
    totalItems: 1,
  },
  auth: {
    authentication: false,
  },
})

const dispatch = jest.fn()
const replace = jest.fn()
const callback = jest.fn()

const getUser = () => ({
  exists: true,
  email: 'john.doe.6sep3@example.org',
  title: 'Mr',
  firstName: 'Jane',
  lastName: 'Roe',
  userTrackingId: 2261372,
  subscriptionId: 2075573,
  basketItemCount: 1,
  creditCard: {
    type: 'VISA',
    cardNumberHash: 'tjOBl4zzS+ueTZQWartO5l968iOmCOix',
    cardNumberStar: '************1111',
    expiryMonth: '09',
    expiryYear: '2017',
  },
  deliveryDetails: {
    addressDetailsId: 2210390,
    nameAndPhone: {
      title: 'Mr',
      firstName: 'Jane',
      lastName: 'Roe',
      telephone: '07888444555',
    },
    address: {
      address1: 'Flat 6, Hales Prior, Calshot Street',
      address2: '',
      city: 'LONDON',
      state: '',
      country: 'United Kingdom',
      postcode: 'N1 9JW',
    },
  },
  billingDetails: {
    addressDetailsId: 2210392,
    nameAndPhone: {
      title: 'Mr',
      firstName: 'Jane',
      lastName: 'Roe',
      telephone: '07888444555',
    },
    address: {
      address1: 'Flat 8, Mackintosh Lane',
      address2: '',
      city: 'LONDON',
      state: '',
      country: 'United Kingdom',
      postcode: 'E2 8FB',
    },
  },
  version: '1.7',
})

describe('Checkout Routing Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkoutRedirect', () => {
    it('should redirect to /checkout/login if not logged in', () => {
      checkoutRedirect({ getState, dispatch }, null, replace)
      expect(replace).toHaveBeenCalledTimes(1)
      expect(replace).lastCalledWith('/checkout/login')
    })

    it('should redirect to /checkout/delivery as default', () => {
      const state = getState()
      state.auth.authentication = 'full'
      checkoutRedirect({ getState: () => state, dispatch }, null, replace)
      expect(replace).toHaveBeenCalledTimes(1)
      expect(replace).lastCalledWith('/checkout/delivery')
    })

    it('should page the query string to /checkout/delivery', () => {
      const state = getState()
      const nextState = {
        location: {
          search: '?foo=bar',
        },
      }
      state.auth.authentication = 'full'
      checkoutRedirect({ getState: () => state, dispatch }, nextState, replace)
      expect(replace).lastCalledWith('/checkout/delivery?foo=bar')
    })

    it('should redirect to /checkout/delivery-payment if user has a checkout profile', () => {
      const state = getState()
      state.auth.authentication = 'full'
      state.checkout.newCheckout = true
      state.account.user = {
        deliveryDetails: {
          addressDetailsId: 1,
        },
        billingDetails: {
          addressDetailsId: 1,
        },
        hasBillingDetails: true,
        hasDeliveryDetails: true,
        creditCard: {
          cardNumberHash: true,
        },
      }
      checkoutRedirect({ getState: () => state }, null, replace)
      expect(replace).toHaveBeenCalledTimes(1)
      expect(replace).lastCalledWith('/checkout/delivery-payment')
    })

    it('should redirect to /checkout/delivery-payment if user has a checkout profile and fill forms if empty', () => {
      const state = {
        ...getState(),
        auth: {
          authentication: 'full',
        },
        account: {
          user: getUser(),
        },
        checkout: {
          newCheckout: true,
          orderSummary: {
            deliveryLocations: [
              {
                deliveryLocationType: 'HOME',
                selected: true,
              },
            ],
          },
        },
      }
      const dispatch = jest.fn()
      checkoutRedirect({ getState: () => state, dispatch }, null, replace)
      expect(replace).toHaveBeenCalledTimes(1)
      expect(replace).lastCalledWith('/checkout/delivery-payment')
      expect(dispatch).toHaveBeenCalledTimes(3)
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SET_DELIVERY_AS_BILLING_FLAG',
        val: true,
      })
      expect(dispatch).toHaveBeenCalledWith({
        formName: 'yourAddress',
        initialValues: {
          address1: 'Flat 6, Hales Prior, Calshot Street',
          address2: '',
          city: 'LONDON',
          country: 'United Kingdom',
          postcode: 'N1 9JW',
          state: '',
        },
        key: null,
        type: 'RESET_FORM_DIRTY',
      })
      expect(dispatch).toHaveBeenCalledWith({
        formName: 'yourDetails',
        initialValues: {
          firstName: 'Jane',
          lastName: 'Roe',
          telephone: '07888444555',
          title: 'Mr',
        },
        key: null,
        type: 'RESET_FORM_DIRTY',
      })
    })
  })

  describe('paymentRedirect', () => {
    global.process.browser = true
    it('should redirect to /checkout/login when logged out', () => {
      paymentRedirect({ getState }, null, replace)
      expect(replace).toHaveBeenCalledTimes(1)
      expect(replace).lastCalledWith('/checkout/login')
    })

    it('should do nothing when logged in', () => {
      const state = getState()
      state.auth.authentication = 'full'
      paymentRedirect({ getState: () => state }, null, replace)
      expect(replace).toHaveBeenCalledTimes(0)
    })
  })

  describe('onEnterPayment', () => {
    const state = {
      ...getState(),
      features: {
        status: {
          FEATURE_SAVE_PAYMENT_DETAILS: true,
        },
      },
    }
    const fakeAuth = { authentication: 'full' }
    const fakeForms = {
      checkout: {
        yourDetails: {
          fields: {
            title: { value: '' },
            firstName: { value: null },
            lastName: { value: null },
            telephone: { value: null },
          },
        },
      },
    }
    const trueForms = {
      checkout: {
        yourDetails: {
          fields: {
            title: { value: 'dr' },
            firstName: { value: 'Enzo' },
            lastName: { value: 'dono' },
            telephone: { value: '' },
          },
        },
      },
    }
    it('NOT LOGGED USER : should replace on login', () => {
      onEnterPayment(
        { getState: () => ({ ...state, forms: fakeForms }), dispatch },
        null,
        replace,
        callback
      )
      expect(replace).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledTimes(1)
    })
    it('Logged User : should call resetSavePayment', () => {
      const account = {
        user: {
          billingDetails: {
            addressDetailsId: 123456,
          },
        },
      }

      onEnterPayment(
        {
          getState: () => ({
            ...state,
            auth: fakeAuth,
            forms: trueForms,
            account,
          }),
          dispatch,
        },
        null,
        replace,
        callback
      )
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledTimes(1)
    })
    it('should call replace delivery when User details are null or wrongs', () => {
      onEnterPayment(
        {
          getState: () => ({ ...state, auth: fakeAuth, forms: fakeForms }),
          dispatch,
        },
        null,
        replace,
        callback
      )
      expect(replace).toHaveBeenCalledTimes(1)
      expect(replace).lastCalledWith('/checkout/delivery')
    })

    it('should redirect a user to the home page if shoppingBag.totalItems is less than one', () => {
      onEnterPayment(
        {
          getState: () => ({
            ...state,
            shoppingBag: {},
            auth: fakeAuth,
            forms: fakeForms,
          }),
          dispatch,
        },
        null,
        replace,
        callback
      )
      expect(replace).toHaveBeenCalledTimes(1)
      expect(replace).lastCalledWith('/')
    })
  })

  describe('onEnterDelivery', () => {
    const state = {
      ...getState(),
    }
    const fakeAuth = { authentication: 'full' }

    const returningUser = {
      user: {
        billingDetails: {
          addressDetailsId: 12345,
        },
      },
    }

    it('should redirect user to checkout login page if user is not authenticated', () => {
      onEnterDelivery(
        { getState: () => ({ ...state }) },
        null,
        replace,
        callback
      )
      expect(replace).toHaveBeenCalledWith('/checkout/login')
      expect(callback).toHaveBeenCalledTimes(1)
    })
    it('should redirect to home page if user is authenticated and has no items in the bag', () => {
      onEnterDelivery(
        {
          getState: () => ({ ...state, auth: fakeAuth, shoppingBag: {} }),
        },
        null,
        replace,
        callback
      )
      expect(replace).toHaveBeenCalledWith('/')
      expect(callback).toHaveBeenCalledTimes(1)
    })
    it('should redirect to checkout delivery payments if user is authenticated has items in the bag and is a returning user ', () => {
      onEnterDelivery(
        {
          getState: () => ({
            ...state,
            auth: fakeAuth,
            account: returningUser,
          }),
        },
        null,
        replace,
        callback
      )
      expect(replace).toHaveBeenCalledWith('/checkout/delivery-payment')
      expect(callback).toHaveBeenCalledTimes(1)
    })
    it('should not redirect if user is authenticated, has items in the bag and is not a returning user', () => {
      onEnterDelivery(
        {
          getState: () => ({
            ...state,
            auth: fakeAuth,
          }),
        },
        null,
        replace,
        callback
      )
      expect(replace).toHaveBeenCalledTimes(0)
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('redirectOnSSR', () => {
    afterAll(() => {
      global.process.browser = false
    })

    it('should redirect to `/checkout` route on Server Side Renders', () => {
      global.process.browser = false
      redirectOnSSR(null, replace)
      expect(replace).toHaveBeenCalledTimes(1)
      expect(replace).lastCalledWith('/')
    })
    it('should not perform a redirection in the client', () => {
      global.process.browser = true
      redirectOnSSR(null, replace)
      expect(replace).not.toHaveBeenCalled()
    })
  })
})
