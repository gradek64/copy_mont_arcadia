import Checkout from '../../page-objects/checkout/Checkout.page'
import MiniBag from '../../page-objects/MiniBag.page'
import orderSummary from '../../fixtures/checkout/order_summary---returningUserSingleSizeProd.json'
import account from '../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import getItems from '../../fixtures/minibag/getItemsWithProduct.json'
import { isMobileLayout } from '../../lib/helpers'

const checkout = new Checkout()
const miniBag = new MiniBag()

if (isMobileLayout()) {
  describe('Checkout 404s', () => {
    beforeEach(() => {
      checkout.mocksForCheckout({
        bagCountCookie: '1',
        getOrderSummary: orderSummary,
        getAccount: account,
      })
      checkout.mocksForShoppingBag({
        getItems,
      })
      cy.visit('/checkout/bad-path', {
        failOnStatusCode: false,
      })
    })

    it('should ensure there is bag data when the user continues shopping', () => {
      cy.wait('@get-items')
      checkout.clickContinueShopping()
      miniBag.open()
      miniBag.expectNumberOfProductsToBe(1)
    })
  })
}
