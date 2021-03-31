import { assocPath, clone } from 'ramda'
import testComponentHelper from 'test/unit/helpers/test-component'

import DeliveryOptions from '../DeliveryOptions'

const deliveryLocations = [
  {
    additionalDescription: 'Express or Nominated Delivery',
    collectionDay: null,
    deliveryLocationType: 'HOME',
    deliveryMethods: [],
    description: 'Standard Delivery (UK up to 4 working days)',
    enabled: true,
    iconUrl: '/assets/burton/images/lorry-icon.svg',
    label:
      'Home Delivery Standard Delivery (up to 4 days) Next Day or Named Day Delivery (UK) Worldwide Delivery (times and prices vary)',
    selected: false,
    title: 'Home Delivery',
  },
  {
    additionalDescription: 'Express Delivery (next day)',
    collectionDay: '',
    deliveryLocationType: 'STORE',
    deliveryMethods: [],
    description: 'Standard Delivery (3-7 working days)',
    enabled: true,
    iconUrl: '/assets/burton/images/cfs.svg',
    label:
      'Collect from Store Standard Delivery (2 to 7 working days) Next Day Delivery',
    selected: true,
    title: 'Collect from Store',
  },
  {
    additionalDescription: '',
    collectionDay: null,
    deliveryLocationType: 'PARCELSHOP',
    deliveryMethods: [],
    description: 'Thousands of local shops open early and late',
    enabled: true,
    iconUrl: '/assets/burton/images/hermes-icon.svg',
    label:
      'Collect from ParcelShop - UK only Thousands of local shops open early and late Next Day Delivery',
    selected: false,
    title: 'Collect from ParcelShop',
  },
]

const mockProps = {
  deliveryLocations,
  onChangeDeliveryLocation: jest.fn(),
}

describe('<DeliveryOptions />', () => {
  const renderComponent = testComponentHelper(DeliveryOptions)
  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(mockProps).getTree()).toMatchSnapshot()
    })

    it('Parcel Shop disabled', () => {
      const props = assocPath(
        ['deliveryLocations', 2, 'enabled'],
        false,
        clone(mockProps)
      )
      const component = renderComponent(props)
      const { wrapper } = component
      expect(component.getTree()).toMatchSnapshot()
      expect(
        wrapper
          .find('button')
          .at(2)
          .props().disabled
      ).toEqual(true)
    })
  })

  describe('@events', () => {
    it('change delivery Location home update orderSummary', () => {
      const component = renderComponent(mockProps)
      const { wrapper } = component
      wrapper
        .find('button')
        .first()
        .simulate('click')
      expect(mockProps.onChangeDeliveryLocation).toHaveBeenCalledTimes(1)
    })
  })
})
