import {
  setFeature,
  setFeatureFlag,
  isMobileLayout,
} from '../../../../lib/helpers'
import { setupMocksForOrderHistoryDetails } from '../../../../mock-helpers/orderHistoryDetailsMockSetup'
import MyOrderDetails from '../../../../page-objects/my-account/my-orders/MyOrderDetails.page'
import MyAccount from '../../../../page-objects/my-account/MyAccount.Page'
import orderHistory from '../../../../fixtures/my-account/order-history--trackMyOrder.json'
import accountProfile from '../../../../fixtures/login/fullCheckoutProfile--trackMyOrders.json'

const myOrderDetails = new MyOrderDetails()
const myAccount = new MyAccount()
const FEATURE = 'FEATURE_TRACK_ORDERS'
const deliveryType = {
  collectFromStore: 'S',
}
if (isMobileLayout()) {
  describe('My Account - Track My Order Button', () => {
    describe('Track my order feature is active', () => {
      beforeEach(() => {
        myAccount.mocksForAccountAndLogin({
          setAuthStateCookie: 'yes',
          account: accountProfile,
        })
        setupMocksForOrderHistoryDetails(orderHistory)
        cy.visit('/my-account')
        myOrderDetails.navigateToOrderHistory().wait('@order-history')
        setFeature(FEATURE)
      })

      /* DDP order is fully dispatched in one shipment */
      it('should not activate order tracking for DDP order', () => {
        const ordnum = '9507091'
        myOrderDetails
          .navigateToOrderHistory(`/${ordnum}`)
          .wait(`@order-history-${ordnum}`)
        cy.get(myOrderDetails.notYetDispatchedButton)
          .should('not.be.visible')
          .get(myOrderDetails.trackOrderButton)
          .should('not.be.visible')
        cy.get(myOrderDetails.deliveryEstimateMessage).should('not.be.visible')
        cy.get(myOrderDetails.orderStatusMessage).should('not.be.visible')
      })

      /* no tracking for Swedish delivery address */
      it('should not show order tracking for non-uk order', () => {
        const ordnum = '9507092'
        myOrderDetails
          .navigateToOrderHistory(`/${ordnum}`)
          .wait(`@order-history-${ordnum}`)
        cy.get(myOrderDetails.notYetDispatchedButton)
          .should('not.be.visible')
          .get(myOrderDetails.trackOrderButton)
          .should('not.be.visible')
      })

      /* Single item order is fully dispatched in one shipment ADP-1326 */
      it('should contain tracking and order numbers in CTA', () => {
        const ordnum = '9509773'
        myOrderDetails
          .navigateToOrderHistory(`/${ordnum}`)
          .waitThenAssertHeaderRender(`@order-history-${ordnum}`)
          .assertTrackingContainerContents(ordnum, 1, 1, true)
      })

      /* Collect from store */
      it('should not show track-my-order CTA for collect-from-store', () => {
        const ordnum = '9572052'

        myOrderDetails
          .navigateToOrderHistory(`/${ordnum}`)
          .waitThenAssertHeaderRender(`@order-history-${ordnum}`)
          .assertTrackingContainerContents(
            ordnum,
            1,
            1,
            '',
            deliveryType.collectFromStore
          )
      })

      /* Multi item order is fully dispatched in one shipment ADP-1327 */
      it('should show one track-my-order CTA for all items in a shipment', () => {
        const ordnum = '9509696'
        myOrderDetails
          .navigateToOrderHistory(`/${ordnum}`)
          .waitThenAssertHeaderRender(`@order-history-${ordnum}`)
          .assertTrackingContainerContents(ordnum, 1, 2, true)
      })

      /* Order is fully dispatched with multiple shipments ADP-1327 */
      it('should show one track-my-order CTA for each shipment', () => {
        const ordnum = '9507631'
        myOrderDetails
          .navigateToOrderHistory(`/${ordnum}`)
          .waitThenAssertHeaderRender(`@order-history-${ordnum}`)
          .assertTrackingContainerContents(ordnum, 1, 2, true)
          .assertTrackingContainerContents(ordnum, 2, 2, true)
      })

      /* Order is partially dispatched with multiple shipments ADP-1327 */
      it('should show mixed tracking states for partial shipment', () => {
        const ordnum = '9509808'
        myOrderDetails
          .navigateToOrderHistory(`/${ordnum}`)
          .waitThenAssertHeaderRender(`@order-history-${ordnum}`)
          .assertTrackingContainerContents(ordnum, 1, 3, true)
          .assertTrackingContainerContents(ordnum, 2, 2, true)
          .assertTrackingContainerContents(ordnum, 3, 1, true)
          .assertTrackingContainerContents(ordnum, 4, 1, false)
      })

      it('should not show tracking for DDP item within partial shipment', () => {
        const ordnum = '9507632'
        myOrderDetails
          .navigateToOrderHistory(`/${ordnum}`)
          .waitThenAssertHeaderRender(`@order-history-${ordnum}`)
          .assertTrackingContainerContents(ordnum, 1, 2, true)
          .assertTrackingContainerContents(ordnum, 2, 1, false)
      })
    })

    describe('Track my order feature is not active', () => {
      beforeEach(() => {
        setFeatureFlag(FEATURE, false)
        myAccount.mocksForAccountAndLogin({
          setAuthStateCookie: 'yes',
          account: accountProfile,
        })
        setupMocksForOrderHistoryDetails(orderHistory)
        cy.visit('/my-account')
        myOrderDetails.navigateToOrderHistory().wait('@order-history')
      })

      it('should not show order tracking for dispatched order', () => {
        const ordnum = '9509773'
        myOrderDetails
          .navigateToOrderHistory(`/${ordnum}`)
          .wait(`@order-history-${ordnum}`)

        cy.get(myOrderDetails.notYetDispatchedButton)
          .should('not.be.visible')
          .get(myOrderDetails.trackOrderButton)
          .should('not.be.visible')
      })
    })
  })
}
