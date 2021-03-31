import getLastGtmEventOfType from '../../../../lib/getLastGtmEventOfType'
import { apiResponse, clickEvent } from '../../../../lib/filters'
import PaymentPage from '../../../../page-objects/checkout/Payment.page'
import ThankyouPage from '../../../../page-objects/checkout/ThankYou.page'
import orderSummary from '../../../../fixtures/checkout/order_summary---returningUserSingleSizeProd.json'
import checkoutProfileNewUser from '../../../../fixtures/checkout/account--returningUserFullCheckoutProfile.json'
import orderComplete from '../../../../fixtures/checkout/order--returningUserSingleSizeProd-visa.json'
import { isMobileLayout } from '../../../../lib/helpers'

const paymentPage = new PaymentPage()
const thankyouPage = new ThankyouPage()

if (isMobileLayout()) {
  describe('GTM Analytics for payment page events', () => {
    beforeEach(() => {
      paymentPage.mocksForCheckout({
        bagCountCookie: '1',
        setAuthStateCookie: 'yes',
        getOrderSummary: orderSummary,
        getAccount: checkoutProfileNewUser,
        postOrder: orderComplete,
      })
      cy.visit('/checkout/payment')
      cy.wait('@account')
    })

    describe('Journey/page load events', () => {
      it('should create new "eventCategory", "apiEndpoint and "userState" events', () => {
        getLastGtmEventOfType('eventCategory').then((event) => {
          expect(event.eventAction).to.equal('Payment')
          expect(event.eventCategory).to.equal('Checkout')
          expect(event.eventLabel).to.equal('Billing Options')
        })

        cy.filterGtmEvents({
          filter: apiResponse('api/account'),
          timeout: 8000,
        }).then((event) => {
          expect(event.apiMethod).to.equal('GET')
          expect(event.apiEndpoint).to.equal('api/account')
          expect(event.platform).to.equal('monty')
          expect(event.responseCode).to.equal(200)
        })

        getLastGtmEventOfType('event', 'userState').then((event) => {
          expect(event.user.isDDPUser).to.equal('True')
          expect(event.user.id).to.equal(
            JSON.stringify(checkoutProfileNewUser.userTrackingId)
          )
          expect(event.user.loggedIn).to.equal('True')
        })
      })
    })

    describe('Successful payment events', () => {
      it('should create "clickEvent", "apiEndpoint", "purchase" and "orderComplete" events when I successfully pay', () => {
        paymentPage
          .enterCVVNumber()
          .clickOrderButton()
          .wait('@order-complete')

        thankyouPage.assertContinueShoppingOnThankYouPage()

        cy.filterGtmEvents({
          filter: clickEvent,
          timeout: 8000,
        }).then((event) => {
          expect(event.ea).to.equal('clicked')
          expect(event.ec).to.equal('checkout')
          expect(event.el).to.equal('confirm-and-pay')
        })

        cy.filterGtmEvents({
          filter: apiResponse('api/order'),
          timeout: 8000,
        }).then((event) => {
          expect(event.apiMethod).to.equal('POST')
          expect(event.platform).to.equal('monty')
          expect(event.responseCode).to.equal(200)
        })

        getLastGtmEventOfType('orderId').then((event) => {
          expect(event.event).to.equal('orderComplete')
          expect(event.deliveryMethod).to.equal('UK Standard up to 4 days')
          expect(event.paymentMethods[0]).to.equal('Visa')
          expect(event.orderId).to.equal(orderComplete.completedOrder.orderId)
        })

        getLastGtmEventOfType('ecommerce', 'purchase').then((event) => {
          expect(event.fullBasket.totalQuantity).to.equal(0)
          expect(event.fullBasket.totalPrice).to.equal(0)
        })
      })
    })
  })
}
