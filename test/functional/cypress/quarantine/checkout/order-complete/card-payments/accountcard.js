import order_summary from '../../../../fixtures/checkout/order_summary---returningUserSingleSizeProdAndDdp.json'
import order from '../../../../fixtures/checkout/order--returningUserSingleSizeProdAndDdpProd-visa.json'
import checkout_profile from '../../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import DeliveryPaymentPage from '../../../../page-objects/checkout/DeliveryPayment.page'
import ThankyouPage from '../../../../page-objects/checkout/ThankYou.page'
import { accountCardPaymentDetails } from '../../../../constants/paymentDetails'
import { isMobileLayout } from '../../../../lib/helpers'

const deliveryPayment = new DeliveryPaymentPage()
const thankyouPage = new ThankyouPage()
// The card payment test swill need to be reviewed once the new E2E are up and running OE-2648
if (isMobileLayout()) {
  describe('Account card payment', () => {
    beforeEach(() => {
      const checkoutProfileAccountCard = {
        ...checkout_profile,
        creditCard: {
          cardNumberHash: '****************************bf1r',
          cardNumberStar: '************0005',
          expiryMonth: '07',
          expiryYear: '2028',
          type: 'ACCNT',
        },
      }
      const orderIsAccountCard = {
        ...order,
        completedOrder: {
          ...order.completedOrder,
          paymentDetails: [
            {
              cardNumberStar: '************0005',
              paymentMethod: 'Account Card',
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
        getAccount: checkoutProfileAccountCard,
        postOrder: orderIsAccountCard,
      })
      cy.visit('checkout/delivery-payment')
    })

    describe('Valid account card payment', () => {
      it('should allow the user to pay with Account card', () => {
        deliveryPayment.changePaymentMethod()
        deliveryPayment.selectAccountcardPaymentOption()
        deliveryPayment.payWithCard(accountCardPaymentDetails)

        cy.wait('@order-complete').then(() => {
          thankyouPage.assertContinueShoppingOnThankYouPage()
        })
      })
    })
  })
}
