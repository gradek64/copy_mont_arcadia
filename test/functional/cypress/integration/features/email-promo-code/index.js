import bagItems from '../../../fixtures/minibag/getItemsWithProduct.json'
import promoCodeSuccess from '../../../fixtures/minibag/addPromoCodeOnMinibag.json'
import promoCodeFailure from '../../../fixtures/minibag/addPromoCodeFailure.json'
import singleSizeProduct from '../../../fixtures/pdp/singleSizeProduct/pdpInitialFetch.json'
import MiniBag from '../../../page-objects/MiniBag.page'
import PromoCode from '../../../page-objects/PromoCode.page'
import Pdp from '../../../page-objects/Pdp.page'
import { isMobileLayout } from '../../../lib/helpers'

const miniBag = new MiniBag()
const promoCode = new PromoCode()
const pdp = new Pdp()
const code = 'TSDEL0103'

if (isMobileLayout()) {
  describe('email promo code', () => {
    beforeEach(() => {
      cy.clearCookie('bagCount')
      miniBag.mocksForShoppingBag({
        addToBag: bagItems,
        getItems: bagItems,
        addPromotionCode: promoCodeSuccess,
      })
    })

    it('applies promo from query string if 1 or more items in bag', () => {
      cy.setCookie('bagCount', '1')
      cy.visit(`/?ARCPROMO_CODE=${code}`)
      miniBag.wait('@add-promo').expectToBeOpen()
      promoCode.verifyPromoCodeApplied(code)
    })

    it('shows error when failing to add promo from query string', () => {
      cy.setCookie('bagCount', '1')
      miniBag.mocksForShoppingBag({
        addPromotionCode406: promoCodeFailure,
      })
      cy.visit(`/?ARCPROMO_CODE=ERR`)

      miniBag.wait('@add-promo-406').expectToBeOpen()
      promoCode.verifyPromoCodeErrorDisplayed()
    })

    it('adds promo when user adds item to bag', () => {
      const path = pdp.mocksForPdpProduct({ productByUrl: singleSizeProduct })
      cy.visit(`${path}?ARCPROMO_CODE=${code}`)
      pdp.addToBag()
      miniBag.wait('@add-promo')
      promoCode.verifyPromoCodeApplied(code)
    })
  })
}
