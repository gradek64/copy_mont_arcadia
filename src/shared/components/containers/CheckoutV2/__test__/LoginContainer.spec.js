import { compose } from 'ramda'
import * as reactRouter from 'react-router'

import testComponentHelper, {
  analyticsDecoratorHelper,
  buildComponentRender,
  mountRender,
  withStore,
} from 'test/unit/helpers/test-component'
import { sendEvent } from '../../../../actions/common/googleAnalyticsActions'

import Login from '../../Login/Login'
import Register from '../../Register/Register'
import ForgetPassword from '../../ForgetPassword/ForgetPassword'

import LoginContainer, { WrappedLoginContainer } from '../LoginContainer'

jest.mock('react-router')

jest.mock('../../../../actions/common/googleAnalyticsActions')
jest.mock('../../../../lib/user-agent', () => ({
  isIOS: jest.fn(() => false),
}))

jest.mock('../../../../selectors/featureSelectors', () => ({
  isFeatureDDPEnabled: () => false,
  isFeatureDDPRenewable: () => false,
  isFeatureDDPActiveBannerEnabled: () => false,
  isFeatureDDPPromoEnabled: () => false,
  isFeatureRememberMeEnabled: () => false,
  isFeatureDesktopResetPasswordEnabled: () => false,
  isFeatureApplePayEnabled: () => false,
  isFeatureClearPayEnabled: () => false,
}))

jest.mock('../../../../selectors/userAuthSelectors', () => ({
  isUserPartiallyAuthenticated: () => false,
}))

jest.mock('../../../../lib/restricted-actions', () => ({
  intendedUserChanged: jest.fn(),
  restrictedAction: jest.fn(),
}))

import { intendedUserChanged } from '../../../../lib/restricted-actions'

