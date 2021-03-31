import order_summary from '../../../../fixtures/checkout/order_summary---returningUserSingleSizeProdAndDdp.json'
import order from '../../../../fixtures/checkout/order--returningUserSingleSizeProdAndDdpProd-visa.json'
import checkout_profile from '../../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import DeliveryPaymentPage from '../../../../page-objects/checkout/DeliveryPayment.page'
import ThankyouPage from '../../../../page-objects/checkout/ThankYou.page'
import { maestroPaymentDetails } from '../../../../constants/paymentDetails'
import { isMobileLayout } from '../../../../lib/helpers'

const deliveryPayment = new DeliveryPaymentPage()
const thankyouPage = new ThankyouPage()

if (isMobileLayout()) {
  describe('MAESTRO payment', () => {
    beforeEach(() => {
      const checkoutProfileMaestro = {
        ...checkout_profile,
        creditCard: {
          cardNumberHash: '****************************/SeI',
          cardNumberStar: '************8453',
          expiryMonth: '07',
          expiryYear: '2028',
          type: 'SWTCH',
        },
      }
      const orderIsMaestro = {
        ...order,
        completedOrder: {
          ...order.completedOrder,
          paymentDetails: [
            {
              cardNumberStar: '************8453',
              paymentMethod: 'Maestro',
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
        getAccount: checkoutProfileMaestro,
        postOrder: orderIsMaestro,
      })
      cy.visit('checkout/delivery-payment')
    })

    describe('Valid MAESTRO payment', () => {
      it('should allow the user to pay with MAESTRO', () => {
        if (
          expect(deliveryPayment.cardsInputField).to.be.not.visible === true
        ) {
          deliveryPayment.payWithCard(maestroPaymentDetails)
        } else {
          deliveryPayment.changePaymentMethod()
          deliveryPayment.payWithCard(maestroPaymentDetails)
        }
        cy.wait('@order-complete').then(() => {
          thankyouPage.assertContinueShoppingOnThankYouPage()
        })
      })
    })
  })
}
