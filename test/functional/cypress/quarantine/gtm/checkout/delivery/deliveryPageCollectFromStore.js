import Checkout from '../../../../page-objects/checkout/Checkout.page'
import getLastGtmEventOfType from '../../../../lib/getLastGtmEventOfType'
import { ecommerceCheckoutStep, pageViewEvent } from '../../../../lib/filters'
import * as Schemas from '../../../../lib/schemas'
import '../../../../lib/tcombSchemaExtensions'
import orderSummaryNewUser from '../../../../fixtures/checkout/order_summary---newUserSingleSizeProd.json'
import StoreLocatorPage from '../../../../page-objects/StoreLocator.page'
import checkoutProfileNewUser from '../../../../fixtures/checkout/account--newUserEmpty.json'
import orderSummaryCFS from '../../../../fixtures/checkout/order_summary---newUserSingleSizeProdCollectFromStoreDeliveryMethod.json'
import { setFeature, isMobileLayout } from '../../../../lib/helpers'

const strLoc = new StoreLocatorPage()
const checkoutMocks = new Checkout()

if (isMobileLayout()) {
  describe('GA events for (collect from store) on delivery page ', () => {
    beforeEach(() => {
      checkoutMocks.mocksForCheckout({
        setAuthStateCookie: 'yes',
        bagCountCookie: '1',
        putOrderSummary: orderSummaryNewUser,
        getOrderSummary: orderSummaryNewUser,
        getAccount: checkoutProfileNewUser,
      })
      strLoc.mocksForStoreLocator()
      cy.visit('checkout/delivery')
      cy.wait('@account')
      setFeature('FEATURE_CFS')
    })

    it('should contain pageView and checkoutStep events in the dataLayer', () => {
      cy.filterGtmEvents({
        filter: ecommerceCheckoutStep(2),
        timeout: 15000,
        name: 'CheckoutStep2',
      }).then((event) => {
        expect(event).to.be.tcombSchema(Schemas.CheckoutStep2)
      })

      cy.filterGtmEvents({
        filter: pageViewEvent,
      }).then((event) => {
        expect(event.pageCategory).to.equal('TS:Checkout')
        expect(event.pageType).to.equal('TS:Delivery Details')
      })
    })

    it('should contain "deliveryOptionChanged" event with "Collect from store"', () => {
      strLoc.selectCollectFromStoreDeliveryMethod()

      getLastGtmEventOfType('event', 'deliveryOptionChanged').then((event) => {
        expect(event.deliveryOption).to.equal('Collect from Store')
      })
    })

    it('should contain an "apiEndpoint" event with value "api/store-locator"', () => {
      strLoc.storeLocatorSearchInCheckout('London')

      cy.filterGtmEvents({
        filter: (dlItem) => dlItem.apiEndpoint === 'api/store-locator',
        timeout: 8000,
      }).then((event) => {
        expect(event.event).to.equal('apiResponse')
        expect(event.apiMethod).to.equal('GET')
      })
    })

    it('should contain an "apiResponse" event with method "PUT"', () => {
      strLoc
        .storeLocatorSearchInCheckout('London')
        .expandStoreDetailsFromList(1)
        .selectStoreButton()
        .wait('@put-order-summary')

      cy.filterGtmEvents({
        filter: (dlItem) => dlItem.apiEndpoint === 'api/checkout/order_summary',
        timeout: 8000,
      }).then((event) => {
        expect(event.event).to.equal('apiResponse')
        expect(event.apiMethod).to.equal('PUT')
      })
    })
  })

  describe('GA event for delivery method change ', () => {
    beforeEach(() => {
      checkoutMocks.mocksForCheckout({
        setAuthStateCookie: 'yes',
        bagCountCookie: '1',
        getOrderSummary: orderSummaryCFS,
        getAccount: checkoutProfileNewUser,
      })

      strLoc.mocksForStoreLocator()
      cy.visit('checkout/delivery')
      cy.wait('@account')
      setFeature('FEATURE_CFS')
    })

    it('should contain "deliveryMethodChanged" event with "Collect From Store Express"', () => {
      strLoc.selectStoreExpressDeliveryType()

      cy.filterGtmEvents({
        filter: (dlItem) => dlItem.event === 'deliveryMethodChanged',
        timeout: 8000,
      }).then((event) => {
        expect(event.deliveryMethod).to.equal('Collect From Store Express')
      })
    })
  })
}
