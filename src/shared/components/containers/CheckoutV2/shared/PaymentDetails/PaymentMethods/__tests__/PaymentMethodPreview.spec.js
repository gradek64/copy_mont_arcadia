import React from 'react'
import { mount } from 'enzyme'
import PropTypes from 'prop-types'
import buildStore from 'test/unit/build-store'

import testComponentHelper from 'test/unit/helpers/test-component'

import PaymentMethodPreview from '../PaymentMethodPreview'
import KlarnaForm from '../../../../Klarna/KlarnaForm'
import ConfirmCVV from '../../ConfirmCVV'

describe('<PaymentMethodPreview />', () => {
  const renderComponent = testComponentHelper(PaymentMethodPreview)

  const requiredProps = {
    children: <div>child element</div>,
  }

  describe('@componentDidMount', () => {
    it('should dispatch `closePaymentMethods`', () => {
      const closePaymentMethodsMock = jest.fn()
      const { instance } = renderComponent({
        ...requiredProps,
        closePaymentMethods: closePaymentMethodsMock,
      })
      instance.componentDidMount()
      expect(closePaymentMethodsMock).toBeCalled()
    })
  })

  describe('@renders', () => {
    it('should render default state correctly', () => {
      expect(renderComponent({ ...requiredProps }).getTree()).toMatchSnapshot()
    })

    it('should render the correct card icon of the payment methods passed in', () => {
      const storedPaymentMethod = {
        value: 'AMEX',
        icon: 'AMEX_ICON.SVG',
      }

      expect(
        renderComponent({
          ...requiredProps,
          storedPaymentMethod,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should render `ConfirmCVV` component if `CARD` type', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        type: 'CARD',
      })
      expect(wrapper.find('Connect(ConfirmCVV)').length).toBe(1)
    })

    it('should render `ConfirmCVV` component if `OTHER_CARD` type', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        type: 'OTHER_CARD',
      })
      expect(wrapper.find('Connect(ConfirmCVV)').length).toBe(1)
    })

    it('should not render `ConfirmCVV` input if Card is expired', () => {
      const initialState = buildStore({
        account: {
          user: {
            creditCard: {
              cardNumberStar: '********1111',
              expiryMonth: 10,
              expiryYear: 2015,
              type: 'VISA',
            },
          },
        },
        paymentMethods: [{ type: 'CARD', value: 'VISA' }],
      })
      const wrapper = mount(<ConfirmCVV {...requiredProps} />, {
        context: { l: () => {}, store: initialState },
        childContextTypes: {
          l: PropTypes.func,
          store: PropTypes.object,
        },
      })
      expect(wrapper.find('CVVField').prop('isStoredCardExpired')).toBe(true)
    })

    it('should render `KlarnaForm` if value is `KLARNA` and shopping bag has one item or more', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        value: 'KLRNA',
        shoppingBagTotalItems: 1,
      })
      expect(wrapper.find(KlarnaForm).length).toBe(1)
    })
  })

  describe('@events', () => {
    it('should call `onChange` prop when button is clicked', () => {
      const onChangeMock = jest.fn()
      const event = {}
      const { wrapper } = renderComponent({
        ...requiredProps,
        onChange: onChangeMock,
      })
      wrapper.find('a').prop('onClick')(event)
      expect(onChangeMock).toHaveBeenCalledWith(event)
    })
  })
})
