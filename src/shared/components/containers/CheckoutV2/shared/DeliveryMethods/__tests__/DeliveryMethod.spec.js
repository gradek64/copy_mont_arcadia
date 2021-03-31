import testComponentHelper from 'test/unit/helpers/test-component'

import DeliveryMethod from '../DeliveryMethod'

describe('<DeliveryMethod />', () => {
  const renderComponent = testComponentHelper(DeliveryMethod)

  describe('@render', () => {
    it('should render default state', () => {
      const component = renderComponent({
        deliveryType: 'HOME_STANDARD',
        enabled: true,
        label: 'UK Standard up to 4 days',
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should display a price of ‘free’ if `STORE_STANDARD`', () => {
      const component = renderComponent({
        deliveryType: 'STORE_STANDARD',
        label: 'Collect From Store Standard',
      })
      expect(component.wrapper.find('.DeliveryMethod-price').text()).toBe(
        'Free'
      )
    })

    it('should display the price if not `STORE_STANDARD`', () => {
      const component = renderComponent({
        deliveryType: 'HOME_STANDARD',
        label: 'UK Standard up to 4 days',
        cost: '4.00',
      })
      expect(component.wrapper.find('.DeliveryMethod-price').text()).toBe(
        '£4.00'
      )
    })

    it('should display a price of ‘free’ if not `STORE_STANDARD` and cost is an empty string', () => {
      const component = renderComponent({
        deliveryType: 'HOME_STANDARD',
        label: 'UK Standard up to 4 days',
        cost: '',
      })
      expect(component.wrapper.find('.DeliveryMethod-price').text()).toBe(
        'Free'
      )
    })

    it('should display the price if `STORE_EXPRESS`', () => {
      const component = renderComponent({
        deliveryType: 'STORE_EXPRESS',
        label: 'Collect From Store Express',
        cost: '3.00',
      })
      expect(component.wrapper.find('.DeliveryMethod-price').text()).toBe(
        '£3.00'
      )
    })

    it('should display a price of ‘free’ if `STORE_EXPRESS` cost is 0.00', () => {
      const component = renderComponent({
        deliveryType: 'STORE_EXPRESS',
        label: 'Collect From Store Express',
        cost: '0.00',
      })
      expect(component.wrapper.find('.DeliveryMethod-price').text()).toBe(
        'Free'
      )
    })

    it('should display deliveryText prop if `HOME_EXPRESS`', () => {
      const component = renderComponent({
        deliveryType: 'HOME_EXPRESS',
        label: 'UK Next day or Named delivery date',
        deliveryCountry: 'United Kingdom',
        deliveryText: 'Get it on Sunday 12 July',
        selected: false,
        deliveryOptions: [
          {
            nominatedDate: '2020-07-12',
            selected: true,
          },
        ],
      })
      expect(component.wrapper.find('.DeliveryMethod-description').text()).toBe(
        'Get it on Sunday 12 July'
      )
    })

    it('should display `Get it by Saturday 12th July` if `HOME_STANDARD` and UK', () => {
      const component = renderComponent({
        deliveryType: 'HOME_STANDARD',
        label: 'UK Standard up to 4 days',
        deliveryCountry: 'United Kingdom',
        deliveryText: 'Get it by Saturday 12th July',
      })
      expect(component.wrapper.find('.DeliveryMethod-description').text()).toBe(
        'Get it by Saturday 12th July'
      )
    })

    it('should display description', () => {
      const component = renderComponent({
        deliveryType: 'HOME_STANDARD',
        label: 'UK Standard up to 4 days',
        additionalDescription: 'Up to 4 days',
        deliveryCountry: 'United Kingdom',
      })

      expect(component.wrapper.find('.DeliveryMethod-description').text()).toBe(
        'Up to 4 days'
      )
    })

    it('should add the correct css modifier when "enabled" = false', () => {
      const component = renderComponent({
        deliveryType: 'HOME_STANDARD',
        label: 'UK Standard up to 4 days',
        additionalDescription: 'Up to 4 days',
        enabled: false,
      })
      expect(component.wrapper.find('.DeliveryMethod--disabled')).toHaveLength(
        1
      )
    })
  })

  describe('@events', () => {
    it('should call `onChange` on change if delivery is enabled', () => {
      const onChangeMock = jest.fn()
      const component = renderComponent({
        deliveryType: 'HOME_STANDARD',
        label: 'UK Standard up to 4 days',
        onChange: onChangeMock,
      })
      const button = component.wrapper.find('button')
      button.simulate('click')

      expect(onChangeMock).toHaveBeenCalled()
    })

    it('should not call `onChange` on change if deliver is disabled', () => {
      const onChangeMock = jest.fn()
      const component = renderComponent({
        deliveryType: 'HOME_STANDARD',
        label: 'UK Standard up to 4 days',
        enabled: false,
        onChange: onChangeMock,
      })
      const button = component.wrapper.find('button')
      button.simulate('click')

      expect(onChangeMock).not.toHaveBeenCalled()
    })
  })
})
