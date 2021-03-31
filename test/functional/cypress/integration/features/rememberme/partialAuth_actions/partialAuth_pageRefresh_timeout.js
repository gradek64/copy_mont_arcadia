import orderSummary from '../../../../fixtures/rememberMe/rememberMe--order_summary.json'
import user from '../../../../fixtures/rememberMe/rememberMe--rememberedUser-logged_in.json'
import restrictedActionResponse from '../../../../fixtures/rememberMe/rememberMe--restricted-action-response.json'
import Login from '../../../../page-objects/login/Login.page'
import DeliveryPayment from '../../../../page-objects/checkout/DeliveryPayment.page'
import {
  setFeatureFlag,
  assertAuthState,
  isMobileLayout,
} from '../../../../lib/helpers'
import MyAccount from '../../../../page-objects/my-account/MyAccount.Page'

const login = new Login()
const deliveryPayment = new DeliveryPayment()
const myAccount = new MyAccount()
const myOrders = '/my-account/order-history'

if (isMobileLayout()) {
  describe('Remember Me - Checkout & My-Account page refresh for partially authenticated user', () => {
    beforeEach(() => {
      cy.setCookie('bagCount', '1')
      setFeatureFlag('FEATURE_REMEMBER_ME')
      deliveryPayment.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummaryByOrder: orderSummary,
        getOrderSummary: orderSummary,
        getAccount: user,
        login: user,
      })
    })

    it('should redirect to /checkout/login when refreshing as partially authenticated in my checkout', () => {
      cy.visit('/checkout/delivery-payment')

      deliveryPayment.mocksForCheckout({
        getAccount401: restrictedActionResponse,
      })

      cy.reload()
      cy.wait('@account-401')

      cy.location('pathname').should('eq', '/checkout/login')
      login.assertLoginFormValues({
        email: 'testymctest@arcadiagroup.co.uk',
        password: '',
        rememberMeChecked: true,
      })

      // should be taken back to delivery-payment after login
      login.loginAsRememberedUser()
      cy.location('pathname').should('eq', '/checkout/delivery-payment')
      assertAuthState('full')
    })

    it('should redirect to /login when refreshing as partially authenticated in my account', () => {
      cy.visit('/my-account')
      login.mocksForAccountAndLogin({
        getOrderHistory401: restrictedActionResponse,
      })

      myAccount.clickNavigation(myOrders)

      cy.wait('@order-history-401')
    })
  })
}
