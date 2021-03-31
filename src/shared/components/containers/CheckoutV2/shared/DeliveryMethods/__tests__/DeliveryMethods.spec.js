import testComponentHelper, {
  withStore,
  buildComponentRender,
  mountRender,
} from 'test/unit/helpers/test-component'
import { compose } from 'ramda'

import CheckoutPrimaryTitle from '../../../shared/CheckoutPrimaryTitle'
import CheckoutSubPrimaryTitle from '../../../shared/CheckoutSubPrimaryTitle'

import DeliveryMethods from '../DeliveryMethods'

const deliveryMethods = [
  {
    shipModeId: 26504,
    deliveryType: 'HOME_STANDARD',
    label: 'Standard UK Delivery',
    additionalDescription: 'Up to 5 working days',
    selected: true,
    deliveryOptions: [],
    enabled: true,
    cost: '0.00',
    estimatedDeliveryDate: 'Wednesday 22 April 2020',
    shipCode: 'S',
  },
]
const defaultProps = {
  deliveryMethods,
  brandName: 'topshop',
  isDDPActiveBannerEnabled: true,
  ddpDefaultName: 'DDP VIP Subscription',
  getDDPDefaultSku: {
    sku: '100000012',
    default: true,
    unitPrice: 9.95,
    catentryId: '32917654',
    name: 'Topshop Premier',
    description: 'Topshop Unlimited',
    timePeriod: '12',
  },
  onDeliveryMethodChange: jest.fn(),
  onDeliveryOptionsChange: jest.fn(),
  selectedDeliveryOptionFromBasket: {
    plainLabel: 'Named or Next Day Delivery',
    shippingCost: 3.95,
  },
  deliveryCountry: 'United Kingdom',
  savedAddresses: [{}],
  isCollection: false,
}

