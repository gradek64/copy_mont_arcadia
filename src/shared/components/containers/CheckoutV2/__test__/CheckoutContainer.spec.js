import deepFreeze from 'deep-freeze'

import testComponentHelper from 'test/unit/helpers/test-component'
import CheckoutBagSide from '../../../common/CheckoutBagSide/CheckoutBagSide'
import CheckoutMessage from '../../../common/CheckoutMessage/CheckoutMessage'

import CheckoutContainer from '../CheckoutContainer'
import { getAccountAndOrderSummary } from 'src/shared/actions/common/checkoutActions'
import { getAllPaymentMethods } from '../../../../actions/common/paymentMethodsActions'
import { getContent } from '../../../../actions/common/sandBoxActions'
import { browserHistory } from 'react-router'
import ContactBanner from '../../../common/ContactBanner/ContactBanner'

// Constants
import espotsMobile from '../../../../constants/espotsMobile'
import cmsConsts from '../../../../constants/cmsConsts'

jest.mock('src/shared/actions/common/checkoutActions', () => ({
  getAccountAndOrderSummary: jest.fn(),
}))

jest.mock('../../../../../client/lib/reporter', () => ({
  checkoutInfoReport: jest.fn(),
}))

jest.mock('src/shared/actions/common/paymentMethodsActions', () => ({
  getAllPaymentMethods: jest.fn(),
}))

jest.mock('src/shared/actions/common/sandBoxActions', () => ({
  getContent: jest.fn(),
}))

jest.mock('react-router', () => ({
  browserHistory: [],
}))

