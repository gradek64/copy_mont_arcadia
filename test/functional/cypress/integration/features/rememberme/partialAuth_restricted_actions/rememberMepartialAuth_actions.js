import productPage from '../../../../fixtures/rememberMe/rememberMe--productPage.json'
import addToBagResponse from '../../../../fixtures/rememberMe/rememberMe--added_item1.json'
import PDP from '../../../../page-objects/Pdp.page'
import MiniBag from '../../../../page-objects/MiniBag.page'
import DeliveryPayment from '../../../../page-objects/checkout/DeliveryPayment.page'
import {
  setFeatureFlag,
  setupPartialAuthState,
  isMobileLayout,
} from '../../../../lib/helpers'

const pdp = new PDP()
const miniBag = new MiniBag()
const deliveryPayment = new DeliveryPayment()

if (isMobileLayout()) {
  describe('Remember Me -  A partial auth acceptable actions', () => {
    beforeEach(() => {
      setFeatureFlag('FEATURE_REMEMBER_ME')
      const path = pdp.mocksForPdpProduct({ productByUrl: productPage })
      cy.visit(path)

      setupPartialAuthState()
      deliveryPayment.mocksForShoppingBag({
        addToBag: addToBagResponse,
      })
    })

    it('should allow add to bag then redirect to checkout/login for partially authenticated user', () => {
      pdp
        .selectFirstSizeFromTiles()
        .addToBag()
        .closeAddConfirmationModal()

      miniBag
        .open()
        .expectNumberOfProductsToBe(1)
        .moveToCheckout()

      cy.location('pathname').should('eq', '/checkout/login')
    })
  })
}
