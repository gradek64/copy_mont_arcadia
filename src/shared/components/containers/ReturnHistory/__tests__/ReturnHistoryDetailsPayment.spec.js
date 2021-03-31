import testComponentHelper from 'test/unit/helpers/test-component'
import ReturnHistoryDetailsPayment from '../ReturnHistoryDetailsPayment'

describe('ReturnHistoryDetailsPayment', () => {
  const renderComponent = testComponentHelper(ReturnHistoryDetailsPayment)

  const visa = {
    paymentMethod: 'Visa',
    cardNumberStar: '************1111',
    totalCost: '£31.00',
    icon: 'icon_visa.gif',
  }

  const payPal = {
    paymentMethod: 'Paypal',
    totalCost: '£16.00',
    icon: 'icon_paypal.gif',
  }

  const giftCard = {
    paymentMethod: 'GiftCard',
    cardNumberStar: '************4258',
    totalCost: '£0.50',
  }

  describe('@defaults', () => {
    it('in default state', () => {
      expect(renderComponent().getTree()).toMatchSnapshot()
    })
    describe('with one payment method', () => {
      it('all fields included', () => {
        expect(
          renderComponent({
            paymentDetails: [visa],
          }).getTree()
        ).toMatchSnapshot()
      })
      it('without cardNumberStar', () => {
        expect(
          renderComponent({
            paymentDetails: [payPal],
          }).getTree()
        ).toMatchSnapshot()
      })
      it('without icon', () => {
        expect(
          renderComponent({
            paymentDetails: [giftCard],
          }).getTree()
        ).toMatchSnapshot()
      })
    })
    it('with multiple payment methods', () => {
      expect(
        renderComponent({
          paymentDetails: [visa, payPal, giftCard],
        }).getTree()
      ).toMatchSnapshot()
    })
  })
})
