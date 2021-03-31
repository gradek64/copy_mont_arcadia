import testComponentHelper from 'test/unit/helpers/test-component'

import DeliveryOptions from '../DeliveryOptions'

describe('<DeliveryOptions />', () => {
  const renderComponent = testComponentHelper(DeliveryOptions)

  const createDeliveryOptions = ({ selectedShipModeId } = {}) => [
    {
      shipModeId: 28005,
      dayText: 'Thu',
      dateText: '07 Sep',
      price: '6.00',
      selected: selectedShipModeId === 28005,
    },
    {
      shipModeId: 28006,
      dayText: 'Fri',
      dateText: '08 Sep',
      price: '6.00',
      selected: selectedShipModeId === 28006,
    },
  ]

  describe('@render', () => {
    it('should render default state', () => {
      const component = renderComponent({
        deliveryType: 'HOME_STANDARD',
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should pass options to date select buttons', () => {
      const component = renderComponent({
        deliveryType: 'HOME_STANDARD',
        deliveryOptions: createDeliveryOptions({ selectedShipModeId: 28005 }),
      })
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should pass value to first button as option selected', () => {
      const component = renderComponent({
        deliveryType: 'HOME_STANDARD',
        deliveryOptions: createDeliveryOptions({ selectedShipModeId: 28005 }),
        className: 'DeliveryOptionsSelect',
      })
      expect(component.wrapper.find('.DeliveryOptionsSelect-dateButton--selected').prop('value')).toBe(28005)
    })

    it('should handle Free Deliver', () => {
      const createDelivOptions = createDeliveryOptions()
      const component = renderComponent({
        deliveryType: 'HOME_STANDARD',
        deliveryCost: '0.00',
        deliveryOptions: createDelivOptions.map((option) => ({
          ...option,
          price: '0.00',
        })),
      })
      component.wrapper
        .find('button')
        .forEach((button, index) => {
          const propOption = component.wrapper.props().deliveryOptions
          expect(button.props().value).toBe(propOption[index].shipModeId)
          expect(propOption[index].price).toBe('0.00')
        })
    })
  })

  describe('@events', () => {
    it('should call `onChange` with target‘s value on change and call onAccordionToggle', () => {
      const onChangeMock = jest.fn()
      const onAccordionToggleMock = jest.fn()
      const component = renderComponent({
        deliveryType: 'HOME_STANDARD',
        deliveryOptions: createDeliveryOptions(),
        onChange: onChangeMock,
        onAccordionToggle: onAccordionToggleMock,
      })
      component.wrapper.find('button').first().prop('onClick')({
        target: { value: '28005' },
      })
      expect(onChangeMock).toHaveBeenCalledWith('28005')
      expect(onAccordionToggleMock).toHaveBeenCalled()
    })
  })
})
