import '../../../lib/tcombSchemaExtensions'
import PromoCodePage from '../../../page-objects/PromoCode.page'
import DeliveryPage from '../../../page-objects/checkout/Delivery.page'
import getLastGtmEventOfType from '../../../lib/getLastGtmEventOfType'
import { promoCode } from '../../../constants/promoCode'
import returningUser from '../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import returningUserWithBasket from '../../../fixtures/checkout/order_summary---returningUserSingleSizeProd.json'
import { isMobileLayout } from '../../../lib/helpers'

const deliveryPage = new DeliveryPage()
const promoCodePage = new PromoCodePage()

if (isMobileLayout()) {
  describe('GA events for promo-code application on payment page', () => {
    beforeEach(() => {
      deliveryPage.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getAccount: returningUser,
        getOrderSummaryByOrder: returningUserWithBasket,
        getOrderSummary: returningUserWithBasket,
      })
      cy.visit('/checkout/payment')
    })

    it('should create a "promoCodeApplied" click event on success', () => {
      deliveryPage.mocksForShoppingBag({
        addPromotionCode: 'fixture:payment/addPromoCodeOnPaymentsPage',
      })

      promoCodePage
        .enterPromoCodeAndApply(promoCode.tsPromo)
        .wait('@add-promo')
        .verifyPromoCodeApplied(promoCode.tsPromo)

      getLastGtmEventOfType('event').then((event) => {
        expect(event.event).to.equal('clickevent')
        expect(event.ea).to.equal('promoCodeApplied')
        expect(event.ec).to.equal('checkout')
      })
    })

    it('should create an "errorMessage" event on failure', () => {
      deliveryPage.mocksForShoppingBag({
        addPromotionCode422: 'fixture:payment/failedPromoCodeOnPaymentsPage',
      })

      promoCodePage
        .enterPromoCodeAndApply('XXXXXXX')
        .wait('@add-promo-422')
        .verifyPromoCodeErrorDisplayed()

      getLastGtmEventOfType('event').then((event) => {
        expect(event.event).to.equal('errorMessage')
        expect(event.errorMessage).to.equal(
          'Error applying promo code in shopping bag.'
        )
      })
    })
  })
}