describe('<LoginContainer />', () => {
  const renderComponent = testComponentHelper(WrappedLoginContainer, {
    disableLifecycleMethods: false,
  })

  const getOrderSummaryMock = jest.fn()
  const emptyOrderSummaryMock = jest.fn()

  const requiredProps = {
    continueAsGuest: () => {},
    getOrderSummary: getOrderSummaryMock,
    emptyOrderSummary: emptyOrderSummaryMock,
    sendEvent,
    getNextRoute: jest.fn(),
    isShoppingBagEmpty: false,
    location: { query: {} },
    showMessage: false,
  }

  let oldWindow
  beforeAll(() => {
    oldWindow = window
    window.scrollTo = jest.fn()
  })

  afterEach(() => {
    getOrderSummaryMock.mockReset()
    reactRouter.browserHistory.push.mockImplementation(jest.fn)
    window.scrollTo.mockReset()
  })

  afterAll(() => {
    window.scrollTo = oldWindow.scrollTo
  })

  describe('@renders', () => {
    it('in default state', () => {
      const { getTree } = renderComponent(requiredProps)
      expect(getTree()).toMatchSnapshot()
    })
    it('should render guest checkout option', () => {
      const { getTree } = renderComponent({
        ...requiredProps,
        isGuestCheckoutEnabled: true,
        shoppingBagContainsDDP: false,
      })
      expect(getTree()).toMatchSnapshot()
    })
    it('should not render guest checkout option if shopping bag contains DDP', () => {
      const { getTree } = renderComponent({
        ...requiredProps,
        isGuestCheckoutEnabled: true,
        shoppingBagContainsDDP: true,
      })
      expect(getTree()).toMatchSnapshot()
    })
    it('should pass getOrderSummary method as successCallback', () => {
      const { wrapper } = renderComponent(requiredProps)
      expect(getOrderSummaryMock).toHaveBeenCalledTimes(0)
      wrapper.find(Login).prop('successCallback')()
      expect(getOrderSummaryMock).toHaveBeenCalledTimes(1)
    })
    it('should pass orderId to ForgetPassword', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        orderId: 12345,
      })
      wrapper
        .find('Accordion')
        .at(0)
        .props()
        .onAccordionToggle()
      expect(wrapper.find(ForgetPassword).prop('orderId')).toEqual(12345)
    })
    it('should render session timeout message', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        showMessage: true,
      })
      expect(wrapper.find('SignInMessage')).toHaveLength(1)
    })
    it('should render guest checkout button', () => {
      const { wrapper, getTree } = renderComponent({
        ...requiredProps,
        isGuestCheckoutEnabled: true,
        shoppingBagContainsDDP: false,
      })
      expect(getTree()).toMatchSnapshot()
      expect(wrapper.find('GuestCheckoutButton')).toHaveLength(1)
    })
    it('should not render guest checkout button', () => {
      const { wrapper, getTree } = renderComponent({
        ...requiredProps,
        isGuestCheckoutEnabled: true,
        shoppingBagContainsDDP: true,
      })
      expect(getTree()).toMatchSnapshot()
      expect(wrapper.find('GuestCheckoutButton')).toHaveLength(0)
    })

    describe('Shopping bag does not contain DDP', () => {
      describe('Guest Checkout FF is disabled', () => {
        it('should render the Qubit wrapper', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            shoppingBagContainsDDP: false,
            isGuestCheckoutEnabled: false,
          })
          const qubitWrapper = wrapper.find('#ADP-3161-guest-checkout')
          expect(qubitWrapper.exists()).toBeTruthy()
        })
      })
      describe('Guest Checkout FF is abled', () => {
        it('should not render the Qubit wrapper', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            shoppingBagContainsDDP: false,
            isGuestCheckoutEnabled: true,
          })
          const qubitWrapper = wrapper.find('#ADP-3161-guest-checkout')
          expect(qubitWrapper.exists()).toBeFalsy()
        })
      })
    })
  })

  describe('@events', () => {
    describe('Accordion toggle', () => {
      const excpectedDefaultState = {
        returningCustomerSelected: false,
        newCustomerSelected: false,
        guestCustomerSelected: false,
      }

      it('should toggle returningCustomerSelected to "true"', () => {
        const selectedTile = '.LoginContainer-returningCustomer.Selected'

        const { wrapper } = renderComponent({
          ...requiredProps,
          isUserPartiallyAuthenticated: false,
        })
        expect(wrapper.state()).toEqual(excpectedDefaultState)
        expect(wrapper.find(selectedTile).exists()).toBeFalsy()
        wrapper
          .find('Accordion')
          .at(0)
          .props()
          .onAccordionToggle()
        expect(wrapper.state()).toEqual({
          ...excpectedDefaultState,
          returningCustomerSelected: true,
        })
        expect(wrapper.find(selectedTile).exists()).toBeTruthy()
      })

      it('should toggle newCustomerSelected to "true"', () => {
        const selectedTile = '.LoginContainer-newCustomer.Selected'

        const { wrapper } = renderComponent({
          ...requiredProps,
          isUserPartiallyAuthenticated: false,
        })
        expect(wrapper.find(selectedTile).exists()).toBeFalsy()
        expect(wrapper.state()).toEqual(excpectedDefaultState)
        wrapper
          .find('Accordion')
          .at(1)
          .props()
          .onAccordionToggle()
        expect(wrapper.state()).toEqual({
          ...excpectedDefaultState,
          newCustomerSelected: true,
        })
        expect(wrapper.find(selectedTile).exists()).toBeTruthy()
      })

      it('should toggle guestCustomerSelected to "true"', () => {
        const selectedTile = '.LoginContainer-guestCustomer.Selected'
        const { wrapper } = renderComponent({
          ...requiredProps,
          isUserPartiallyAuthenticated: false,
          isGuestCheckoutEnabled: true,
          shoppingBagContainsDDP: false,
        })
        expect(wrapper.state()).toEqual(excpectedDefaultState)
        expect(wrapper.find(selectedTile).exists()).toBeFalsy()
        wrapper
          .find('Accordion')
          .at(2)
          .props()
          .onAccordionToggle()
        expect(wrapper.state()).toEqual({
          ...excpectedDefaultState,
          guestCustomerSelected: true,
        })
        expect(wrapper.find(selectedTile).exists()).toBeTruthy()
      })
    })
  })

  describe('@decorators', () => {
    analyticsDecoratorHelper(LoginContainer, 'checkout-login', {
      componentName: 'LoginContainer',
      isAsync: true,
      redux: true,
    })
  })

  describe('@lifecycle methods', () => {
    describe('componentDidMount', () => {
      it('should scroll to top of page', () => {
        const mountComponent = buildComponentRender(
          compose(
            mountRender,
            withStore({
              forms: {
                register: {
                  fields: {
                    email: {},
                  },
                },
                login: {
                  fields: {
                    password: {},
                  },
                },
                forgetPassword: {
                  fields: {
                    email: {},
                  },
                },
              },
              config: {
                langHostnames: {
                  default: {
                    defaultLanguage: 'English',
                  },
                },
                language: '',
                brandName: 'topshop',
                region: 'gb',
              },
              account: {},
            })
          ),
          WrappedLoginContainer
        )

        expect(window.scrollTo).not.toHaveBeenCalled()
        mountComponent(requiredProps)
        expect(window.scrollTo).toHaveBeenCalled()
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
      })
    })
  })

  function getLoginProps(redirectUrl) {
    return {
      location: {
        query: {
          redirectUrl,
        },
      },
    }
  }

  describe('success callbacks', () => {
    it('calls orderSummary request on Register success', () => {
      const { wrapper } = renderComponent(requiredProps)

      const register = wrapper.find(Register)
      const successCallback = register.prop('successCallback')

      successCallback()

      expect(getOrderSummaryMock).toHaveBeenCalled()
    })

    it('returns a resolved promise if restricted action user logs back in', async () => {
      intendedUserChanged.mockReturnValueOnce(() => false)

      const loginProps = getLoginProps('/checkout/payment')
      const { instance } = renderComponent({
        ...requiredProps,
        ...loginProps,
        location: {
          query: {
            redirectUrl: '/',
          },
        },
      })
      const isPromise = (obj) =>
        !!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        typeof obj.then === 'function'

      const response = instance.handleSuccess()
      expect(isPromise(response)).toBe(true)
      expect(await response).toBeUndefined()
      expect(getOrderSummaryMock).not.toHaveBeenCalled()
    })

    it('Gets order summary if restricted action different user logs in or no restrcied action logic applies', async () => {
      intendedUserChanged.mockReturnValueOnce(() => true)

      const loginProps = getLoginProps('/checkout/payment')
      const { instance } = renderComponent({
        ...requiredProps,
        ...loginProps,
        location: {
          query: {
            redirectUrl: '/',
          },
        },
      })

      instance.handleSuccess()

      expect(getOrderSummaryMock).toHaveBeenCalled()
    })
  })

  describe('Remember me', () => {
    it('Redirects to my-account if the user changes', () => {
      intendedUserChanged.mockReturnValueOnce(() => true)
      const props = {
        ...requiredProps,
        isRememberMeEnabled: true,
      }

      const { wrapper } = renderComponent(props)
      const getNextRoute = wrapper.find(Login).prop('getNextRoute')

      expect(typeof getNextRoute).toBe('function')

      const result = getNextRoute()

      expect(result).toBe('/my-account')
    })

    it('Redirects to redirectUrl if user does not change if available', () => {
      const expectedRoute = '/checkout/payment'
      intendedUserChanged.mockReturnValueOnce(() => false)
      const loginProps = getLoginProps(expectedRoute)
      const props = {
        ...requiredProps,
        ...loginProps,
        isRememberMeEnabled: true,
      }

      const { wrapper } = renderComponent(props)
      const getNextRoute = wrapper.find(Login).prop('getNextRoute')

      expect(typeof getNextRoute).toBe('function')

      const result = getNextRoute()

      expect(result).toBe(expectedRoute)
    })

    it('Redirects to checkout if there is currently no pending restricted action', () => {
      const expectedRoute = '/checkout'
      intendedUserChanged.mockReturnValueOnce(null)

      const props = {
        ...requiredProps,
        isRememberMeEnabled: true,
      }

      const { wrapper } = renderComponent(props)
      const getNextRoute = wrapper.find(Login).prop('getNextRoute')

      expect(typeof getNextRoute).toBe('function')

      const result = getNextRoute({ basketItemCount: 1 })

      expect(result).toBe(expectedRoute)
    })
  })

  describe('@methods', () => {
    describe('getRegisterNextRoute', () => {
      it('should return a route address', () => {
        const { wrapper } = renderComponent(requiredProps)
        expect(wrapper.instance().getRegisterNextRoute()).toEqual(
          '/checkout?new-user'
        )
      })
    })
  })
})
