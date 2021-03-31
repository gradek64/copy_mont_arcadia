import testComponentHelper from 'test/unit/helpers/test-component'

import CVVField from '../CVVField'

describe('<CVVField/>', () => {
  const renderComponent = testComponentHelper(CVVField)

  const baseProps = {
    field: {
      value: '123',
      isTouched: true,
    },
    setField: () => {},
    touchedField: () => {},
  }

  describe('@renders', () => {
    it('should render default state correctly', () => {
      const component = renderComponent(baseProps)
      expect(component.getTree()).toMatchSnapshot()
    })

    it('should show cvv errors if error is set', () => {
      const { wrapper } = renderComponent({
        ...baseProps,
        error: '3 digits required',
        isStoredCardExpired: false,
        savedPaymentType: { type: 'CARD' },
      })

      const input = wrapper.find('Connect(Input)')
      expect(input.prop('errors')).toEqual({
        cvv: '3 digits required',
      })
    })

    it('should show expired card message when card is expired', () => {
      const { wrapper } = renderComponent({
        ...baseProps,
        error: '3 digits required',
        isStoredCardExpired: true,
        storedPaymentDetails: {
          cardNumberStar: '1111',
        },
      })
      expect(wrapper.find('.CVVField-warningBox--cardExpired')).toHaveLength(1)
    })

    it('should not show enter CVV message when the payment type is not saved', () => {
      const { wrapper } = renderComponent({
        ...baseProps,
        error: '3 digits required',
        savedPaymentType: false,
        isStoredCardExpired: false,
      })
      expect(wrapper.find('.CVVField-warningBox')).toHaveLength(0)
    })

    it('should localise CVV label, placeholder and errors', () => {
      const { wrapper } = testComponentHelper(CVVField, {
        context: {
          l: (str) =>
            ({
              CVV: 'bileag',
              'CVV*': 'segnaposto',
              busted: 'kaput',
            }[str]),
        },
      })({
        ...baseProps,
        error: 'busted',
      })
      const input = wrapper.find('Connect(Input)')
      expect(input.prop('label')).toBe('bileag')
      expect(input.prop('placeholder')).toBe('segnaposto')
      expect(input.prop('errors')).toEqual({
        cvv: 'kaput',
      })
    })

    it('should add provided `className` to the element', () => {
      const { wrapper } = renderComponent({
        ...baseProps,
        className: 'test-class-name',
      })
      expect(wrapper.find('.CVVField.test-class-name')).toHaveLength(1)
    })

    describe('returning customer', () => {
      it('should render default state correctly', () => {
        const component = renderComponent(baseProps)
        expect(component.getTree()).toMatchSnapshot()
      })
      it('should show enter CVV warning when card is not expired and no value has been input', () => {
        const { wrapper } = renderComponent({
          ...baseProps,
          field: {
            value: '',
            isTouched: false,
          },
          error: '3 digits required',
          savedPaymentType: true,
          isStoredCardExpired: false,
        })
        expect(wrapper.find('.CVVField-warningBox')).toHaveLength(1)
      })

      it('should not show warning box and should show errors when CVV has erroneous value', () => {
        const { wrapper } = renderComponent({
          ...baseProps,
          field: {
            value: 'abc',
            isTouched: true,
          },
          error: '3 digits required',
          savedPaymentType: { type: 'CARD' },
        })
        const input = wrapper.find('Connect(Input)')
        expect(wrapper.find('.CVVField-warningBox')).toHaveLength(0)
        expect(wrapper.find('Connect(Input)').prop('className')).toContain(
          'CVVField-cvv--warning'
        )
        expect(wrapper.find('Connect(Input)').prop('className')).toContain(
          'CVVField-cvv--icon'
        )

        expect(input.prop('errors')).toEqual({ cvv: '3 digits required' })
      })
    })
  })
})
