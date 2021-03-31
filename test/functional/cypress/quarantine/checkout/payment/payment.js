import { setFeature, isMobileLayout } from '../../../lib/helpers'
import orderSummaryNewUserDdpProd from '../../../fixtures/checkout/order_summary---returningUserDdpProd.json'
import checkoutProfileNewUser from '../../../fixtures/checkout/account--newUser.json'
import MiniBag from '../../../page-objects/MiniBag.page'
import DeliveryPayment from '../../../page-objects/checkout/DeliveryPayment.page'

const shoppingBag = new MiniBag()
const checkout = new DeliveryPayment()

if (isMobileLayout()) {
  describe('Checkout - payment: DDP product', () => {
    beforeEach(() => {
      checkout.mocksForCheckout({
        setAuthStateCookie: 'yes',
        bagCountCookie: '1',
        getOrderSummary: orderSummaryNewUserDdpProd,
        getAccount: checkoutProfileNewUser,
      })
      cy.visit('checkout/payment')
      setFeature('FEATURE_DDP')
    })

    it('edit link and size should not be available in Shopping Bag', () => {
      checkout.clickMobileOrderSummaryButton()
      shoppingBag.assertDDPinBag()
    })
  })
}
