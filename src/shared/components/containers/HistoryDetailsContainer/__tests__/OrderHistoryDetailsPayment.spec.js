import testComponentHelper from 'test/unit/helpers/test-component'
import OrderHistoryDetailsPayment from '../OrderHistoryDetailsPayment'

describe('<OrderHistoryDetailsPayment />', () => {
  const renderComponent = testComponentHelper(OrderHistoryDetailsPayment)
  const initialProps = {
    paymentDetails: [
      {
        paymentMethod: 'Paypal',
        totalCost: '£25.00',
      },
    ],
  }

  const propsWithCardDetails = {
    paymentDetails: [
      {
        paymentMethod: 'Visa',
        cardNumberStar: '************1111',
        totalCost: '£25.00',
      },
    ],
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('with card details', () => {
      expect(renderComponent(propsWithCardDetails).getTree()).toMatchSnapshot()
    })
  })
})