describe('<DeliveryMethods /> Shallow', () => {
  global.window.scrollTo = jest.fn()
  const renderComponent = testComponentHelper(DeliveryMethods)
  const mountComponent = buildComponentRender(
    compose(
      mountRender,
      withStore({
        config: {
          brandName: 'Topshop',
          brandCode: 'tsuk',
        },
      })
    ),
    DeliveryMethods
  )

  const createDeliveryMethods = ({
    selectedDeliveryMethod = 'HOME_STANDARD',
    selectedDeliveryMethodEnabled = true,
  } = {}) => {
    return [
      {
        deliveryType: 'HOME_STANDARD',
        selected: selectedDeliveryMethod === 'HOME_STANDARD',
        enabled: true,
        cost: '4.00',
        label: 'UK Standard up to 4 days',
        additionalDescription: 'Get it by Saturday 12th July',
        deliveryOptions: [],
      },
      {
        deliveryType: 'HOME_EXPRESS',
        selected: selectedDeliveryMethod === 'HOME_EXPRESS',
        enabled: selectedDeliveryMethodEnabled === true,
        label: 'Express / Nominated day delivery',
        additionalDescription: '',
        deliveryOptions: [
          {
            shipModeId: 28005,
            dayText: 'Thu',
            dateText: '07 Sep',
            price: '6.00',
            enabled: true,
            selected: true,
            nominatedDate: '2020-09-07',
          },
          {
            shipModeId: 28006,
            dayText: 'Fri',
            dateText: '08 Sep',
            price: '6.00',
            enabled: false,
            selected: false,
            nominatedDate: '2020-09-08',
          },
        ],
      },
    ]
  }

  describe('@render', () => {
    it('should render default state', () => {
      const component = renderComponent(defaultProps)
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should render delivery methods', () => {
      const component = renderComponent({
        ...defaultProps,
        deliveryMethods: createDeliveryMethods(),
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should render delivery options when `HOME_EXPRESS` delivery type is selected', () => {
      const component = renderComponent({
        ...defaultProps,
        deliveryMethods: createDeliveryMethods({
          selectedDeliveryMethod: 'HOME_EXPRESS',
        }),
      })
      const deliveryOptions = component.wrapper.find('DeliveryOptions')
      expect(deliveryOptions.length).toBe(1)
      expect(deliveryOptions.prop('deliveryType')).toBe('HOME_EXPRESS')
      expect(deliveryOptions.prop('deliveryOptions')).toEqual([
        {
          shipModeId: 28005,
          dayText: 'Thu',
          dateText: '07 Sep',
          price: '6.00',
          enabled: true,
          selected: true,
          nominatedDate: '2020-09-07',
        },
      ])
    })

    it('should not render delivery options when `HOME_EXPRESS` delivery type is not enabled', () => {
      const component = renderComponent({
        ...defaultProps,
        deliveryMethods: createDeliveryMethods({
          selectedDeliveryMethod: 'HOME_EXPRESS',
          selectedDeliveryMethodEnabled: false,
        }),
      })
      expect(component.wrapper.find('DeliveryOptions').exists()).toEqual(false)
    })

    it('should render the ActiveDDPBanner if the isDDPActiveBannerEnabled flag is enabled', () => {
      const props = {
        ...defaultProps,
        deliveryMethods: createDeliveryMethods(),
        isDDPActiveBannerEnabled: true,
      }
      const component = renderComponent(props)
      const msgComponent = component.wrapper.find('ActiveDDPBanner')
      expect(msgComponent.exists()).toBe(true)
    })

    it('should not render the ActiveDDPBanner if the isDDPActiveBannerEnabled flag is disabled', () => {
      const props = {
        ...defaultProps,
        deliveryMethods: createDeliveryMethods(),
        isDDPActiveBannerEnabled: false,
      }
      const component = renderComponent(props)
      const msgComponent = component.wrapper.find('ActiveDDPBanner')
      expect(msgComponent.exists()).toBe(false)
    })

    it('should not render the DDPRenewal Component', () => {
      const { wrapper } = renderComponent(defaultProps)
      const ddpRenewal = wrapper.find('Connect(DDPRenewal)')
      expect(ddpRenewal.exists()).toBe(false)
    })

    it('should render CheckoutPrimaryTitle with the correct texts if isCollection set to false', () => {
      const { wrapper } = mountComponent({
        ...defaultProps,
      })

      expect(wrapper.find(CheckoutPrimaryTitle).exists()).toBe(true)
      expect(wrapper.find(CheckoutPrimaryTitle).text()).toBe('Delivery Type')
    })

    it('should render CheckoutPrimaryTitle with the correct texts if isCollection set to true', () => {
      const { wrapper } = mountComponent({
        ...defaultProps,
        isCollection: true,
      })

      expect(wrapper.find(CheckoutPrimaryTitle).exists()).toBe(true)
      expect(wrapper.find(CheckoutPrimaryTitle).text()).toBe('Collection Type')
    })

    it('should display `DDP applied to order` message if DDP product in bag', () => {
      const props = {
        ...defaultProps,
        isDDPOrder: true,
        showDDPPromo: true,
        savedAddresses: [],
      }
      const { wrapper } = renderComponent(props)
      const ddpApplied = wrapper.find('DDPAppliedToOrderMsg')
      expect(ddpApplied.exists()).toBe(true)
    })

    it('should not display `DDP applied to order` message if no DDP product in bag', () => {
      const props = {
        ...defaultProps,
        isDDPOrder: false,
        showDDPPromo: true,
        savedAddresses: [],
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find('DDPAppliedToOrderMsg').exists()).toBe(false)
    })

    it('should render CheckoutSubPrimaryTitle with the correct texts if deliveryCountry is UK', () => {
      const { wrapper } = mountComponent({
        ...defaultProps,
        deliveryCountry: 'Italy',
      })

      expect(wrapper.find(CheckoutSubPrimaryTitle).exists()).toBe(true)
      expect(wrapper.find(CheckoutSubPrimaryTitle).text()).toMatch(
        /Named or Next Day Delivery - £3.95/
      )
      expect(wrapper.find(CheckoutSubPrimaryTitle).text()).toMatch(
        /Up to 5 working days/
      )
    })

    it('should render CheckoutSubPrimaryTitle with the correct texts if deliveryCountry is not UK', () => {
      const { wrapper } = mountComponent(defaultProps)

      expect(wrapper.find(CheckoutSubPrimaryTitle).exists()).toBe(true)
      expect(wrapper.find(CheckoutSubPrimaryTitle).text()).toMatch(
        /Named or Next Day Delivery - £3.95/
      )
      expect(wrapper.find(CheckoutSubPrimaryTitle).text()).toMatch(
        /Get it by Wednesday 22 April/
      )
    })

    it('should display `Get it on Monday 7 September` if `HOME_EXPRESS` and UK', () => {
      const { wrapper } = mountComponent({
        ...defaultProps,
        deliveryMethods: createDeliveryMethods({
          selectedDeliveryMethod: 'HOME_EXPRESS',
        }),
      })

      expect(
        wrapper
          .find('.DeliveryMethod-selected .DeliveryMethod-description')
          .text()
      ).toBe('Get it on Monday 7 September')
    })

    it('should display `Get it by Saturday 12th July` if `HOME_STANDARD` and UK', () => {
      const { wrapper } = mountComponent({
        ...defaultProps,
        deliveryMethods: createDeliveryMethods({
          selectedDeliveryMethod: 'HOME_STANDARD',
        }),
      })

      expect(
        wrapper
          .find('.DeliveryMethod-selected .DeliveryMethod-description')
          .text()
      ).toBe('Get it by Saturday 12th July')
    })
  })

  describe('@actions', () => {
    it('should fire `onDeliveryMethodChange`, with index, on delivery method change', () => {
      const onDeliveryMethodChangeMock = jest.fn()
      const props = {
        ...defaultProps,
        deliveryMethods: createDeliveryMethods(),
        onDeliveryMethodChange: onDeliveryMethodChangeMock,
      }
      const component = renderComponent(props)
      component.wrapper.find('DeliveryMethod').forEach((deliveryMethod, i) => {
        deliveryMethod.prop('onChange')()
        expect(onDeliveryMethodChangeMock).toHaveBeenLastCalledWith(i)
      })
    })

    it('should fire `onDeliveryOptionsChange`, bound with `HOME_EXPRESS` argument, on delivery option change', () => {
      const onDeliveryOptionsChangeMock = jest.fn()
      const props = {
        ...defaultProps,
        deliveryMethods: createDeliveryMethods({
          selectedDeliveryMethod: 'HOME_EXPRESS',
        }),
        onDeliveryOptionsChange: onDeliveryOptionsChangeMock,
      }
      const component = renderComponent(props)
      const event = { type: 'event' }
      component.wrapper.find('DeliveryOptions').prop('onChange')(event)
      expect(onDeliveryOptionsChangeMock).toHaveBeenCalledWith(
        'HOME_EXPRESS',
        event
      )
    })

    it('should display DDP accordion if DDP purchase is available', () => {
      const props = {
        ...defaultProps,
        isDDPEnabled: true,
        isDDPPromoEnabled: true,
        showDDPPromo: true,
        isGuestOrder: false,
        savedAddresses: [],
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find('Connect(DigitalDeliveryPass)').length).toBe(1)
    })

    it('should not display DDP accordion if a guest order', () => {
      const props = {
        ...defaultProps,
        isDDPEnabled: true,
        isDDPPromoEnabled: true,
        showDDPPromo: true,
        isGuestOrder: true,
        savedAddresses: [],
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find('Connect(DigitalDeliveryPass)').length).toBe(0)
    })

    it('should not display DDP accordion if DDP purchase is not available', () => {
      const props = {
        ...defaultProps,
        isDDPEnabled: true,
        isDDPPromoEnabled: false,
        showDDPPromo: true,
        isGuestOrder: false,
        savedAddresses: [],
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find('Connect(DigitalDeliveryPass)').exists()).toEqual(false)
    })
  })
})
