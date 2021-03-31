import order_summary from '../../../../fixtures/checkout/order_summary---returningUserSingleSizeProdAndDdp.json'
import order from '../../../../fixtures/checkout/order--returningUserSingleSizeProdAndDdpProd-visa.json'
import checkout_profile from '../../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import DeliveryPaymentPage from '../../../../page-objects/checkout/DeliveryPayment.page'
import ThankyouPage from '../../../../page-objects/checkout/ThankYou.page'
import { isMobileLayout } from '../../../../lib/helpers'

const deliveryPayment = new DeliveryPaymentPage()
const thankyouPage = new ThankyouPage()

// Below will need to be removed once the new e2e are up and running OE-2648
if (isMobileLayout()) {
  describe('PAYPAL payment', () => {
    beforeEach(() => {
      const checkoutProfilePaypal = {
        ...checkout_profile,
        creditCard: {
          cardNumberHash: '',
          cardNumberStar: '',
          expiryMonth: '',
          expiryYear: '',
          type: 'PYPAL',
        },
      }
      const orderIsPaypal = {
        ...order,
        completedOrder: {
          ...order.completedOrder,
          paymentDetails: [
            {
              cardNumberStar: '',
              paymentMethod: 'Paypal',
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
        getAccount: checkoutProfilePaypal,
        postOrder: orderIsPaypal,
      })
      cy.visit('checkout/delivery-payment')
    })

    describe('Paypal succesful order', () => {
      it('should allow the user to pay with Paypal', () => {
        if (
          expect(deliveryPayment.cardsInputField).to.be.not.visible === true
        ) {
          deliveryPayment.payWithPaypal()
        } else {
          deliveryPayment.changePaymentMethod()
          deliveryPayment.payWithPaypal()
        }
        cy.wait('@order-complete').then(() => {
          thankyouPage.assertContinueShoppingOnThankYouPage()
        })
      })
    })
  })
}
