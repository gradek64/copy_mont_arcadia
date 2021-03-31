import LoginRegisterContainer, {
  mapStateToProps,
} from '../LoginRegisterContainer'
import testComponentHelper, {
  analyticsDecoratorHelper,
} from '../../../../../../test/unit/helpers/test-component'
import { getOrderSummary } from '../../../../actions/common/checkoutActions'
import { sendEvent } from '../../../../actions/common/googleAnalyticsActions'
import ContactBanner from '../../../common/ContactBanner/ContactBanner'
import Helmet from 'react-helmet'

jest.mock('../../../../lib/query-helper', () => ({
  splitQuery: (search) => ({
    return: search.split('&')[0].split('=')[1],
  }),
}))

jest.mock('../../LoginRegister/LoginRegister', () => 'LoginRegister')

jest.mock('../../../../actions/common/checkoutActions', () => ({
  getOrderSummary: jest.fn(),
}))

jest.mock('../../../../actions/common/googleAnalyticsActions', () => ({
  sendEvent: jest.fn(),
}))

describe('<LoginRegisterContainer />', () => {
  let initialProps
  let searchProps
  let checkoutProps

  beforeEach(() => {
    initialProps = {
      hostname: 'm.topshop.com',
      pathname: '/login',
      search: '',
      sendEvent,
      getOrderSummary,
    }

    searchProps = {
      ...initialProps,
      ...initialProps.location,
      search:
        'return=https://m.topshop.com/fakeurl-this_should_be_the_next_route',
    }

    checkoutProps = {
      ...initialProps,
      ...initialProps.location,
      pathname: '/checkout/login',
    }
  })

  const renderComponent = testComponentHelper(
    LoginRegisterContainer.WrappedComponent.WrappedComponent
  )

  describe('@renders', () => {
    describe('when the path is /checkout/login', () => {
      test('it renders with the correct nextLoginRoute and nextRegisterRoute', () => {
        expect(renderComponent(checkoutProps).getTree()).toMatchSnapshot()
      })

      test('it passes getOrderSummary action as the loginSuccessCallback to <LoginRegister/>', () => {
        expect(
          renderComponent(checkoutProps)
            .wrapper.find('LoginRegister')
            .prop('loginSuccessCallback')
        ).toBe(getOrderSummary)
      })

      test('it sets the canonical URL', () => {
        expect(
          renderComponent(checkoutProps)
            .wrapper.find(Helmet)
            .prop('link')
        ).toEqual([
          { rel: 'canonical', href: 'http://www.topshop.com/checkout/login' },
        ])
      })
      test('it prefixes the canonical URL with https when FEATURE_HTTPS_CANONICAL enabled', () => {
        expect(
          renderComponent({
            ...checkoutProps,
            isFeatureHttpsCanonicalEnabled: true,
          })
            .wrapper.find(Helmet)
            .prop('link')
        ).toEqual([
          { rel: 'canonical', href: 'https://www.topshop.com/checkout/login' },
        ])
      })
      test('it renders <ContactBanner/>', () => {
        expect(
          renderComponent({
            ...checkoutProps,
            isFeatureHttpsCanonicalEnabled: true,
          })
            .wrapper.find(ContactBanner)
            .exists()
        ).toBe(true)
      })
    })

    describe('when the path is /login', () => {
      test('it renders in the default state (empty nextLoginRoute and nextRegisterRoute)', () => {
        expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
      })
      test('it renders with a search param and passes the correct nextRegisterRoute and nextLoginRoute to the <LoginRegister/> component', () => {
        expect(renderComponent(searchProps).getTree()).toMatchSnapshot()
      })
    })
  })

  describe('@decorators', () => {
    analyticsDecoratorHelper(LoginRegisterContainer, 'unified-register-login', {
      componentName: 'LoginRegisterContainer',
      redux: true,
      isAsync: true,
    })
  })

  describe('@lifecycle', () => {
    test('if the component is used in checkout it sends an analytics event', () => {
      renderComponent(checkoutProps)
        .wrapper.instance()
        .componentDidMount()
      expect(sendEvent).toHaveBeenCalledWith('Checkout', 'Login', 'Sign In')
    })
  })

  describe('mapStateToProps', () => {
    test('it builds props from state', () => {
      const state = {
        routing: {
          location: {
            hostname: 'm.topshop.com',
            pathname: '/login',
            search: '',
          },
        },
      }

      expect(mapStateToProps(state)).toEqual({ ...state.routing.location })
    })
  })
})
