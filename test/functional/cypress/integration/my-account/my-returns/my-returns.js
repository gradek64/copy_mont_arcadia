import MyAccountStart from '../../../page-objects/my-account/my-orders/MyOrders.page'
import ReturnsPage from '../../../page-objects/my-account/my-returns/MyReturns.page'
import accountProfile from './../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import myReturns from '../../../fixtures/my-account/returns-history.json'
import orderHistory from '../../../fixtures/my-account/order-history-32-orders.json'
import { isMobileLayout } from '../../../lib/helpers'

const myAccount = new MyAccountStart()
const returnsPage = new ReturnsPage()

const urls = {
  myAccount: '/my-account',
  myReturns: '/my-account/return-history',
}

if (isMobileLayout()) {
  describe('My Account - My Returns', () => {
    describe('Returns Navigation', () => {
      beforeEach(() => {
        returnsPage.mocksForAccountAndLogin({
          setAuthStateCookie: 'yes',
          getAccount: accountProfile,
          putAccountShort: accountProfile,
          getReturnHistory: myReturns,
          getOrderHistory: orderHistory,
        })

        cy.visit(urls.myReturns)
      })

      it('can access my returns from my account page', () => {
        myAccount
          .assertTextDisplayed(myAccount.accountPageTitle, 'My returns')
          .assertTextDisplayed('.OrderList-tagline', 'returns')
          .assertTextDisplayed('.AccountHeader-action', 'return')
          .assertLengthOfOrders(9)
      })

      it('should take user to my-orders when Start return button pressed', () => {
        returnsPage.clickViewOrdersStartReturn().wait('@order-history')

        cy.url().should('include', urls.myAccount)

        myAccount
          .assertTextDisplayed(myAccount.accountPageTitle, 'My orders')
          .assertLengthOfOrders(20)
      })
    })
  })
}
