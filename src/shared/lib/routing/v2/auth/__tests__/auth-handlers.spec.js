import {
  requiresAuth,
  requiresNotAuth,
  checkAuthentication,
} from '../auth-handlers'
import { isReturningCustomer } from '../../../../../selectors/checkoutSelectors'

jest.mock('../../../../../selectors/checkoutSelectors')

const getState = () => ({
  auth: {
    authentication: 'full',
  },
  account: {
    user: {
      billingDetails: {
        addressDetailId: 123456,
      },
    },
  },
})

const getFalseState = () => ({
  auth: {
    authentication: false,
  },
  routing: {
    location: {
      query: {
        isAnonymous: null,
      },
    },
  },
})

describe('Auth Routing Handlers', () => {
  describe('requiresAuth', () => {
    it('should do nothing if logged', () => {
      const replace = jest.fn()
      requiresAuth({ getState }, null, replace)
      expect(replace).toHaveBeenCalledTimes(0)
    })

    it('should redirect to /checkout/login if not logged in', () => {
      const replace = jest.fn()
      requiresAuth(
        {
          getState: getFalseState,
        },
        null,
        replace
      )
      expect(replace).toHaveBeenCalledTimes(1)
      expect(replace).lastCalledWith('/checkout/login')
    })
  })

  describe('requiresNotAuth', () => {
    afterEach(() => {
      process.browser = false
    })

    it('should redirect to "delivery-payment" if user is authenticated and is a returning user', () => {
      process.browser = true
      const callback = jest.fn()
      const replace = jest.fn()
      isReturningCustomer.mockImplementationOnce(() => true)
      requiresNotAuth({ getState }, null, replace, callback)
      expect(replace).toHaveBeenCalledWith('/checkout/delivery-payment')
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should redirect to "delivery" if user is authenticated and is a not returning user', () => {
      process.browser = true
      const callback = jest.fn()
      const replace = jest.fn()
      isReturningCustomer.mockImplementationOnce(() => false)
      requiresNotAuth({ getState }, null, replace, callback)
      expect(replace).toHaveBeenCalledWith('/checkout/delivery')
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should not redirect if user is not authenticated', () => {
      const callback = jest.fn()
      const replace = jest.fn()
      isReturningCustomer.mockImplementationOnce(() => false)
      requiresNotAuth({ getState: getFalseState }, null, replace, callback)
      expect(replace).toHaveBeenCalledTimes(0)
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('checkAuthentication', () => {
    it('should redirect to /my-account if logged in and going to /login', () => {
      const replace = jest.fn()
      const nextState = {
        location: {
          pathname: '/login',
        },
      }
      checkAuthentication({ getState }, nextState, replace)
      expect(replace).toHaveBeenCalledTimes(1)
      expect(replace).lastCalledWith('/my-account')
    })

    it('should redirect to /login if not logged in and going to /my-account', () => {
      const replace = jest.fn()
      const nextState = {
        location: {
          pathname: '/my-account',
        },
      }
      checkAuthentication(
        {
          getState: getFalseState,
        },
        nextState,
        replace
      )
      expect(replace).toHaveBeenCalledTimes(1)
      expect(replace).lastCalledWith('/login')
    })

    it('should do nothing if destination is not login or my-account', () => {
      const replace = jest.fn()
      const nextState = {
        location: {
          pathname: '/nothing',
        },
      }
      checkAuthentication(
        {
          getState: getFalseState,
        },
        nextState,
        replace
      )
      expect(replace).toHaveBeenCalledTimes(0)
    })
  })
})
