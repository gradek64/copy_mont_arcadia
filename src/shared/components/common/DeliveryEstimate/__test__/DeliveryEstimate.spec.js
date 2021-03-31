import helper from 'test/unit/helpers/test-component'
import DeliveryEstimate from '../DeliveryEstimate'
import { clone } from 'ramda'

describe('<DeliveryEstimate />', () => {
  const renderComponent = helper(DeliveryEstimate.WrappedComponent)
  const defaultProps = {
    shippingInfo: {
      label: 'UK Standard',
      deliveryType: 'HOME_STANDARD',
      shipModeId: 2345645,
      additionalDescription: 'UK Standard',
      estimatedDelivery: ['No later than Friday 27 January 2017'],
    },
    address: {
      title: 'Mr',
      firstName: null,
    },
    brandName: 'topshop',
    deliveryType: 'HOME',
    isGuestOrder: false,
  }

  const addressProps = {
    title: 'Mr',
    firstName: 'Steve',
    lastName: 'Smith',
    telephone: '0987654321',
    address1: '34 Crescent Road',
    city: 'LONDON',
    country: 'UK',
    postcode: 'N21 5RT',
  }

  const nominatedDelivery = {
    ...defaultProps.shippingInfo,
    nominatedDate: '2017-02-14',
    dayText: 'Tue',
    dateText: 'Feb',
    deliveryType: 'HOME_EXPRESS',
    estimatedDelivery: undefined,
  }

  const trackedAndFaster = {
    ...defaultProps.shippingInfo,
    deliveryType: 'HOME_EXPRESS',
  }

  describe('@renders', () => {
    it('in default state (HOME_STANDARD, no address)', () => {
      const component = renderComponent(defaultProps)
      expect(component.getTree()).toMatchSnapshot()
    })

    it('delivery address and shouldDisplayAddress passed (HOME_STANDARD)', () => {
      const props = {
        ...defaultProps,
        address: addressProps,
        shouldDisplayAddress: true,
      }
      const component = renderComponent(props)
      expect(component.getTree()).toMatchSnapshot()
    })

    it("in default state (HOME_EXPRESS 'Nominated Delivery', no address)", () => {
      const props = { ...clone(defaultProps), shippingInfo: nominatedDelivery }
      const component = renderComponent(props)
      expect(component.getTree()).toMatchSnapshot()
    })

    it("in default state (HOME_EXPRESS 'Tracked and Faster', no address)", () => {
      const props = { ...clone(defaultProps), shippingInfo: trackedAndFaster }
      const component = renderComponent(props)
      expect(component.getTree()).toMatchSnapshot()
    })

    it('in default state (HOME_STANDARD, no estimate)', () => {
      const props = clone(defaultProps)
      props.shippingInfo.estimatedDelivery = []
      const component = renderComponent(props)
      expect(component.getTree()).toMatchSnapshot()
    })

    it('in default state with modifier className', () => {
      const props = { ...clone(defaultProps), className: 'modifier' }
      const component = renderComponent(props)
      expect(component.getTree()).toMatchSnapshot()
    })

    it("delivery address and shouldDisplayAddress passed (HOME_EXPRESS 'Nominated Delivery')", () => {
      const props = {
        ...clone(defaultProps),
        shippingInfo: nominatedDelivery,
        address: addressProps,
        shouldDisplayAddress: true,
      }
      const component = renderComponent(props)
      expect(component.getTree()).toMatchSnapshot()
    })

    it("delivery address and shouldDisplayAddress passed (HOME_EXPRESS 'Tracked and Faster')", () => {
      const props = {
        ...clone(defaultProps),
        shippingInfo: trackedAndFaster,
        address: addressProps,
        shouldDisplayAddress: true,
      }
      const component = renderComponent(props)
      expect(component.getTree()).toMatchSnapshot()
    })

    it('when deliveryType is STORE and should display address', () => {
      const component = renderComponent({
        ...defaultProps,
        deliveryType: 'STORE',
        address: addressProps,
        shouldDisplayAddress: true,
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    it('when deliveryType is PARCELSHOP and should display address', () => {
      const component = renderComponent({
        ...defaultProps,
        deliveryType: 'PARCELSHOP',
        address: addressProps,
        shouldDisplayAddress: true,
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should display the delivery address with the link to the guest checkout delivery', () => {
      const props = {
        ...defaultProps,
        isGuestOrder: true,
        address: addressProps,
        shouldDisplayAddress: true,
      }
      const component = renderComponent(props)
      expect(component.getTree()).toMatchSnapshot()
    })
  })
})
