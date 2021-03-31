import renderComponentHelper, {
  renderConnectedComponentProps,
} from 'test/unit/helpers/test-component'
import PaymentOptions from '../PaymentOptions'
import PaymentOptionByType from '../../PaymentOption/PaymentOptionByType'
import PaymentOptionEditable from '../../PaymentOption/PaymentOptionEditable'
import {
  resetFormPartial,
  setFormField,
} from '../../../../actions/common/formActions'
import {
  getMCDAvailablePaymentMethodTypes,
  getSelectedPaymentOptionType,
} from '../../../../selectors/paymentMethodSelectors'

jest.mock('../../../../actions/common/formActions')
jest.mock('../../../../selectors/paymentMethodSelectors')

const mockProps = {
  optionTypes: ['CARD', 'ACCNT'],
  selectedOptionType: 'ACCNT',
}

function renderComponent(props = mockProps) {
  const component = renderComponentHelper(
    PaymentOptions.WrappedComponent,
    {},
    { mockBrowserEventListening: false }
  )(props)

  return {
    ...component,
    paymentOption: component.wrapper.find(PaymentOptionByType),
  }
}

function MockEvent(target) {
  return { target }
}

describe('PaymentOptions', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('@render', () => {
    it('renders a list of PaymentOptionByType components', () => {
      expect(renderComponent().paymentOption).toHaveLength(2)
    })

    it('passes the `optionEditorProps` through to the payment option', () => {
      const optionEditorProps = { foo: 'foo...' }
      const props = { ...mockProps, optionEditorProps }
      const { paymentOption } = renderComponent(props)
      expect(paymentOption.at(0).prop('optionEditorProps')).toBe(
        optionEditorProps
      )
    })

    it('renders as selected, the option that has been selected', () => {
      const props = { ...mockProps, selectedOptionType: 'ACCNT' }
      const { paymentOption } = renderComponent(props)
      expect(paymentOption.at(0).prop('isChecked')).toBe(false)
      expect(paymentOption.at(1).prop('isChecked')).toBe(true)
    })

    describe('the PaymentOptionByType component', () => {
      it('render with appropriate props', () => {
        const props = { ...mockProps, optionEditorProps: { foo: 'foo' } }
        const { paymentOption } = renderComponent(props)
        const {
          type,
          isChecked,
          optionEditorProps,
          PaymentOption,
        } = paymentOption.at(0).props()

        expect(type).toBe('CARD')
        expect(isChecked).toBe(false)
        expect(PaymentOption).toBe(PaymentOptionEditable)
        expect(optionEditorProps).toBe(props.optionEditorProps)
      })
    })
  })

  describe('@events', () => {
    describe('on option type change', () => {
      const props = {
        ...mockProps,
        setFormField: jest.fn(),
        resetFormPartial: jest.fn(),
      }

      it('resets the billing card details form', () => {
        const { paymentOption } = renderComponent(props)
        paymentOption.at(0).prop('onChange')(MockEvent({ value: 'foo' }))
        expect(props.resetFormPartial).toHaveBeenCalledTimes(1)
        expect(props.resetFormPartial).toHaveBeenCalledWith(
          'paymentCardDetailsMCD',
          {
            cardNumber: '',
            expiryDate: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: '',
          }
        )
      })

      describe('when the option has been checked', () => {
        describe('when the card option is the option that changed in terms of selection', () => {
          it('sets the billing card details form type to `VISA`', () => {
            const { paymentOption } = renderComponent(props)
            paymentOption.at(0).prop('onChange')(
              MockEvent({ checked: true, value: 'CARD' })
            )
            expect(props.setFormField).toHaveBeenCalledTimes(1)
            expect(props.setFormField).toHaveBeenCalledWith(
              'paymentCardDetailsMCD',
              'paymentType',
              'VISA'
            )
          })
        })

        describe('when the card option is not the option that changed in terms of selection', () => {
          it('sets the billing card details form type to the option value', () => {
            const { paymentOption } = renderComponent(props)
            paymentOption.at(0).prop('onChange')(
              MockEvent({ checked: true, value: 'ACCNT' })
            )
            expect(props.setFormField).toHaveBeenCalledTimes(1)
            expect(props.setFormField).toHaveBeenCalledWith(
              'paymentCardDetailsMCD',
              'paymentType',
              'ACCNT'
            )
          })
        })
      })

      describe('when the option has not bee checked', () => {
        it('does not set the billing card details form type', () => {
          const { paymentOption } = renderComponent(props)
          paymentOption.at(0).prop('onChange')(
            MockEvent({ checked: false, value: 'ACCNT' })
          )
          expect(props.setFormField).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('@connection', () => {
    describe('mapping to props', () => {
      const optionTypes = ['1']
      const selectedOptionType = 'foo'

      beforeEach(() => {
        getMCDAvailablePaymentMethodTypes.mockReturnValue(optionTypes)
        getSelectedPaymentOptionType.mockReturnValue(selectedOptionType)
        setFormField.mockReturnValue({ type: 'foo' })
        resetFormPartial.mockReturnValue({ type: 'foo' })
      })

      describe('prop: optionTypes', () => {
        describe('when `ownProps.optionTypes` is defined', () => {
          it('maps to the `ownProps.optionTypes` value', () => {
            const props = { optionTypes: ['1', '2'], selectedOptionType: '1' }
            const { optionTypes } = renderConnectedComponentProps(
              PaymentOptions,
              {},
              props
            )
            expect(optionTypes).toBe(props.optionTypes)
          })
        })
        describe('when `ownProps.optionTypes` is undefined', () => {
          it('maps to the option types retrieved from the state', () => {
            const props = renderConnectedComponentProps(PaymentOptions)
            expect(props.optionTypes).toBe(optionTypes)
          })
        })
      })

      describe('prop: selectedOptionType', () => {
        describe('when `ownProps.selectedOptionType` is defined', () => {
          it('maps to the `ownProps.selectedOptionType` value', () => {
            const props = { optionTypes: ['1', '2'], selectedOptionType: '1' }
            const { selectedOptionType } = renderConnectedComponentProps(
              PaymentOptions,
              {},
              props
            )
            expect(selectedOptionType).toBe(props.selectedOptionType)
          })
        })
        describe('when `ownProps.selectedOptionType` is undefined', () => {
          it('maps to the option types retrieved from the state', () => {
            const props = renderConnectedComponentProps(PaymentOptions)
            expect(props.selectedOptionType).toBe(selectedOptionType)
          })
        })
      })

      describe('prop: setFormField', () => {
        it('maps to the `setFormField` action', () => {
          const props = renderConnectedComponentProps(PaymentOptions)
          props.setFormField('foo')
          expect(setFormField).toHaveBeenCalledTimes(1)
          expect(setFormField).toHaveBeenCalledWith('foo')
        })
      })

      describe('prop: resetFormPartial', () => {
        it('maps to the `resetFormPartial` action', () => {
          const props = renderConnectedComponentProps(PaymentOptions)
          props.resetFormPartial('foo')
          expect(resetFormPartial).toHaveBeenCalledTimes(1)
          expect(resetFormPartial).toHaveBeenCalledWith('foo')
        })
      })
    })
  })
})
