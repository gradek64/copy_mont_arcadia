import { setFeature, isMobileLayout } from '../../../lib/helpers'
import order_summary from '../../../fixtures/checkout/order_summary---returningUserSingleSizeProdAndDdp.json'
import order from '../../../fixtures/checkout/order--returningUserSingleSizeProdAndDdpProd-visa.json'
import checkout_profile from '../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import DeliveryPaymentPage from '../../../page-objects/checkout/DeliveryPayment.page'
import ThankyouPage from '../../../page-objects/checkout/ThankYou.page'

const deliveryPayment = new DeliveryPaymentPage()
const thankyouPage = new ThankyouPage()

if (isMobileLayout()) {
  describe('DDP product in thank you page', () => {
    beforeEach(() => {
      deliveryPayment.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: order_summary,
        getAccount: checkout_profile,
        postOrder: order,
      })
      cy.visit('checkout/delivery-payment')
      setFeature('FEATURE_DDP')
    })

    describe('Order complete checks', () => {
      it('should not display size label for DDP', () => {
        deliveryPayment.payAsReturningUser().wait('@order-complete')

        thankyouPage.assertContinueShoppingOnThankYouPage()

        cy.get(thankyouPage.ProductsInShoppingBag)
          .eq(1)
          .within(() => {
            cy.get(thankyouPage.SizeLabelInShoppingBag).should('not.be.visible')
          })
      })
    })

    describe('Returning user with DDP Mixed bag', () => {
      it('should display the link to my account', () => {
        const ddpOrderComplete = {
          ...order,
          completedOrder: {
            ...order.completedOrder,
            isDDPOrder: true,
          },
        }
        deliveryPayment.mocksForCheckout({
          setAuthStateCookie: 'yes',
          postOrder: ddpOrderComplete,
        })
        deliveryPayment.payAsReturningUser().wait('@order-complete')
        cy.get(thankyouPage.myAccountLink).should('be.visible')
      })
    })
  })
}
