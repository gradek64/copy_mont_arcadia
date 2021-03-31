import { setupMocksForMyOrders } from '../../../mock-helpers/orderHistoryDetailsMockSetup'
import MyOrders from '../../../page-objects/my-account/my-orders/MyOrders.page'
import orderHistory from '../../../fixtures/my-account/order-history.json'
import orderHistory32 from '../../../fixtures/my-account/order-history-32-orders.json'
import orderHistoryDetails from '../../../fixtures/my-account/order-history-details-one-item.json'
import accountProfile from './../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import MyOrderDetails from '../../../page-objects/my-account/my-orders/MyOrderDetails.page'
import { isMobileLayout } from '../../../lib/helpers'

const myOrders = new MyOrders()
const myOrderDetails = new MyOrderDetails()
const orderNumber = orderHistoryDetails.orderId

const urls = {
  myAccount: '/my-account',
  myOrders: '/my-account/order-history',
  myOrderDetails: `/my-account/order-history/${orderNumber}`,
}

if (isMobileLayout()) {
  describe('My Account - My Orders List', () => {
    beforeEach(() => {
      setupMocksForMyOrders(orderHistory, orderHistoryDetails)
      myOrderDetails.setupMocksForAccountAndLogin({
        getAccount: accountProfile,
      })
      cy.visit(urls.myAccount)
    })

    describe('Navigating from my account ', () => {
      it('Should display any orders records when available', () => {
        myOrders.navigateToOrderList(urls)
        myOrders.assertLengthOfOrders(9)
      })

      it('When clicking on a order it should take me to the order details', () => {
        myOrderDetails.navigateToOrderDetails(urls)
        cy.url().should('include', urls.myOrderDetails)
      })

      it('Should take you back to main my account dash board ', () => {
        myOrders.navigateToOrderList(urls)
        myOrders.clickMyAccount()
        cy.url().should('include', urls.myAccount)
      })

      it('Should display orders not found when there are no records', () => {
        const noOrders = { orders: [] }
        setupMocksForMyOrders(noOrders, orderHistoryDetails)
        myOrders.navigateToOrderList(urls)
        myOrders.assertOrdersNotFound()
      })
    })
  })
  describe('My Account - My Restricted Orders List', () => {
    beforeEach(() => {
      setupMocksForMyOrders(orderHistory32, orderHistoryDetails)
      myOrderDetails.setupMocksForAccountAndLogin({
        getAccount: accountProfile,
      })
      cy.visit(urls.myAccount)
    })

    describe('Navigating from my account ', () => {
      it('Should display only the first 20 orders', () => {
        myOrders.navigateToOrderList(urls)
        myOrders.assertLengthOfOrders(20)
      })
    })
  })
}
