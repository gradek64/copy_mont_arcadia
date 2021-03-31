import React from 'react'
import Connected, { WrappedPaymentOptionByType } from '../PaymentOptionByType'
import { getPaymentOptionByType } from '../../../../selectors/paymentMethodSelectors'
import renderComponentHelper, {
  renderConnectedComponentProps,
} from 'test/unit/helpers/test-component'
import PaymentOption from '../PaymentOption'

jest.mock('../../../../selectors/paymentMethodSelectors')

const PaymentOptionStub = () => <div>payment option...</div>

const initialProps = {
  type: 'CARD',
  value: 'VISA',
  isChecked: false,
  onChange: jest.fn(),
  PaymentOption: PaymentOptionStub,
}

function render(props = initialProps) {
  const component = renderComponentHelper(
    WrappedPaymentOptionByType,
    {},
    { mockBrowserEventListening: false }
  )(props)
  return {
    ...component,
    PaymentOptionStub: component.wrapper.find(PaymentOptionStub),
  }
}

describe('PaymentOptionByType', () => {
  describe('@render', () => {
    it('renders a PaymentOption component', () => {
      expect(render().PaymentOptionStub).toHaveLength(1)
    })
    it('renders null when value is not defined', () => {
      const { wrapper } = render({ ...initialProps, value: undefined })
      expect(wrapper.isEmptyRender()).toBe(true)
    })
  })

  describe('@connected', () => {
    it('wraps the PaymentOptionByType component', () => {
      expect(Connected.WrappedComponent).toBe(WrappedPaymentOptionByType)
    })

    describe('mapping to props', () => {
      it('maps correctly', () => {
        const props = {
          type: 'CARD',
          isChecked: false,
          onChange: jest.fn(),
        }
        const option = {
          type: 'CARD',
          label: 'Visa',
          value: 'VISA',
          isMobile: false,
          description: 'Visa',
          icons: [],
        }

        getPaymentOptionByType.mockReturnValue(option)

        const p = renderConnectedComponentProps(Connected, {}, props)

        delete p.dispatch

        const expectedProps = {
          ...props,
          ...option,
          PaymentOption,
        }

        expect(p).toEqual(expectedProps)
      })
    })
  })
})
