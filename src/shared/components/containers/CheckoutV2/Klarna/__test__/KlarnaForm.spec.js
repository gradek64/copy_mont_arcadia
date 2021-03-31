import React from 'react'
import { shallow } from 'enzyme'
import configureStore from 'redux-mock-store'
import testComponentHelper from 'test/unit/helpers/test-component'
import KlarnaForm from '../KlarnaForm'

import { hasOrderBeenUpdated } from '../../../../../lib/checkout-utilities/klarna-utils'

jest.mock('../../../../../lib/checkout-utilities/klarna-utils', () => ({
  hasOrderBeenUpdated: jest.fn(),
  hasDeliveryOptionsBeenUpdated: jest.fn(),
}))

describe('<KlarnaForm />', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  const renderComponent = testComponentHelper(KlarnaForm.WrappedComponent)

  const deliveryOptions = [
    {
      selected: false,
      deliveryOptionId: 45020,
      deliveryOptionExternalId: 'retail_store_express',
      label: 'Collect From Store Express £3.00',
      enabled: true,
      plainLabel: 'Collect From Store Express',
    },
    {
      selected: true,
      deliveryOptionId: 47524,
      deliveryOptionExternalId: 'retail_store_collection',
      label: 'Collect from ParcelShop £4.00',
      enabled: true,
      plainLabel: 'Collect from ParcelShop',
    },
  ]

  const initialProps = {
    deliveryOptions,
    isKlarnaUpdateBlocked: false,
    isKlarnaPaymentBlocked: false,
    isModalOpen: false,
    shouldInitialiseKlarnaSession: true,
    orderId: 1566239,
    total: '100',
    isCountrySupportedByKlarna: true,
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })

  describe('Connected component', () => {
    it('should render connected component correctly', () => {
      const initialState = {
        config: {},
        klarna: {
          clientToken: '',
          paymentMethodCategories: [],
          isKlarnaPaymentBlocked: false,
          isKlarnaUpdateBlocked: false,
        },
        forms: { checkout: {}, klarna: {} },
        account: { user: {} },
        shoppingBag: {
          bag: {
            orderId: 1566239,
            deliveryOptions,
            total: '100',
          },
        },
        checkout: {
          orderSummary: {
            basket: {
              total: '100',
              deliveryOptions,
            },
          },
        },
        modal: {
          open: false,
        },
        paymentMethods: [
          {
            value: 'KLRNA',
            deliveryCountry: [],
            billingCountry: [],
          },
        ],
      }
      const container = shallow(
        <KlarnaForm store={configureStore()(initialState)} />
      )
      expect(container).toBeTruthy()
    })
  })

  describe('@lifecycle', () => {
    describe('componentDidMount', () => {
      it('should create a Klarna session', () => {
        const { instance } = renderComponent({
          ...initialProps,
          blockKlarnaUpdate: jest.fn(),
          createKlarnaSession: jest.fn(),
        })
        instance.componentDidMount()
        expect(instance.props.blockKlarnaUpdate).toHaveBeenCalledTimes(1)
        expect(instance.props.blockKlarnaUpdate).toHaveBeenCalledWith(true)
        expect(instance.props.createKlarnaSession).toHaveBeenCalledTimes(1)
        expect(instance.props.createKlarnaSession).toHaveBeenCalledWith({
          orderId: initialProps.orderId,
        })
      })

      it('should update a Klarna session', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isShoppingBagUpdated: true,
          shouldInitialiseKlarnaSession: false,
          blockKlarnaUpdate: jest.fn(),
          updateKlarnaSession: jest.fn(),
        })
        instance.componentDidMount()
        expect(instance.props.blockKlarnaUpdate).toHaveBeenCalledTimes(1)
        expect(instance.props.blockKlarnaUpdate).toHaveBeenCalledWith(true)
        expect(instance.props.updateKlarnaSession).toHaveBeenCalledTimes(1)
        expect(instance.props.updateKlarnaSession).toHaveBeenCalledWith(true)
      })
    })

    describe('shouldComponentUpdate', () => {
      it('should not update if "blockKlarnaUpdate" is true', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isKlarnaUpdateBlocked: true,
          updateKlarnaSession: jest.fn(),
        })
        instance.shouldComponentUpdate({ ...initialProps, total: '10' })
        expect(instance.props.updateKlarnaSession).toHaveBeenCalledTimes(0)
      })
      it('should not update if a modal is open', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isModalOpen: true,
          updateKlarnaSession: jest.fn(),
        })
        instance.shouldComponentUpdate({ ...initialProps, total: '10' })
        expect(instance.props.updateKlarnaSession).toHaveBeenCalledTimes(0)
      })
      it('should not update if total change is 0', () => {
        const { instance } = renderComponent({
          ...initialProps,
          total: '0',
          updateKlarnaSession: jest.fn(),
        })
        const prevProps = {
          ...initialProps,
          total: '100',
        }
        instance.shouldComponentUpdate(prevProps)
        expect(instance.props.updateKlarnaSession).toHaveBeenCalledTimes(0)
      })
      it('should not update if klarnaPaymentCountrySupported updates to false', () => {
        const { instance } = renderComponent({
          ...initialProps,
          klarnaPaymentCountrySupported: true,
          updateKlarnaSession: jest.fn(),
        })
        const prevProps = {
          ...initialProps,
          klarnaPaymentCountrySupported: false,
        }
        instance.shouldComponentUpdate(prevProps)
        expect(instance.props.updateKlarnaSession).toHaveBeenCalledTimes(0)
      })
      it('should not update if deliveryOptions have not updated', () => {
        const { instance } = renderComponent({
          ...initialProps,
          updateKlarnaSession: jest.fn(),
        })
        const prevProps = {
          ...initialProps,
        }
        instance.shouldComponentUpdate(prevProps)
        expect(instance.props.updateKlarnaSession).toHaveBeenCalledTimes(0)
      })
      it('should update if total has changed', () => {
        hasOrderBeenUpdated.mockReturnValueOnce(true)
        const { instance } = renderComponent({
          ...initialProps,
          updateKlarnaSession: jest.fn(),
        })
        const prevProps = {
          ...initialProps,
          total: '500',
        }
        instance.shouldComponentUpdate(prevProps)
        expect(instance.props.updateKlarnaSession).toHaveBeenCalledTimes(1)
      })

      it('should update if deliveryOptions has changed', () => {
        hasOrderBeenUpdated.mockReturnValueOnce(true)
        const updateDeliveryOptions = [...deliveryOptions]
        updateDeliveryOptions[0].selected = true
        updateDeliveryOptions[1].selected = false
        const { instance } = renderComponent({
          ...initialProps,
          updateKlarnaSession: jest.fn(),
        })
        const prevProps = {
          ...initialProps,
          deliveryOptions: updateDeliveryOptions,
        }
        instance.shouldComponentUpdate(prevProps)
        expect(instance.props.updateKlarnaSession).toHaveBeenCalledTimes(1)
        expect(instance.props.updateKlarnaSession).toHaveBeenCalled()
      })
    })

    describe('componentWillUnmount', () => {
      it('should call "blockKlarnaUpdate" action', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isKlarnaUpdateBlocked: true,
          blockKlarnaUpdate: jest.fn(),
        })
        instance.componentWillUnmount()
        expect(instance.props.blockKlarnaUpdate).toHaveBeenCalled()
        expect(instance.props.blockKlarnaUpdate).toHaveBeenCalledWith(false)
      })
      it('should call "blockKlarnaPayment" action', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isKlarnaPaymentBlocked: true,
          blockKlarnaPayment: jest.fn(),
        })
        instance.componentWillUnmount()
        expect(instance.props.blockKlarnaPayment).toHaveBeenCalled()
        expect(instance.props.blockKlarnaPayment).toHaveBeenCalledWith(false)
      })
    })
  })
})