describe('<CheckoutContainer V2/>', () => {
  beforeEach(() => jest.resetAllMocks())

  const renderComponent = testComponentHelper(
    CheckoutContainer.WrappedComponent
  )

  const initialProps = deepFreeze({
    checkout: {
      threeDSecurePrompt: null,
      checkoutVersion: 'AAAA',
    },
    location: {
      pathname: '/checkout/blabla',
    },
    brandCode: 'BRAND',
    orderSummary: {},
    showDiscounts: true,
    getOrderSummary: jest.fn(),
    sessionReset: jest.fn(),
    getAllPaymentMethods: jest.fn(),
  })

  const cfsPathname = {
    pathname: '/checkout/delivery/collect-from-store',
  }

  const loginPathname = {
    pathname: '/checkout/login',
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('on collect-from-store page', () => {
      expect(
        renderComponent({ ...initialProps, location: cfsPathname }).getTree()
      ).toMatchSnapshot()
    })

    it('on login page', () => {
      expect(
        renderComponent({ ...initialProps, location: loginPathname }).getTree()
      ).toMatchSnapshot()
    })

    it('in children state', () => {
      expect(
        renderComponent({ ...initialProps, children: 'children' }).getTree()
      ).toMatchSnapshot()
    })

    it('in threeDSecurePrompt state', () => {
      expect(
        renderComponent({
          ...initialProps,
          checkout: { threeDSecurePrompt: '<form id="paymentForm"></form>' },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('in stage other than login and having a populated basket', () => {
      const component = renderComponent({
        ...initialProps,
        orderSummary: {
          basket: { orderId: 1661608 },
        },
      })
      expect(component.getTree()).toMatchSnapshot()
      expect(component.wrapper.find(CheckoutBagSide).length).toBe(1)
    })

    it('should not render CheckoutMessage component when there is a sessionError', () => {
      const component = renderComponent({
        ...initialProps,
        errorSession: { sessionExpired: true },
      })
      expect(component.getTree()).toMatchSnapshot()
      expect(component.wrapper.find(CheckoutMessage).exists()).toBe(false)
    })

    it('should render the ContactBanner component', () => {
      const component = renderComponent({
        ...initialProps,
        errorSession: { sessionExpired: true },
      })
      expect(component.getTree()).toMatchSnapshot()
      expect(component.wrapper.find(ContactBanner).exists()).toBe(true)
    })
  })

  describe('@needs', () => {
    it('should call getAccountAndOrderSummary()', () => {
      expect(getAccountAndOrderSummary).toHaveBeenCalledTimes(0)
      CheckoutContainer.needs[0]()

      expect(getAccountAndOrderSummary).toHaveBeenCalledTimes(1)
    })

    it('calls getAllPaymentMethods()', () => {
      expect(getAllPaymentMethods).toHaveBeenCalledTimes(0)
      CheckoutContainer.needs[1]()

      expect(getAllPaymentMethods).toHaveBeenCalledTimes(1)
    })

    it('calls getContent with expected props', () => {
      expect(getContent).toHaveBeenCalledTimes(0)
      CheckoutContainer.needs[2]()

      expect(getContent).toHaveBeenCalledTimes(1)
      expect(getContent).toHaveBeenCalledWith(
        null,
        espotsMobile.checkout[0],
        cmsConsts.ESPOT_CONTENT_TYPE
      )
    })
  })

  describe('@lifecycle', () => {
    describe('UNSAFE_componentWillMount', () => {
      beforeEach(() => jest.resetAllMocks())

      it('should clear session expired flag -> calls sessionReset', () => {
        const { instance } = renderComponent(initialProps)
        jest.resetAllMocks()

        instance.UNSAFE_componentWillMount()
        expect(instance.props.sessionReset).toHaveBeenCalledTimes(1)
      })
    })

    describe('componentDidMount', () => {
      it('should call getOrderSummary() if mounted on the client', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: ['visited1', 'visited2'],
        })
        expect(instance.props.getOrderSummary).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(instance.props.getOrderSummary).toHaveBeenCalledTimes(1)
        expect(instance.props.getOrderSummary).lastCalledWith({
          shouldUpdateBag: true,
          shouldUpdateForms: false,
        })
      })

      it('should call getOrderSummary() update forms true if in delivery-payment', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: ['visited1', 'visited2'],
          location: {
            pathname: '/checkout/delivery-payment',
          },
        })
        expect(instance.props.getOrderSummary).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(instance.props.getOrderSummary).toHaveBeenCalledTimes(1)
        expect(instance.props.getOrderSummary).lastCalledWith({
          shouldUpdateBag: true,
          shouldUpdateForms: true,
        })
      })

      it('should call getAllPaymentMethods if mounted on the client', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: ['visited1', 'visited2'],
          location: {
            pathname: '/checkout/delivery-payment',
          },
        })
        expect(instance.props.getAllPaymentMethods).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(instance.props.getAllPaymentMethods).toHaveBeenCalledTimes(1)
      })

      it('should not call getAllPaymentMethods if mounted on the server', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: ['visited1'],
          location: {
            pathname: '/checkout/delivery-payment',
          },
        })
        instance.componentDidMount()
        expect(instance.props.getAllPaymentMethods).toHaveBeenCalledTimes(0)
      })

      it('handle isOutOfStockInCheckout', () => {
        const openMiniBag = jest.fn()
        const clearOutOfStockError = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          isOutOfStockInCheckout: true,
          openMiniBag,
          clearOutOfStockError,
          visited: ['visited1'],
          location: {
            pathname: '/checkout/delivery-payment',
          },
        })
        expect(browserHistory).toHaveLength(0)
        expect(openMiniBag).toHaveBeenCalledTimes(0)
        expect(clearOutOfStockError).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(browserHistory).toHaveLength(1)
        expect(browserHistory[0]).toBe('/')
        expect(openMiniBag).toHaveBeenCalledTimes(1)
        expect(clearOutOfStockError).toHaveBeenCalledTimes(1)
      })

      it('does not call orderSummary if on login page', () => {
        const { instance } = renderComponent({
          ...initialProps,
          visited: ['visited1', 'visited2'],
          location: {
            pathname: '/checkout/login',
          },
        })
        expect(instance.props.getOrderSummary).toHaveBeenCalledTimes(0)
        expect(instance.props.getAllPaymentMethods).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(instance.props.getOrderSummary).toHaveBeenCalledTimes(0)
        expect(instance.props.getAllPaymentMethods).toHaveBeenCalledTimes(1)
      })
    })

    describe('componentWillUnmount', () => {
      it('should set onpopstate to null', () => {
        const { wrapper } = renderComponent(initialProps)
        wrapper.unmount()
        expect(global.window.onpopstate).toBeNull()
      })
    })
  })
})
