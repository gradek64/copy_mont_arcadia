import orderSummary from '../../../../fixtures/rememberMe/rememberMe--order_summary.json'
import shoppingBag from '../../../../fixtures/rememberMe/rememberMe--returningUser_shopping-bag_multiple_items.json'
import loginProfile from '../../../../fixtures/rememberMe/rememberMe--rememberedUser-logged_in.json'
import changeDeliveryTypeMiniBag from '../../../../fixtures/rememberMe/rememberMe--changeDeliveryType.json'

import Nav from '../../../../page-objects/Navigation.page'
import MiniBag from '../../../../page-objects/MiniBag.page'
import Login from '../../../../page-objects/login/Login.page'
import DeliveryPayment from '../../../../page-objects/checkout/DeliveryPayment.page'
import {
  setFeatureFlag,
  setupPartialAuthState,
  isMobileLayout,
} from '../../../../lib/helpers'

const nav = new Nav()
const miniBag = new MiniBag()
const login = new Login()
const deliveryPayment = new DeliveryPayment()

if (isMobileLayout()) {
  describe('Remember Me - partial authentication - unrestricted minibag changes', () => {
    beforeEach(() => {
      setFeatureFlag('FEATURE_REMEMBER_ME')
    })
    it('should allow order updates without login prompt until checkout is requested', () => {
      cy.setCookie('bagCount', '2')
      cy.setCookie('authenticated', 'yes')

      deliveryPayment
        .mocksForCheckout({
          bagCountCookie: '1',
          getOrderSummaryByOrder: orderSummary,
          getAccount: loginProfile,
          login: loginProfile,
        })
        .mocksForShoppingBag({
          setAuthStateCookie: 'partial',
          getItems: shoppingBag,
          changeDeliveryType: changeDeliveryTypeMiniBag,
        })

      // wait for page load mocks to complete then set partial authentication
      cy.visit('/')
        .wait('@account')
        .wait('@get-items')
        .then(() => {
          setupPartialAuthState()
        })

      // updating the basket does not prompt login
      nav.openMiniBag()
      miniBag
        .selectDeliveryOptionAtIndex(2)
        .wait('@change-delivery-minibag')
        .moveToCheckout() // proceeding to checkout does

      login
        .assertLoginFormValues({
          email: 'testymctest@arcadiagroup.co.uk',
          password: '',
          rememberMeChecked: true,
        })
        .loginAsRememberedUser()
        .wait('@order-summary')

      // Ensure we are sent to the correct checkout page
      cy.location('pathname').should('eq', '/checkout/delivery-payment')
    })
  })
}
