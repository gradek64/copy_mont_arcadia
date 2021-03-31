import orderSummaryWithPromo from '../../../../fixtures/rememberMe/rememberMe--order_summary_promo.json'
import orderSummary from '../../../../fixtures/rememberMe/rememberMe--order_summary.json'
import getBagItems from '../../../../fixtures/minibag/getItemsWithProdsAndPromoCode.json'
import user from '../../../../fixtures/rememberMe/rememberMe--rememberedUser-logged_in.json'
import restrictedActionResponse from '../../../../fixtures/rememberMe/rememberMe--restricted-action-response.json'
import addPromoCodeCheckout from '../../../../fixtures/rememberMe/rememberMe--add_promo_checkout.json'
import { promoCode as promoCodes } from '../../../../constants/promoCode'
import DeliveryPayment from '../../../../page-objects/checkout/DeliveryPayment.page'
import Login from '../../../../page-objects/login/Login.page'
import PromoCode from '../../../../page-objects/PromoCode.page'
import { setFeatureFlag, isMobileLayout } from '../../../../lib/helpers'

const deliveryPayment = new DeliveryPayment()
const login = new Login()
const promoCode = new PromoCode()

if (isMobileLayout()) {
  describe('Remember Me - Checkout: Restricted actions for full and partial authentication', () => {
    describe('Authenticated user receives an unauthorised response while updating in checkout', () => {
      beforeEach(() => {
        setFeatureFlag('FEATURE_REMEMBER_ME')
        deliveryPayment.mocksForCheckout({
          bagCountCookie: '1',
          setAuthStateCookie: 'yes',
          getOrderSummary: orderSummary,
          getAccount: user,
          login: user,
        })
        deliveryPayment.mocksForShoppingBag({
          addPromotionCode401: restrictedActionResponse,
          getItems: getBagItems,
        })

        cy.visit('/checkout/delivery-payment')
        deliveryPayment.expandPromoCode()
        promoCode
          .typePromoCodeAndApply(promoCodes.tsPromo)
          .wait('@add-promo-401')
      })

      it('should contain promotion code in bag after re-login in Checkout', () => {
        deliveryPayment.mocksForCheckout({
          getOrderSummaryByOrder: orderSummaryWithPromo,
        })
        deliveryPayment.mocksForShoppingBag({
          addPromotionCode: addPromoCodeCheckout,
        })

        login
          .assertLoginFormValues({
            email: 'testymctest@arcadiagroup.co.uk',
            password: '',
            rememberMeChecked: true,
          })
          .loginAsRememberedUser()
          .wait('@order-summary')

        cy.location('pathname').should('eq', '/checkout/delivery-payment')
        promoCode.verifyPromoCodeApplied(promoCodes.tsPromo)
      })
    })
  })
}
