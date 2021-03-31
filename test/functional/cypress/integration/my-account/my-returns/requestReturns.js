import { setFeatureFlag, isMobileLayout } from '../../../lib/helpers'
import { setupMocksForMyOrders } from '../../../mock-helpers/orderHistoryDetailsMockSetup'

import MyOrderDetails from '../../../page-objects/my-account/my-orders/MyOrderDetails.page'
import orderHistory from '../../../fixtures/my-account/order-history.json'
import orderHistoryDetails from '../../../fixtures/my-account/order-history-details-one-item.json'
import accountProfile from '../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'

const myOrderDetails = new MyOrderDetails()
const orderNumber = orderHistoryDetails.orderId
const postCode = orderHistoryDetails.deliveryAddress.address4

const urls = {
  myAccount: '/my-account',
  myOrders: '/my-account/order-history',
  myOrderDetails: `/my-account/order-history/${orderNumber}`,
}
const FEATURE = 'FEATURE_ORDER_RETURNS'

if (isMobileLayout()) {
  describe('My Account - My Orders: Returns request', () => {
    beforeEach(() => {
      setupMocksForMyOrders(orderHistory, orderHistoryDetails)
      myOrderDetails.setupMocksForAccountAndLogin({
        account: accountProfile,
      })
    })

    describe('Order Returns is not available', () => {
      it('Should not display the "start a return" CTA when feature is off', () => {
        setFeatureFlag(FEATURE, false)
        setupMocksForMyOrders(orderHistory, orderHistoryDetails)
        cy.visit(urls.myAccount)
        myOrderDetails.navigateToOrderDetails(urls)
        cy.get(myOrderDetails.orderReturnsButton).should('not.to.exist')
      })

      it('Should not display if postcode or country is not from the UK and feature is on', () => {
        const orderHistoryDetailsFr = {
          ...orderHistoryDetails,
          deliveryAddress: {
            name: 'Dr France',
            address1: 'effiel tower',
            address2: '68-70 Berners Street',
            address3: 'Paris',
            address4: '2287128',
            country: 'France',
          },
        }

        setFeatureFlag(FEATURE)
        setupMocksForMyOrders(orderHistory, orderHistoryDetailsFr)
        cy.visit(urls.myAccount)
        myOrderDetails.navigateToOrderDetails(urls)
        myOrderDetails.assertNoReturnLink()
      })
    })

    describe('Order Returns feature is active', () => {
      beforeEach(() => {
        setFeatureFlag(FEATURE)
      })

      it('The "start a return" CTA link should contain order number and valid UK delivery postcode', () => {
        setupMocksForMyOrders(orderHistory, orderHistoryDetails)
        cy.visit(urls.myAccount)
        myOrderDetails.navigateToOrderDetails(urls)
        myOrderDetails.assertStartReturnLink(orderNumber, postCode)
      })

      it('The "start a return" CTA link should display if country is Guernsey', () => {
        const orderHistoryDetailsGR = {
          ...orderHistoryDetails,
          deliveryAddress: {
            name: 'Mr Elvis Presley',
            address1: 'Wallis',
            address2: 'Forest gump road',
            address3: 'Baby',
            address4: 'GY1 1WF',
            country: 'Guernsey',
          },
        }
        setupMocksForMyOrders(orderHistory, orderHistoryDetailsGR)
        cy.visit(urls.myAccount)
        myOrderDetails.navigateToOrderDetails(urls)
        myOrderDetails.assertStartReturnLink(
          orderNumber,
          orderHistoryDetailsGR.deliveryAddress.address4
        )
      })

      it('The "start a return" CTA link should display if country is Jersey', () => {
        const orderHistoryDetailsJR = {
          ...orderHistoryDetails,
          deliveryAddress: {
            name: 'Mr Elvis Presley',
            address1: 'Wallis',
            address2: 'Forest gump road',
            address3: 'Baby',
            address4: 'JE2 4WE',
            country: 'Jersey',
          },
        }
        setupMocksForMyOrders(orderHistory, orderHistoryDetailsJR)
        cy.visit(urls.myAccount)
        myOrderDetails.navigateToOrderDetails(urls)
        myOrderDetails.assertStartReturnLink(
          orderNumber,
          orderHistoryDetailsJR.deliveryAddress.address4
        )
      })

      it('The "start a return" CTA should display if statusCode is D', () => {
        // Different statusCode are covered in the unit tests to increase speed for tests for these multiple scenarios
        const orderHistoryDetailsFailedStatusCode = {
          ...orderHistoryDetails,
          statusCode: 'D',
        }
        setupMocksForMyOrders(orderHistory, orderHistoryDetailsFailedStatusCode)
        cy.visit(urls.myAccount)
        myOrderDetails.navigateToOrderDetails(urls)
        myOrderDetails.assertStartReturnLink(
          orderNumber,
          orderHistoryDetailsFailedStatusCode.deliveryAddress.address4
        )
      })

      it('The "start a return" CTA should not display if statusCode is r', () => {
        const orderHistoryDetailsFailedStatusCode = {
          ...orderHistoryDetails,
          statusCode: 'r',
        }
        setupMocksForMyOrders(orderHistory, orderHistoryDetailsFailedStatusCode)
        cy.visit(urls.myAccount)
        myOrderDetails.navigateToOrderDetails(urls)
        myOrderDetails.assertNoReturnLink()
      })

      it('The "start a return" CTA should not display if isOrderFullyRefunded is true', () => {
        const orderHistoryDetailsFailedStatusCode = {
          ...orderHistoryDetails,
          isOrderFullyRefunded: true,
        }
        setupMocksForMyOrders(orderHistory, orderHistoryDetailsFailedStatusCode)
        cy.visit(urls.myAccount)
        myOrderDetails.navigateToOrderDetails(urls)
        myOrderDetails.assertNoReturnLink()
      })

      it('The "start a return" CTA should not display if statusCode is not valid', () => {
        // Different statusCode are covered in the unit tests to increase speed for tests for these multiple scenarios
        const orderHistoryDetailsFailedStatusCode = {
          ...orderHistoryDetails,
          statusCode: 'M',
        }
        setupMocksForMyOrders(orderHistory, orderHistoryDetailsFailedStatusCode)
        cy.visit(urls.myAccount)
        myOrderDetails.navigateToOrderDetails(urls)
        myOrderDetails.assertNoReturnLink()
      })
    })
  })
}
