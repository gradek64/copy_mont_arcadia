import order_summary from '../../../../fixtures/checkout/order_summary---returningUserSingleSizeProdAndDdp.json'
import order from '../../../../fixtures/checkout/order--returningUserSingleSizeProdAndDdpProd-visa.json'
import checkout_profile from '../../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import DeliveryPaymentPage from '../../../../page-objects/checkout/DeliveryPayment.page'
import ThankyouPage from '../../../../page-objects/checkout/ThankYou.page'
import PaymentPage from '../../../../page-objects/checkout/Payment.page'
import { visaCardPaymentDetails } from '../../../../constants/paymentDetails'
import { isMobileLayout } from '../../../../lib/helpers'

const deliveryPayment = new DeliveryPaymentPage()
const thankyouPage = new ThankyouPage()
const paymentPage = new PaymentPage()

if (isMobileLayout()) {
  describe('VISA payment', () => {
    beforeEach(() => {
      deliveryPayment.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: order_summary,
        getAccount: checkout_profile,
        postOrder: order,
      })
      cy.visit('checkout/delivery-payment')
    })

    describe('Valid VISA payments', () => {
      it('should allow the user to pay with VISA', () => {
        if (
          expect(deliveryPayment.cardsInputField).to.be.not.visible === true
        ) {
          deliveryPayment.payWithCard(visaCardPaymentDetails)
        } else {
          deliveryPayment.changePaymentMethod()
          deliveryPayment.payWithCard(visaCardPaymentDetails)
        }
        cy.wait('@order-complete').then(() => {
          thankyouPage.assertContinueShoppingOnThankYouPage()
        })
      })
    })

    describe('Invalid Visa payments', () => {
      it('the card number field should not accept an empty input', () => {
        deliveryPayment.changePaymentMethod()
        paymentPage.clickOrderButton()
        deliveryPayment.checkInputValidationMessage(
          0,
          'A 16 digit card number is required'
        )
        deliveryPayment.checkInputValidationMessage(1, '3 digits required')
      })

      it('the card field number should allow only digits', () => {
        const string = 'a'.repeat(16)
        deliveryPayment.changePaymentMethod()
        paymentPage.clickOrderButton()
        cy.get(deliveryPayment.cardsInputField).type(string)
        deliveryPayment.checkInputValidationMessage(0, 'Only digits allowed')
      })
      it('the card number field should trigger an error message if more than 16 digits are input', () => {
        const string = '4'.repeat(17)
        deliveryPayment.changePaymentMethod()
        paymentPage.clickOrderButton()
        cy.get(deliveryPayment.cardsInputField).type(string)
        deliveryPayment.checkInputValidationMessage(
          0,
          'A 16 digit card number is required'
        )
      })
      it('the card number field should trigger an error message if less than 16 digits are input', () => {
        const string = '4'.repeat(15)
        deliveryPayment.changePaymentMethod()
        paymentPage.clickOrderButton()
        cy.get(deliveryPayment.cardsInputField).type(string)
        deliveryPayment.checkInputValidationMessage(
          0,
          'A 16 digit card number is required'
        )
      })
      it('the CVV field should not accept more than 3 digits', () => {
        const string = '4'.repeat(4)
        deliveryPayment.changePaymentMethod()
        paymentPage.clickOrderButton()
        cy.get(deliveryPayment.cvvInput).type(string)
        deliveryPayment.checkInputValidationMessage(1, '3 digits required')
      })
      it('the CVV field should not accept less than 3 digits', () => {
        const string = '2'.repeat(4)
        deliveryPayment.changePaymentMethod()
        paymentPage.clickOrderButton()
        cy.get(deliveryPayment.cvvInput).type(string)
        deliveryPayment.checkInputValidationMessage(1, '3 digits required')
      })
      it('the CVV field should accept only numbers', () => {
        const string = 'a'.repeat(4)
        deliveryPayment.changePaymentMethod()
        paymentPage.clickOrderButton()
        cy.get(deliveryPayment.cvvInput).type(string)
        deliveryPayment.checkInputValidationMessage(1, 'Only digits allowed')
      })
    })
  })
}
