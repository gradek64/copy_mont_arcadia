import { isDesktopLayout } from '../../../lib/helpers'
import Checkout from '../../../page-objects/checkout/Checkout.page'
import orderSummary from '../../../fixtures/checkout/order_summary---returningUserSingleSizeProd.json'
import orderSummaryNewUser from '../../../fixtures/checkout/testOrderSummary.json'
import checkoutProfile from '../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import checkoutProfileNewUser from '../../../fixtures/checkout/account--newUserEmpty.json'
import checkoutDeliveryNewUser from '../../../fixtures/checkout/account--newUser.json'
import * as EventFilters from '../../../lib/filters'
import * as Schemas from '../../../lib/schemas'
import '../../../lib/tcombSchemaExtensions'

const checkoutMocks = new Checkout()

if (isDesktopLayout()) {
  describe('checkout step for not logged user', () => {
    it('CheckoutLogin page has checkout step events in the dataLayer', () => {
      checkoutMocks.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummaryNewUser,
        getAccount: checkoutProfileNewUser,
      })
      cy.visit('checkout/login')

      cy.filterGtmEvents({
        filter: EventFilters.ecommerceCheckoutStep(1),
        timeout: 15000,
        name: 'CheckoutStep1',
      }).then((event) => {
        expect(event).to.be.tcombSchema(Schemas.CheckoutStep1)
      })
      cy.filterGtmEvents({
        filter: EventFilters.pageViewEvent,
      }).then((event) => {
        expect(event.pageCategory).to.equal('TS:Register/Logon')
        expect(event.pageType).to.equal('TS:Register/Logon')
      })
    })

    it('Delivery form completed then PaymentDetails page has payment-details step in the dataLayer', () => {
      checkoutMocks.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummaryNewUser,
        getAccount: checkoutDeliveryNewUser,
      })
      cy.visit('/checkout/payment')

      cy.filterGtmEvents({
        filter: EventFilters.ecommerceCheckoutStep(3),
        timeout: 15000,
        name: 'CheckoutStep3',
      }).then((event) => {
        expect(event).to.be.tcombSchema(Schemas.CheckoutStep3)
      })
      cy.filterGtmEvents({
        filter: EventFilters.pageViewEvent,
      }).then((event) => {
        expect(event.pageCategory).to.equal('TS:Payment Details Form')
        expect(event.pageType).to.equal('TS:Payment Details')
      })
    })
  })
  describe('checkout steps for a new User', () => {
    it('DeliveryDetails page has checkout step events in the dataLayer', () => {
      checkoutMocks.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummaryNewUser,
        getAccount: checkoutProfileNewUser,
      })
      cy.visit('checkout/delivery?new-user')

      cy.filterGtmEvents({
        filter: EventFilters.ecommerceCheckoutStep(2),
        timeout: 15000,
        name: 'CheckoutStep2',
      }).then((event) => {
        expect(event).to.be.tcombSchema(Schemas.CheckoutStep2)
      })
      cy.filterGtmEvents({
        filter: EventFilters.pageViewEvent,
      }).then((event) => {
        expect(event.pageCategory).to.equal('TS:Checkout')
        expect(event.pageType).to.equal('TS:Delivery Details')
      })
    })

    it('Delivery form completed then PaymentDetails page has payment-details step in the dataLayer', () => {
      checkoutMocks.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummaryNewUser,
        getAccount: checkoutDeliveryNewUser,
      })
      cy.visit('/checkout/payment')

      cy.filterGtmEvents({
        filter: EventFilters.ecommerceCheckoutStep(3),
        timeout: 15000,
        name: 'CheckoutStep4',
      }).then((event) => {
        expect(event).to.be.tcombSchema(Schemas.CheckoutStep3)
      })
      cy.filterGtmEvents({
        filter: EventFilters.pageViewEvent,
      }).then((event) => {
        expect(event.pageCategory).to.equal('TS:Payment Details Form')
        expect(event.pageType).to.equal('TS:Payment Details')
      })
    })
  })
  describe('checkout steps for the returning User', () => {
    beforeEach(() => {
      checkoutMocks.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummary,
        getAccount: checkoutProfile,
      })
      cy.visit('/checkout/delivery-payment')
    })

    it('DeliveryPayment page has checkout step events in the dataLayer', () => {
      cy.filterGtmEvents({
        filter: EventFilters.ecommerceCheckoutStep(4),
        timeout: 15000,
        name: 'CheckoutStep4',
      }).then((event) => {
        expect(event).to.be.tcombSchema(Schemas.CheckoutStep4)
      })
      cy.filterGtmEvents({
        filter: EventFilters.pageViewEvent,
      }).then((event) => {
        expect(event.pageCategory).to.equal('TS:Delivery Payment Form')
        expect(event.pageType).to.equal('TS:Delivery Payment')
      })
    })
  })
}
