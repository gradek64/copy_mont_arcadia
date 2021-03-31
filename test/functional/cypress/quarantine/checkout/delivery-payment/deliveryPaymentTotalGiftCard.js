import orderSummary from '../../../fixtures/checkout/order_summary---returningUserTotalGiftCard.json'
import checkoutProfile from '../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import DeliveryPaymentPage from '../../../page-objects/checkout/DeliveryPayment.page'
import { isMobileLayout } from '../../../lib/helpers'

const deliveryPaymentPage = new DeliveryPaymentPage()

if (isMobileLayout()) {
  describe('Total Gift Card - Checking a Gift Card That Covers All The Payment', () => {
    beforeEach(() => {
      deliveryPaymentPage.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummary,
        getAccount: checkoutProfile,
      })
      cy.visit('checkout/delivery-payment')
    })
    it('Should not show the form to add an additional gift card since the total is = 0', () => {
      cy.get(deliveryPaymentPage.giftCards)
        .click(10, 10)
        .get(deliveryPaymentPage.giftCardsNumberInput)
        .should('not.be.visible')
    })
  })
}
