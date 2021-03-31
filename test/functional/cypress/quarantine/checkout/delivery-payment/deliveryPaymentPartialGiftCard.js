import orderSummary from '../../../fixtures/checkout/order_summary---returningUserPartialGiftGard.json'
import checkoutProfile from '../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import DeliveryPaymentPage from '../../../page-objects/checkout/DeliveryPayment.page'
import { isMobileLayout } from '../../../lib/helpers'

const deliveryPaymentPage = new DeliveryPaymentPage()

if (isMobileLayout()) {
  describe('Partial Gift Card - A user can select to pay remaining balance via saved payment.', () => {
    beforeEach(() => {
      deliveryPaymentPage.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummary,
        getAccount: checkoutProfile,
      })
      cy.visit('checkout/delivery-payment')
    })
    it('Should display card payment when remaining balance is less than £1', () => {
      cy.get(deliveryPaymentPage.paymentDetails)
        .should('be.visible')
        .get(deliveryPaymentPage.changePaymentMethodBtn)
        .should('be.visible')
    })
    it('Should show the form to add an additional gift card since the total is > 0', () => {
      cy.get(deliveryPaymentPage.giftCards)
        .click(10, 10)
        .get(deliveryPaymentPage.giftCardsNumberInput)
        .should('be.visible')
    })
  })
}
