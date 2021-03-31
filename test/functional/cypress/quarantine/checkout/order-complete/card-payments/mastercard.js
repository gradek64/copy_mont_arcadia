import order_summary from '../../../../fixtures/checkout/order_summary---returningUserSingleSizeProdAndDdp.json'
import order from '../../../../fixtures/checkout/order--returningUserSingleSizeProdAndDdpProd-visa.json'
import checkout_profile from '../../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import DeliveryPaymentPage from '../../../../page-objects/checkout/DeliveryPayment.page'
import ThankyouPage from '../../../../page-objects/checkout/ThankYou.page'
import { mastercardPaymentDetails } from '../../../../constants/paymentDetails'
import { isMobileLayout } from '../../../../lib/helpers'

const deliveryPayment = new DeliveryPaymentPage()
const thankyouPage = new ThankyouPage()

if (isMobileLayout()) {
  describe('Mastercard debit payment', () => {
    beforeEach(() => {
      const checkoutProfileMasterCard = {
        ...checkout_profile,
        creditCard: {
          cardNumberHash: '****************************Roit',
          cardNumberStar: '************5454',
          expiryMonth: '07',
          expiryYear: '2028',
          type: 'MCARD',
        },
      }
      const orderIsMastercard = {
        ...order,
        completedOrder: {
          ...order.completedOrder,
          paymentDetails: [
            {
              cardNumberStar: '************5454',
              paymentMethod: 'Mastercard',
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
        getAccount: checkoutProfileMasterCard,
        postOrder: orderIsMastercard,
      })
      cy.visit('checkout/delivery-payment')
    })

    describe('Valid mastercard payments', () => {
      it('should allow the user to pay with mastercard', () => {
        if (
          expect(deliveryPayment.cardsInputField).to.be.not.visible === true
        ) {
          deliveryPayment.payWithCard(mastercardPaymentDetails)
        } else {
          deliveryPayment.changePaymentMethod()
          deliveryPayment.payWithCard(mastercardPaymentDetails)
        }
        cy.wait('@order-complete').then(() => {
          thankyouPage.assertContinueShoppingOnThankYouPage()
        })
      })
    })
  })
}
