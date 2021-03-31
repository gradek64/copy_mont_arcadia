import {
  isMobileLayout,
  setFeatureFlag,
  setupPartialAuthState,
  assertAuthState,
} from '../../../../lib/helpers'
import getBagItems from '../../../../fixtures/rememberMe/rememberMe--returningUser_shopping-bag_multiple_items.json'
import restrictedActionResponse from '../../../../fixtures/rememberMe/rememberMe--restricted-action-response.json'
import user from '../../../../fixtures/rememberMe/rememberMe--rememberedUser-logged_in.json'
import Login from '../../../../page-objects/login/Login.page'
import Nav from '../../../../page-objects/Navigation.page'
import MyAccount from '../../../../page-objects/my-account/MyAccount.Page'
import Checkout from '../../../../page-objects/checkout/Checkout.page'

const login = new Login()
const nav = new Nav()
const checkout = new Checkout()
const myAccount = new MyAccount()
const myOrders = '/my-account/order-history'

describe('Remember Me - My Account: Restricted actions for a partial authentication', () => {
  describe('Authenticated user receives an unauthorised response when navigating within my account', () => {
    beforeEach(() => {
      setFeatureFlag('FEATURE_REMEMBER_ME')
      checkout.mocksForCheckout({
        getAccount: user,
      })
      checkout.mocksForShoppingBag({
        setAuthStateCookie: 'yes',
        getItems: getBagItems,
      })
      cy.visit('/')
    })

    it('redirects to login when accessing my after receiving an unauthorised response', () => {
      if (isMobileLayout()) {
        nav.clickMobileBurgerMenu()
        nav.clickMyAccountIcon()
      } else {
        nav.clickMyProfile()
      }

      // stops all previous mock set up so we can provide a
      // different response to the second call to api/account
      cy.server({ enable: false })

      myAccount.mocksForAccountAndLogin({
        getOrderHistory401: restrictedActionResponse,
      })

      myAccount.clickNavigation(myOrders)

      cy.wait('@order-history-401')

      assertAuthState('partial')

      cy.location('pathname').should('eq', '/login')
      login.assertLoginFormValues({
        email: 'testymctest@arcadiagroup.co.uk',
        password: '',
        rememberMeChecked: true,
      })
    })
  })

  describe('Authenticated user becomes partially authenticated while navigating the site', () => {
    beforeEach(() => {
      setFeatureFlag('FEATURE_REMEMBER_ME')

      checkout.mocksForShoppingBag({
        setAuthStateCookie: 'yes',
        getItems: getBagItems,
      })
      checkout.mocksForCheckout({
        getAccount: user,
      })
      cy.visit('/')

      // I've reached the site as an authenticated user
      // Now set my auth state to partial
      setupPartialAuthState()
      assertAuthState('partial')
    })

    it('redirects to login when navigating to my-profile', () => {
      if (isMobileLayout()) {
        nav.clickMobileBurgerMenu()
        nav.clickMyAccountIcon()
      } else {
        nav.clickMyProfile()
      }

      cy.location('pathname').should('eq', '/login')
      login.assertLoginFormValues({
        email: 'testymctest@arcadiagroup.co.uk',
        password: '',
        rememberMeChecked: true,
      })
    })
  })
})
