import { clone } from 'ramda'

import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'
import { orderSummaryHomeOnly } from 'test/mocks/orderSummary-home-delivery-only'
import { expressDeliveryOrderSummary } from '../../Summary/__tests__/OrderSummary-express-delivery-data'

import { getEnrichedDeliveryLocations } from '../../../../../selectors/checkoutSelectors'

import DeliveryOptionsContainer from '../../shared/DeliveryOptionsContainer'
import DeliveryContainer from '../DeliveryContainer'

describe('<DeliveryContainer />', () => {
  const noop = () => {}
  global.scrollTo = jest.fn()
  const requiredProps = {
    brandName: 'topshop',
    selectDeliveryLocation: noop,
    showModal: noop,
    openMiniBag: noop,
    getShippingCountry: 'United Kingdom',
    setDeliveryAsBilling: noop,
    setDeliveryAsBillingFlag: noop,
    touchedMultipleFormFields: noop,
    copyDeliveryValuesToBillingForms: noop,
    validateForms: noop,
    ddpDefaultName: 'Topshop Unlimited',
    sendEvent: jest.fn(),
  }
  const expressHomeDeliveryLocations = getEnrichedDeliveryLocations({
    checkout: {
      orderSummary: {
        deliveryLocations: expressDeliveryOrderSummary.deliveryLocations,
      },
    },
    features: {
      status: {
        FEATURE_CFS: true,
      },
    },
  })
  const homeDeliveryLocations = getEnrichedDeliveryLocations({
    checkout: {
      orderSummary: {
        deliveryLocations: orderSummaryHomeOnly.deliveryLocations,
      },
    },
  })
  const renderComponent = testComponentHelper(
    DeliveryContainer.WrappedComponent.WrappedComponent,
    { disableLifecycleMethods: false }
  )

  describe('@renders', () => {
    it('Home Delivery', () => {
      const { getTree } = renderComponent({
        ...requiredProps,
        deliveryLocations: expressHomeDeliveryLocations,
        shippingCountry: 'United Kingdom',
        totalCost: 87.0,
        isHomeDeliverySelected: true,
        hasOrderSummary: true,
        isMobile: true,
      })
      expect(getTree()).toMatchSnapshot()
    })

    describe('Qubit Delivery country field', () => {
      it('should find wrapped', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          hasOrderSummary: true,
        })
        const qubitWrapper = wrapper.find('#qubit-show-delivery-country')
        expect(qubitWrapper.exists()).toBeTruthy()
      })
    })

    it('Home Delivery without StoreDelivery options', () => {
      const { getTree } = renderComponent({
        ...requiredProps,
        deliveryLocations: homeDeliveryLocations,
        shippingCountry: 'United Kingdom',
        totalCost: 87.0,
        isHomeDeliverySelected: true,
        hasOrderSummary: true,
        isMobile: true,
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('Store Delivery', () => {
      const storeDeliveryLocations = clone(expressHomeDeliveryLocations)
      storeDeliveryLocations[0].selected = false
      storeDeliveryLocations[1].selected = true
      const { getTree } = renderComponent({
        ...requiredProps,
        deliveryLocations: storeDeliveryLocations,
        shippingCountry: 'United Kingdom',
        totalCost: 81.0,
        isHomeDeliverySelected: false,
        hasOrderSummary: true,
        isMobile: true,
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('Empty orderSummary should return null', () => {
      const { getTree } = renderComponent(requiredProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should not display DeliveryOptionsContainer if isDDPStandaloneOrder', () => {
      const props = {
        ...requiredProps,
        isDDPStandaloneOrder: true,
        hasOrderSummary: true,
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(DeliveryOptionsContainer).exists()).toBe(false)
    })

    it('should not display TotalCost component in desktop or tablet viweports', () => {
      const props = {
        ...requiredProps,
        hasOrderSummary: true,
        totalCost: 10,
        isMobile: true,
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find('TotalCost').exists()).toBe(true)
    })

    describe('Espots', () => {
      it('should render the Order Summary Espot', () => {
        const props = {
          ...requiredProps,
          hasOrderSummary: true,
          totalCost: 10,
        }
        const { wrapper } = renderComponent(props)
        expect(wrapper.find('OrderSummaryEspot').exists()).toBe(true)
      })
    })
  })

  describe('@decorators', () => {
    analyticsDecoratorHelper(DeliveryContainer, 'delivery-details', {
      componentName: 'DeliveryContainer',
      isAsync: true,
      redux: true,
    })
  })

  describe('@lifecycle', () => {
    describe('DDP has been added to bag and was NOT in bag before', () => {
      it('it should call validateDDPForCountry with shipping country', () => {
        const { wrapper, instance } = renderComponent({
          ...requiredProps,
          isDDPOrder: false,
          shippingCountry: 'Poland',
          validateDDPForCountry: jest.fn(),
        })
        wrapper.setProps({ isDDPOrder: true })
        expect(instance.props.validateDDPForCountry).toHaveBeenCalledWith(
          'Poland'
        )
      })
    })
  })

  describe('@events', () => {
    describe('On change delivery option', () => {
      it('it should select the delivery location for home', () => {
        const selectDeliveryLocationMock = jest.fn()
        const setDeliveryAsBillingMock = jest.fn()
        const setDeliveryAsBillingFlagMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          deliveryLocations: expressHomeDeliveryLocations,
          hasOrderSummary: true,
          selectDeliveryLocation: selectDeliveryLocationMock,
          setDeliveryAsBilling: setDeliveryAsBillingMock,
          setDeliveryAsBillingFlag: setDeliveryAsBillingFlagMock,
        })
        wrapper.find(DeliveryOptionsContainer).prop('onChangeDeliveryLocation')(
          { deliveryLocationType: 'HOME' }
        )
        expect(selectDeliveryLocationMock).toHaveBeenCalledWith({
          deliveryLocationType: 'HOME',
        })
        expect(setDeliveryAsBillingMock).toHaveBeenCalledWith(true)
        expect(setDeliveryAsBillingFlagMock).toHaveBeenCalledWith(true)
      })

      it('it should select the delivery location for store', () => {
        const selectDeliveryLocationMock = jest.fn()
        const setDeliveryAsBillingMock = jest.fn()
        const setDeliveryAsBillingFlagMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          deliveryLocations: expressHomeDeliveryLocations,
          hasOrderSummary: true,
          selectDeliveryLocation: selectDeliveryLocationMock,
          setDeliveryAsBilling: setDeliveryAsBillingMock,
          setDeliveryAsBillingFlag: setDeliveryAsBillingFlagMock,
        })
        wrapper.find(DeliveryOptionsContainer).prop('onChangeDeliveryLocation')(
          { deliveryLocationType: 'STORE' }
        )
        expect(selectDeliveryLocationMock).toHaveBeenCalledWith({
          deliveryLocationType: 'STORE',
        })
        expect(setDeliveryAsBillingMock).toHaveBeenCalledWith(false)
        expect(setDeliveryAsBillingFlagMock).toHaveBeenCalledWith(true)
      })

      it('should not open the collect from store modal if not home delivery and not mobile and shouldShowCollectFromStore = false', () => {
        const showModalMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          deliveryLocations: expressHomeDeliveryLocations,
          hasOrderSummary: true,
          showModal: showModalMock,
          shouldShowCollectFromStore: false,
        })
        wrapper.find(DeliveryOptionsContainer).prop('onChangeDeliveryLocation')(
          { deliveryLocationType: 'STORE' },
          2
        )
        expect(showModalMock).toHaveBeenCalledTimes(0)
      })
    })
  })
})
