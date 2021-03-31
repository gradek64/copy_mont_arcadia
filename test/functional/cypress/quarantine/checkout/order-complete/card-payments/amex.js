import order_summary from '../../../../fixtures/checkout/order_summary---returningUserSingleSizeProdAndDdp.json'
import order from '../../../../fixtures/checkout/order--returningUserSingleSizeProdAndDdpProd-visa.json'
import checkout_profile from '../../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import DeliveryPaymentPage from '../../../../page-objects/checkout/DeliveryPayment.page'
import ThankyouPage from '../../../../page-objects/checkout/ThankYou.page'
import PaymentPage from '../../../../page-objects/checkout/Payment.page'
import { amexPaymentDetails } from '../../../../constants/paymentDetails'
import { isMobileLayout } from '../../../../lib/helpers'

const deliveryPayment = new DeliveryPaymentPage()
const thankyouPage = new ThankyouPage()
const paymentPage = new PaymentPage()

if (isMobileLayout()) {
  describe('AMEX payment', () => {
    beforeEach(() => {
      const checkoutProfileAmex = {
        ...checkout_profile,
        creditCard: {
          cardNumberHash: '********************gg==',
          cardNumberStar: '***********4343',
          expiryMonth: '07',
          expiryYear: '2028',
          type: 'AMEX',
        },
      }
      const orderIsAmex = {
        ...order,
        completedOrder: {
          ...order.completedOrder,
          paymentDetails: [
            {
              cardNumberStar: '***********4343',
              paymentMethod: 'American Express',
              totalCost: '£24.00',
              totalCostAfterDiscount: '£24.00',
            },
          ],
        },
      }
      deliveryPayment.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: order_summary,
        getAccount: checkoutProfileAmex,
        postOrder: orderIsAmex,
      })
      cy.visit('checkout/delivery-payment')
    })

    describe('Valid AMEX payment', () => {
      it('should allow the user to pay with AMEX', () => {
        if (
          expect(deliveryPayment.cardsInputField).to.be.not.visible === true
        ) {
          // deliveryPayment.payWithAmex()
          deliveryPayment.payWithCard(amexPaymentDetails)
        } else {
          deliveryPayment.changePaymentMethod()
          deliveryPayment.payWithCard(amexPaymentDetails)
        }
        cy.wait('@order-complete').then(() => {
          thankyouPage.assertContinueShoppingOnThankYouPage()
        })
      })
    })

    describe('Invalid AMEX payment', () => {
      it('the card number input should require a 15 digit card number', () => {
        const string = '340'.repeat(1)
        deliveryPayment.changePaymentMethod()
        cy.get(deliveryPayment.cardsInputField).type(string)
        paymentPage.clickOrderButton()
        deliveryPayment.checkInputValidationMessage(
          0,
          'A 15 digit card number is required'
        )
      })

      it('the CVV field should not accept less than 4 digits', () => {
        const cardString = '340'.repeat(1)
        const CVVstring = '2'.repeat(3)
        deliveryPayment.changePaymentMethod()
        cy.get(deliveryPayment.cardsInputField).type(cardString)
        paymentPage.clickOrderButton()
        cy.get(deliveryPayment.cvvInput).type(CVVstring)
        deliveryPayment.checkInputValidationMessage(1, '4 digits required')
      })

      it('the CVV field should not accept more than 4 digits', () => {
        const cardString = '340'.repeat(1)
        const CVVstring = '2'.repeat(5)
        deliveryPayment.changePaymentMethod()
        cy.get(deliveryPayment.cardsInputField).type(cardString)
        paymentPage.clickOrderButton()
        cy.get(deliveryPayment.cvvInput).type(CVVstring)
        deliveryPayment.checkInputValidationMessage(1, '4 digits required')
      })
    })
  })
}
