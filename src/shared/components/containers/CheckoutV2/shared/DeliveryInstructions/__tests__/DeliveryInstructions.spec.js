import testComponentHelper from 'test/unit/helpers/test-component'

import DeliveryInstructions from '../DeliveryInstructions'

describe('<DeliveryInstructions />', () => {
  const noop = () => {}
  const requiredProps = {
    setAndValidateFormField: noop,
    touchFormField: noop,
  }
  const renderComponent = testComponentHelper(DeliveryInstructions)

  describe('@renders', () => {
    it('should render default state', () => {
      expect(renderComponent(requiredProps).getTree()).toMatchSnapshot()
    })

    it('should pass `deliveryInstructions` error to `Input`', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        deliveryInstructionsError: 'Please remove all emoji characters',
      })
      const errors = wrapper
        .find({ name: 'deliveryInstructions' })
        .prop('errors')
      expect(errors).toEqual({
        deliveryInstructions: 'Please remove all emoji characters',
      })
    })

    it('should be able to set `maxDeliveryInstructionsCharacters`', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        maxDeliveryInstructionsCharacters: 60,
        deliveryInstructionsField: {
          value: 'Press the bell',
        },
      })
      expect(wrapper.find('.DeliveryInstructions-charsRemaining').text()).toBe(
        '14/60'
      )
    })

    it('should pass `deliveryInstructions` error to `Input`', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        deliveryInstructionsError: 'Please remove all emoji characters',
      })
      const errors = wrapper
        .find({ name: 'deliveryInstructions' })
        .prop('errors')
      expect(errors).toEqual({
        deliveryInstructions: 'Please remove all emoji characters',
      })
    })
  })

  describe('@events', () => {
    describe('Delivery Instructions', () => {
      it('should set and validate on field change', () => {
        const setAndValidateFormFieldMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          validationSchema: {
            deliveryInstructions: ['noEmoji'],
          },
          setAndValidateFormField: setAndValidateFormFieldMock,
        })
        const setField = wrapper
          .find({ name: 'deliveryInstructions' })
          .prop('setField')
        setField('deliveryInstructions')({
          target: { value: 'Leave round the back' },
        })
        expect(setAndValidateFormFieldMock).toHaveBeenCalledWith(
          'deliveryInstructions',
          'deliveryInstructions',
          'Leave round the back',
          ['noEmoji']
        )
      })

      it('should touch field on blur', () => {
        const touchFormFieldMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          touchFormField: touchFormFieldMock,
        })
        const touchedField = wrapper
          .find({ name: 'deliveryInstructions' })
          .prop('touchedField')
        touchedField('deliveryInstructions')()
        expect(touchFormFieldMock).toHaveBeenCalledWith(
          'deliveryInstructions',
          'deliveryInstructions'
        )
      })
    })
  })
})
