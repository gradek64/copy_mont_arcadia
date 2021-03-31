import order_summary from '../../../../fixtures/checkout/order_summary---returningUserSingleSizeProdAndDdp.json'
import checkout_profile from '../../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import psd2_modal from '../../../../fixtures/checkout/psd2_modal.json'
import DeliveryPaymentPage from '../../../../page-objects/checkout/DeliveryPayment.page'
import PaymentPage from '../../../../page-objects/checkout/Payment.page'
import { setFeatureFlag, isMobileLayout } from '../../../../lib/helpers'
import { visaCardPaymentDetails } from '../../../../constants/paymentDetails'

const deliveryPayment = new DeliveryPaymentPage()
const paymentPage = new PaymentPage()

if (isMobileLayout()) {
  describe('VISA payment with PSD2', () => {
    beforeEach(() => {
      setFeatureFlag('FEATURE_PSD2_PUNCHOUT_POPUP', true)

      deliveryPayment.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: order_summary,
        getAccount: checkout_profile,
        postPaymentWithPSD2: psd2_modal,
      })
      cy.visit('checkout/delivery-payment')
    })
    describe('Valid 3D secure payments', () => {
      it('3D secure modal should appear', () => {
        deliveryPayment.changePaymentMethod()
        deliveryPayment.payWithCard(visaCardPaymentDetails)
        cy.wait('@payment-complete-PSD2').then(() => {
          cy.get(paymentPage.psd2Modal).should('be.visible')
        })
      })
      it('Close 3D secure modal', () => {
        deliveryPayment.changePaymentMethod()
        deliveryPayment.payWithCard(visaCardPaymentDetails)
        cy.wait('@payment-complete-PSD2').then(() => {
          cy.get(paymentPage.psd2Modal).should('be.visible')
          cy.get(paymentPage.psd2ModalCloseButton).click()
          cy.get(paymentPage.psd2Modal).should('not.be.visible')
        })
      })
      it('Verify the url', () => {
        deliveryPayment.changePaymentMethod()
        deliveryPayment.payWithCard(visaCardPaymentDetails)
        cy.wait('@payment-complete-PSD2').then(() => {
          cy.url().should('not.include', 'https://secure-test.worldpay.com')
        })
      })
    })
  })
}
